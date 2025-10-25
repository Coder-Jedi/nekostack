// Standard API response helpers
export function createSuccessResponse(data, requestId) {
    const response = {
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
export function createErrorResponse(message, code = 'INTERNAL_ERROR', status = 500, requestId) {
    const response = {
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
export function createNotFoundResponse(resource = 'Resource', requestId) {
    return createErrorResponse(`${resource} not found`, 'NOT_FOUND', 404, requestId);
}
export function createBadRequestResponse(message = 'Bad request', requestId) {
    return createErrorResponse(message, 'BAD_REQUEST', 400, requestId);
}
export function createUnauthorizedResponse(message = 'Unauthorized', requestId) {
    return createErrorResponse(message, 'UNAUTHORIZED', 401, requestId);
}
export function createForbiddenResponse(message = 'Forbidden', requestId) {
    return createErrorResponse(message, 'FORBIDDEN', 403, requestId);
}
export function createRateLimitResponse(message = 'Rate limit exceeded', retryAfter, requestId) {
    const response = createErrorResponse(message, 'RATE_LIMIT_EXCEEDED', 429, requestId);
    if (retryAfter) {
        response.headers.set('Retry-After', retryAfter.toString());
    }
    return response;
}
export function createValidationErrorResponse(errors, requestId) {
    return createErrorResponse('Validation failed', 'VALIDATION_ERROR', 400, requestId);
}
export function createCORSResponse() {
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
export function createHealthCheckResponse() {
    return createSuccessResponse({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
}
// Helper function to generate request ID
function generateRequestId() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}
// Helper function to add CORS headers to any response
export function addCORSHeaders(response) {
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
export function handleOptionsRequest() {
    return createCORSResponse();
}
//# sourceMappingURL=response.js.map