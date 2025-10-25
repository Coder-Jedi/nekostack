import { RequestContext, MiddlewareResult } from '../types';
export interface CORSOptions {
    origins?: string[];
    methods?: string[];
    headers?: string[];
    maxAge?: number;
    credentials?: boolean;
}
export declare function corsMiddleware(options?: CORSOptions): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function createCORSResponse(origin: string | null, config: Required<CORSOptions>): Response;
export declare function addCORSHeaders(response: Response, context: RequestContext): Response;
export declare function isPreflightRequest(request: Request): boolean;
export declare function getAllowedOrigins(env: any): string[];
export declare function createCORSFromEnv(env: any): (context: RequestContext) => Promise<MiddlewareResult>;
//# sourceMappingURL=cors.d.ts.map