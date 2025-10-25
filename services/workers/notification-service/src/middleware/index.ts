// Middleware chain for Notification Service

import { RequestContext, MiddlewareResult } from '../../../shared/src/types';
import { corsMiddleware } from '../../../shared/src/middleware/cors';
import { rateLimitMiddleware } from '../../../shared/src/middleware/rate-limit';
import { authMiddleware, publicRoutesMiddleware } from '../../../shared/src/middleware/auth';
import { addCORSHeaders, addRateLimitHeaders } from '../../../shared/src/utils/response';

export interface MiddlewareOptions {
  enableCORS?: boolean;
  enableRateLimit?: boolean;
  enableAuth?: boolean;
  rateLimitOptions?: any;
  corsOptions?: any;
  authOptions?: any;
}

const DEFAULT_OPTIONS: Required<MiddlewareOptions> = {
  enableCORS: true,
  enableRateLimit: true,
  enableAuth: false,
  rateLimitOptions: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
  },
  corsOptions: {},
  authOptions: {
    required: false,
    skipPaths: []
  }
};

export function createMiddlewareChain(options: Partial<MiddlewareOptions> = {}): (context: RequestContext) => Promise<Response> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return async (context: RequestContext): Promise<Response> => {
    try {
      // Apply CORS middleware
      if (config.enableCORS) {
        const corsResult = await corsMiddleware(config.corsOptions)(context);
        if (!corsResult.success) {
          return corsResult.response!;
        }
        // Merge CORS headers into context
        if (corsResult.context?.corsHeaders) {
          context.corsHeaders = { ...context.corsHeaders, ...corsResult.context.corsHeaders };
        }
      }

      // Apply rate limiting middleware
      if (config.enableRateLimit) {
        const rateLimitResult = await rateLimitMiddleware(config.rateLimitOptions)(context);
        if (!rateLimitResult.success) {
          return rateLimitResult.response!;
        }
        // Merge rate limit info into context
        if (rateLimitResult.context?.rateLimitInfo) {
          context.rateLimitInfo = rateLimitResult.context.rateLimitInfo;
        }
      }

      // Apply authentication middleware
      if (config.enableAuth) {
        const authResult = await authMiddleware(config.authOptions)(context);
        if (!authResult.success) {
          return authResult.response!;
        }
        // Merge user info into context
        if (authResult.context?.user_id) {
          context.user_id = authResult.context.user_id;
        }
        if (authResult.context?.user) {
          context.user = authResult.context.user;
        }
      }

      return new Response('Middleware chain completed', { status: 200 });
    } catch (error) {
      console.error('Middleware chain error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  };
}

// Helper function to apply middleware to response
export function applyMiddlewareToResponse(response: Response, context: RequestContext): Response {
  let finalResponse = response;

  // Apply CORS headers
  if (context.corsHeaders) {
    finalResponse = addCORSHeaders(finalResponse);
  }

  // Apply rate limit headers
  if (context.rateLimitInfo) {
    finalResponse = addRateLimitHeaders(finalResponse, context);
  }

  return finalResponse;
}

// Public routes middleware (no auth required)
export function createPublicMiddleware(): (context: RequestContext) => Promise<Response> {
  return createMiddlewareChain({
    enableCORS: true,
    enableRateLimit: true,
    enableAuth: false
  });
}

// Protected routes middleware (auth required)
export function createProtectedMiddleware(): (context: RequestContext) => Promise<Response> {
  return createMiddlewareChain({
    enableCORS: true,
    enableRateLimit: true,
    enableAuth: true,
    authOptions: {
      required: true,
      skipPaths: []
    }
  });
}

// High rate limit for public APIs
export function createHighRateLimitMiddleware(): (context: RequestContext) => Promise<Response> {
  return createMiddlewareChain({
    enableCORS: true,
    enableRateLimit: true,
    enableAuth: false,
    rateLimitOptions: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 1000 // Higher limit for public APIs
    }
  });
}

// Low rate limit for sensitive operations
export function createLowRateLimitMiddleware(): (context: RequestContext) => Promise<Response> {
  return createMiddlewareChain({
    enableCORS: true,
    enableRateLimit: true,
    enableAuth: true,
    rateLimitOptions: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 10 // Lower limit for sensitive operations
    }
  });
}
