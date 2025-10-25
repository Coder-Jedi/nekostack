// JWT validation middleware for Cloudflare Workers
import { createUnauthorizedResponse } from '../utils/response';
const DEFAULT_OPTIONS = {
    required: true,
    skipPaths: [],
    tokenHeader: 'Authorization',
    tokenPrefix: 'Bearer '
};
export function authMiddleware(options = {}) {
    const config = { ...DEFAULT_OPTIONS, ...options };
    return async (context) => {
        const { request } = context;
        const url = new URL(request.url);
        // Check if path should be skipped
        if (config.skipPaths.some(path => url.pathname.startsWith(path))) {
            return { success: true };
        }
        // Get token from header
        const authHeader = request.headers.get(config.tokenHeader);
        if (!authHeader) {
            if (config.required) {
                return {
                    success: false,
                    response: createUnauthorizedResponse('Authorization header required', context.request_id)
                };
            }
            return { success: true };
        }
        // Extract token
        let token = authHeader;
        if (config.tokenPrefix && authHeader.startsWith(config.tokenPrefix)) {
            token = authHeader.substring(config.tokenPrefix.length);
        }
        // Validate token
        try {
            const user = await validateJWT(token, context.env);
            if (!user) {
                if (config.required) {
                    return {
                        success: false,
                        response: createUnauthorizedResponse('Invalid or expired token', context.request_id)
                    };
                }
                return { success: true };
            }
            // Add user info to context
            context.user_id = user.id;
            context.user = user;
            return { success: true };
        }
        catch (error) {
            console.error('Auth middleware error:', error);
            if (config.required) {
                return {
                    success: false,
                    response: createUnauthorizedResponse('Token validation failed', context.request_id)
                };
            }
            return { success: true };
        }
    };
}
// Optional authentication middleware
export function optionalAuthMiddleware(options = {}) {
    return authMiddleware({ ...options, required: false });
}
// Public routes middleware (no authentication required)
export function publicRoutesMiddleware(skipPaths = []) {
    return authMiddleware({ required: false, skipPaths });
}
// Admin routes middleware (requires admin role)
export function adminAuthMiddleware(options = {}) {
    return async (context) => {
        // First check basic auth
        const authResult = await authMiddleware(options)(context);
        if (!authResult.success) {
            return authResult;
        }
        // Check if user has admin role
        if (!context.user?.is_admin) {
            return {
                success: false,
                response: createUnauthorizedResponse('Admin access required', context.request_id)
            };
        }
        return { success: true };
    };
}
// Helper function to validate JWT token
async function validateJWT(token, env) {
    try {
        // For now, we'll do basic JWT validation
        // In production, you'd want to verify the signature with Supabase
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        const payload = JSON.parse(atob(parts[1] || ''));
        // Check expiration
        if (payload.exp && payload.exp < Date.now() / 1000) {
            throw new Error('Token expired');
        }
        // Return user info
        return {
            id: payload.sub || payload.user_id,
            email: payload.email,
            is_admin: payload.is_admin || false,
            role: payload.role || 'user'
        };
    }
    catch (error) {
        console.error('JWT validation error:', error);
        return null;
    }
}
// Helper function to extract user ID from token
export function extractUserIdFromToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const payload = JSON.parse(atob(parts[1] || ''));
        return payload.sub || payload.user_id || null;
    }
    catch (error) {
        return null;
    }
}
// Helper function to check if token is expired
export function isTokenExpired(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return true;
        const payload = JSON.parse(atob(parts[1] || ''));
        return payload.exp && payload.exp < Date.now() / 1000;
    }
    catch (error) {
        return true;
    }
}
// Helper function to get token from request
export function getTokenFromRequest(request, headerName = 'Authorization', prefix = 'Bearer ') {
    const authHeader = request.headers.get(headerName);
    if (!authHeader)
        return null;
    if (prefix && authHeader.startsWith(prefix)) {
        return authHeader.substring(prefix.length);
    }
    return authHeader;
}
// Helper function to create auth context
export function createAuthContext(user) {
    return {
        user_id: user.id,
        user: user
    };
}
//# sourceMappingURL=auth.js.map