export declare function createSuccessResponse<T = any>(data: T, requestId?: string): Response;
export declare function createErrorResponse(message: string, code?: string, status?: number, requestId?: string): Response;
export declare function createNotFoundResponse(resource?: string, requestId?: string): Response;
export declare function createBadRequestResponse(message?: string, requestId?: string): Response;
export declare function createUnauthorizedResponse(message?: string, requestId?: string): Response;
export declare function createForbiddenResponse(message?: string, requestId?: string): Response;
export declare function createRateLimitResponse(message?: string, retryAfter?: number, requestId?: string): Response;
export declare function createValidationErrorResponse(errors: Array<{
    field: string;
    message: string;
}>, requestId?: string): Response;
export declare function createCORSResponse(): Response;
export declare function createHealthCheckResponse(): Response;
export declare function addCORSHeaders(response: Response): Response;
export declare function handleOptionsRequest(): Response;
//# sourceMappingURL=response.d.ts.map