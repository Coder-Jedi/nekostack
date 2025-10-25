// Standard API response helpers

import { ApiResponse } from '../types';

export function createSuccessResponse<T = any>(
  data: T,
  requestId?: string
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId || generateRequestId()
    }
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export function createErrorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  status: number = 500,
  requestId?: string
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId || generateRequestId()
    }
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export function createNotFoundResponse(
  resource: string = 'Resource',
  requestId?: string
): Response {
  return createErrorResponse(
    `${resource} not found`,
    'NOT_FOUND',
    404,
    requestId
  );
}

export function createBadRequestResponse(
  message: string = 'Bad request',
  requestId?: string
): Response {
  return createErrorResponse(
    message,
    'BAD_REQUEST',
    400,
    requestId
  );
}

export function createUnauthorizedResponse(
  message: string = 'Unauthorized',
  requestId?: string
): Response {
  return createErrorResponse(
    message,
    'UNAUTHORIZED',
    401,
    requestId
  );
}

export function createForbiddenResponse(
  message: string = 'Forbidden',
  requestId?: string
): Response {
  return createErrorResponse(
    message,
    'FORBIDDEN',
    403,
    requestId
  );
}

export function createRateLimitResponse(
  message: string = 'Rate limit exceeded',
  retryAfter?: number,
  requestId?: string
): Response {
  const response = createErrorResponse(
    message,
    'RATE_LIMIT_EXCEEDED',
    429,
    requestId
  );

  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }

  return response;
}

export function createValidationErrorResponse(
  errors: Array<{ field: string; message: string }>,
  requestId?: string
): Response {
  return createErrorResponse(
    'Validation failed',
    'VALIDATION_ERROR',
    400,
    requestId
  );
}

export function createCORSResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}

export function addRateLimitHeaders(response: Response, context: any): Response {
  if (!context.rateLimitInfo) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', context.rateLimitInfo.limit.toString());
  headers.set('X-RateLimit-Remaining', context.rateLimitInfo.remaining.toString());
  headers.set('X-RateLimit-Reset', context.rateLimitInfo.reset.toString());

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export function createHealthCheckResponse(): Response {
  return createSuccessResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

// Helper function to generate request ID
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Helper function to add CORS headers to any response
export function addCORSHeaders(response: Response): Response {
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });

  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return newResponse;
}

// Helper function to handle OPTIONS requests
export function handleOptionsRequest(): Response {
  return createCORSResponse();
}
