// Simple router implementation for Cloudflare Workers

import { RequestContext } from '../../../shared/src/types';

export interface Route {
  method: string;
  path: string;
  handler: (context: RequestContext) => Promise<Response>;
  middleware?: (context: RequestContext) => Promise<Response> | undefined; // Fix TypeScript strict mode
}

export class Router {
  private routes: Route[] = [];

  // Add a route
  add(method: string, path: string, handler: (context: RequestContext) => Promise<Response>, middleware?: (context: RequestContext) => Promise<Response>): void {
    const route: Route = { method, path, handler };
    if (middleware) {
      route.middleware = middleware;
    }
    this.routes.push(route);
  }

  // Add GET route
  get(path: string, handler: (context: RequestContext) => Promise<Response>, middleware?: (context: RequestContext) => Promise<Response>): void {
    this.add('GET', path, handler, middleware);
  }

  // Add POST route
  post(path: string, handler: (context: RequestContext) => Promise<Response>, middleware?: (context: RequestContext) => Promise<Response>): void {
    this.add('POST', path, handler, middleware);
  }

  // Add PUT route
  put(path: string, handler: (context: RequestContext) => Promise<Response>, middleware?: (context: RequestContext) => Promise<Response>): void {
    this.add('PUT', path, handler, middleware);
  }

  // Add DELETE route
  delete(path: string, handler: (context: RequestContext) => Promise<Response>, middleware?: (context: RequestContext) => Promise<Response>): void {
    this.add('DELETE', path, handler, middleware);
  }

  // Add OPTIONS route
  options(path: string, handler: (context: RequestContext) => Promise<Response>): void {
    this.add('OPTIONS', path, handler);
  }

  // Handle request
  async handle(context: RequestContext): Promise<Response> {
    const { request } = context;
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    // Find matching route
    const route = this.findRoute(method, pathname);
    
    if (!route) {
      return new Response('Not Found', { status: 404 });
    }

    try {
      // Apply per-route middleware if defined
      if (route.middleware) {
        const middlewareResult = await route.middleware(context);
        if (middlewareResult && middlewareResult.status !== 200) {
          return middlewareResult;
        }
      }
      
      return await route.handler(context);
    } catch (error) {
      console.error('Route handler error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // Find matching route
  private findRoute(method: string, pathname: string): Route | null {
    return this.routes.find(route => {
      if (route.method !== method) return false;
      return this.matchPath(route.path, pathname);
    }) || null;
  }

  // Match path with parameters
  private matchPath(pattern: string, pathname: string): boolean {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\//g, '\\/')
      .replace(/:([^/]+)/g, '([^/]+)')
      .replace(/\*/g, '.*');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  // Extract path parameters
  extractParams(pattern: string, pathname: string): Record<string, string> {
    const params: Record<string, string> = {};
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart && patternPart.startsWith(':')) {
        const paramName = patternPart.substring(1);
        if (pathPart) {
          params[paramName] = pathPart;
        }
      }
    }

    return params;
  }

  // Get all routes (for debugging)
  getRoutes(): Route[] {
    return [...this.routes];
  }
}

// Helper function to create router
export function createRouter(): Router {
  return new Router();
}
