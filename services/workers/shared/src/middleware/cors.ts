// CORS middleware for Cloudflare Workers

import { RequestContext, MiddlewareResult } from '../types';
import { createCORSResponse as createCORSResponseUtil, handleOptionsRequest } from '../utils/response';

export interface CORSOptions {
  origins?: string[];
  methods?: string[];
  headers?: string[];
  maxAge?: number;
  credentials?: boolean;
}

const DEFAULT_OPTIONS: Required<CORSOptions> = {
  origins: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  credentials: false
};

export function corsMiddleware(options: CORSOptions = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return async (context: RequestContext): Promise<MiddlewareResult> => {
    const { request } = context;
    const origin = request.headers.get('Origin');

    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return {
        success: true,
        response: createCORSResponseUtil()
      };
    }

    // Check origin if not allowing all
    if (!config.origins.includes('*') && origin) {
      if (!config.origins.includes(origin)) {
        return {
          success: false,
          response: new Response('CORS: Origin not allowed', { status: 403 })
        };
      }
    }

    // Add CORS headers to the context for later use
    context.corsHeaders = {
      'Access-Control-Allow-Origin': config.origins.includes('*') ? '*' : origin || '*',
      'Access-Control-Allow-Methods': config.methods.join(', '),
      'Access-Control-Allow-Headers': config.headers.join(', '),
      'Access-Control-Max-Age': config.maxAge.toString()
    };

    if (config.credentials) {
      context.corsHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    return { success: true };
  };
}

export function createCORSResponse(origin: string | null, config: Required<CORSOptions>): Response {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': config.origins.includes('*') ? '*' : origin || '*',
    'Access-Control-Allow-Methods': config.methods.join(', '),
    'Access-Control-Allow-Headers': config.headers.join(', '),
    'Access-Control-Max-Age': config.maxAge.toString()
  };

  if (config.credentials) {
    headers['Access-Control-Allow-Credentials'] = 'true';
  }

  return new Response(null, {
    status: 204,
    headers
  });
}

export function addCORSHeaders(response: Response, context: RequestContext): Response {
  if (!context.corsHeaders) {
    return response;
  }

  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  // Add CORS headers
  Object.entries(context.corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });

  return newResponse;
}

// Helper function to check if request is preflight
export function isPreflightRequest(request: Request): boolean {
  return request.method === 'OPTIONS' && 
         request.headers.get('Access-Control-Request-Method') !== null;
}

// Helper function to get allowed origins from environment
export function getAllowedOrigins(env: any): string[] {
  const origins = env.ALLOWED_ORIGINS;
  if (!origins) return ['*'];
  
  return origins.split(',').map((origin: string) => origin.trim());
}

// Helper function to create CORS middleware with environment-based config
export function createCORSFromEnv(env: any): (context: RequestContext) => Promise<MiddlewareResult> {
  const origins = getAllowedOrigins(env);
  
  return corsMiddleware({
    origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400,
    credentials: env.CORS_CREDENTIALS === 'true'
  });
}
