// JWT validation middleware for Cloudflare Workers

import { RequestContext, MiddlewareResult } from '../types';
import { createUnauthorizedResponse } from '../utils/response';

export interface AuthOptions {
  required?: boolean; // Whether authentication is required
  skipPaths?: string[]; // Paths to skip authentication
  tokenHeader?: string; // Header name for the token
  tokenPrefix?: string; // Prefix to remove from token (e.g., 'Bearer ')
}

const DEFAULT_OPTIONS: Required<AuthOptions> = {
  required: true,
  skipPaths: [],
  tokenHeader: 'Authorization',
  tokenPrefix: 'Bearer '
};

export function authMiddleware(options: Partial<AuthOptions> = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return async (context: RequestContext): Promise<MiddlewareResult> => {
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
          response: createUnauthorizedResponse(
            'Authorization header required',
            context.request_id
          )
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
            response: createUnauthorizedResponse(
              'Invalid or expired token',
              context.request_id
            )
          };
        }
        return { success: true };
      }

      // Add user info to context
      context.user_id = user.id;
      context.user = user;

      return { success: true };
    } catch (error) {
      console.error('Auth middleware error:', error);
      if (config.required) {
        return {
          success: false,
          response: createUnauthorizedResponse(
            'Token validation failed',
            context.request_id
          )
        };
      }
      return { success: true };
    }
  };
}

// Optional authentication middleware
export function optionalAuthMiddleware(options: Partial<AuthOptions> = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  return authMiddleware({ ...options, required: false });
}

// Public routes middleware (no authentication required)
export function publicRoutesMiddleware(skipPaths: string[] = []): (context: RequestContext) => Promise<MiddlewareResult> {
  return authMiddleware({ required: false, skipPaths });
}

// Admin routes middleware (requires admin role)
export function adminAuthMiddleware(options: Partial<AuthOptions> = {}): (context: RequestContext) => Promise<MiddlewareResult> {
  return async (context: RequestContext): Promise<MiddlewareResult> => {
    // First check basic auth
    const authResult = await authMiddleware(options)(context);
    if (!authResult.success) {
      return authResult;
    }

    // Check if user has admin role
    if (!context.user?.is_admin) {
      return {
        success: false,
        response: createUnauthorizedResponse(
          'Admin access required',
          context.request_id
        )
      };
    }

    return { success: true };
  };
}

// Helper function to validate JWT token
async function validateJWT(token: string, env: any): Promise<any> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Get Supabase JWT secret
    const secret = env.SUPABASE_JWT_SECRET;
    if (!secret) {
      console.error('SUPABASE_JWT_SECRET not configured');
      return null;
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlDecode(parts[2] || '');
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      data
    );
    
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Parse and validate payload
    const payload = JSON.parse(atob(parts[1] || ''));
    
    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new Error('Token expired');
    }
    
    // Validate Supabase-specific claims
    if (payload.aud !== 'authenticated') {
      throw new Error('Invalid token audience');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role || 'authenticated',
      is_admin: payload.user_metadata?.is_admin || false
    };
  } catch (error) {
    console.error('JWT validation error:', error);
    return null;
  }
}

// Helper function for base64url decoding
function base64UrlDecode(str: string): Uint8Array {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) {
    str += '='.repeat(4 - pad);
  }
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Helper function to extract user ID from token
export function extractUserIdFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1] || ''));
    return payload.sub || payload.user_id || null;
  } catch (error) {
    return null;
  }
}

// Helper function to check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const payload = JSON.parse(atob(parts[1] || ''));
    return payload.exp && payload.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
}

// Helper function to get token from request
export function getTokenFromRequest(request: Request, headerName = 'Authorization', prefix = 'Bearer '): string | null {
  const authHeader = request.headers.get(headerName);
  if (!authHeader) return null;
  
  if (prefix && authHeader.startsWith(prefix)) {
    return authHeader.substring(prefix.length);
  }
  
  return authHeader;
}

// Helper function to create auth context
export function createAuthContext(user: any): Partial<RequestContext> {
  return {
    user_id: user.id,
    user: user
  };
}
