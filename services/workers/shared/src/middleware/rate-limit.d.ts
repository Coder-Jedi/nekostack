import { RequestContext, MiddlewareResult, RateLimitInfo } from '../types';
export interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (context: RequestContext) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    message?: string;
}
export declare function rateLimitMiddleware(options?: Partial<RateLimitOptions>): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function userRateLimitMiddleware(options?: Partial<RateLimitOptions>): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function endpointRateLimitMiddleware(options?: Partial<RateLimitOptions>): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function apiKeyRateLimitMiddleware(options?: Partial<RateLimitOptions>): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function getRateLimitInfo(context: RequestContext): RateLimitInfo | null;
export declare function addRateLimitHeaders(response: Response, context: RequestContext): Response;
export declare function createRateLimitKey(prefix: string, identifier: string, windowStart: number): string;
export declare function shouldRateLimit(requestCount: number, maxRequests: number, skipSuccessful?: boolean, skipFailed?: boolean, isSuccess?: boolean): boolean;
export declare function getClientIP(request: Request): string;
export declare function getUserAgent(request: Request): string;
//# sourceMappingURL=rate-limit.d.ts.map