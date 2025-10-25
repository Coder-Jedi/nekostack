import { RequestContext, MiddlewareResult } from '../types';
export interface AuthOptions {
    required?: boolean;
    skipPaths?: string[];
    tokenHeader?: string;
    tokenPrefix?: string;
}
export declare function authMiddleware(options?: Partial<AuthOptions>): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function optionalAuthMiddleware(options?: Partial<AuthOptions>): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function publicRoutesMiddleware(skipPaths?: string[]): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function adminAuthMiddleware(options?: Partial<AuthOptions>): (context: RequestContext) => Promise<MiddlewareResult>;
export declare function extractUserIdFromToken(token: string): string | null;
export declare function isTokenExpired(token: string): boolean;
export declare function getTokenFromRequest(request: Request, headerName?: string, prefix?: string): string | null;
export declare function createAuthContext(user: any): Partial<RequestContext>;
//# sourceMappingURL=auth.d.ts.map