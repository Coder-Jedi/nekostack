// Rate limiting middleware for Cloudflare Workers

import { RequestContext, MiddlewareResult, RateLimitInfo } from '../types';
import { createRateLimitResponse } from '../utils/response';
import { createKVClient } from '../kv/kv-client';

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (context: RequestContext) => string; // Function to generate rate limit key
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  message?: string; // Custom error message
}

const DEFAULT_OPTIONS: Required<RateLimitOptions> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 1000, // Increased from 100 to 1000 for better development experience
  keyGenerator: (context) => {
    const ip = context.request.headers.get('CF-Connecting-IP') || 
               context.request.headers.get('X-Forwarded-For') || 
               'unknown';
    return `rate_limit:${ip}`;
  },
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  message: 'Rate limit exceeded. Please try again later.'
};

export function rateLimitMiddleware(options: Partial<RateLimitOptions> = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return async (context: RequestContext): Promise<MiddlewareResult> => {
    const kv = createKVClient(context.env);
    const key = config.keyGenerator(context);
    const now = Date.now();
    const windowStart = Math.floor(now / config.windowMs) * config.windowMs;
    const windowKey = `${key}:${windowStart}`;

    try {
      // Get current request count for this window
      const currentCount = await kv.get<number>(windowKey, false) || 0;

      // Check if limit exceeded
      if (currentCount >= config.maxRequests) {
        const resetTime = windowStart + config.windowMs;
        const retryAfter = Math.ceil((resetTime - now) / 1000);

        return {
          success: false,
          response: createRateLimitResponse(
            config.message,
            retryAfter,
            context.request_id
          )
        };
      }

      // Increment counter
      await kv.setWithExpiration(
        windowKey,
        (currentCount + 1).toString(),
        Math.ceil(config.windowMs / 1000)
      );

      // Add rate limit info to context
      context.rateLimitInfo = {
        limit: config.maxRequests,
        remaining: Math.max(0, config.maxRequests - currentCount - 1),
        reset: windowStart + config.windowMs
      };

      return { success: true };
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // On error, allow the request to proceed
      return { success: true };
    }
  };
}

// Per-user rate limiting
export function userRateLimitMiddleware(options: Partial<RateLimitOptions> = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  const config = {
    ...DEFAULT_OPTIONS,
    keyGenerator: (context: RequestContext) => {
      const userId = context.user_id || 'anonymous';
      return `user_rate_limit:${userId}`;
    },
    ...options
  };

  return rateLimitMiddleware(config);
}

// Per-endpoint rate limiting
export function endpointRateLimitMiddleware(options: Partial<RateLimitOptions> = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  const config = {
    ...DEFAULT_OPTIONS,
    keyGenerator: (context: RequestContext) => {
      const url = new URL(context.request.url);
      const endpoint = url.pathname;
      const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
      return `endpoint_rate_limit:${endpoint}:${ip}`;
    },
    ...options
  };

  return rateLimitMiddleware(config);
}

// API key rate limiting
export function apiKeyRateLimitMiddleware(options: Partial<RateLimitOptions> = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  const config = {
    ...DEFAULT_OPTIONS,
    keyGenerator: (context: RequestContext) => {
      const apiKey = context.request.headers.get('X-API-Key') || 'no-key';
      return `api_rate_limit:${apiKey}`;
    },
    ...options
  };

  return rateLimitMiddleware(config);
}

// Helper function to get rate limit info from context
export function getRateLimitInfo(context: RequestContext): RateLimitInfo | null {
  return context.rateLimitInfo || null;
}

// Helper function to add rate limit headers to response
export function addRateLimitHeaders(response: Response, context: RequestContext): Response {
  const rateLimitInfo = getRateLimitInfo(context);
  if (!rateLimitInfo) {
    return response;
  }

  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  newResponse.headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString());
  newResponse.headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString());
  newResponse.headers.set('X-RateLimit-Reset', new Date(rateLimitInfo.reset).toISOString());

  return newResponse;
}

// Helper function to create rate limit key
export function createRateLimitKey(prefix: string, identifier: string, windowStart: number): string {
  return `${prefix}:${identifier}:${windowStart}`;
}

// Helper function to check if request should be rate limited
export function shouldRateLimit(
  requestCount: number,
  maxRequests: number,
  skipSuccessful: boolean = false,
  skipFailed: boolean = false,
  isSuccess: boolean = true
): boolean {
  if (skipSuccessful && isSuccess) return false;
  if (skipFailed && !isSuccess) return false;
  
  return requestCount >= maxRequests;
}

// Helper function to get client IP
export function getClientIP(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For') || 
         request.headers.get('X-Real-IP') || 
         'unknown';
}

// Helper function to get user agent
export function getUserAgent(request: Request): string {
  return request.headers.get('User-Agent') || 'unknown';
}
