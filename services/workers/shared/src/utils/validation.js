// Input validation utilities using Zod
import { z } from 'zod';
// Common validation schemas
export const schemas = {
    // Tool validation
    toolId: z.string().uuid('Invalid tool ID format'),
    toolName: z.string().min(1, 'Tool name is required').max(100, 'Tool name too long'),
    toolDescription: z.string().min(1, 'Description is required').max(500, 'Description too long'),
    // User validation
    userId: z.string().uuid('Invalid user ID format').optional(),
    email: z.string().email('Invalid email format'),
    // Pagination validation
    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
    limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(20),
    // Date validation
    date: z.string().datetime('Invalid date format'),
    dateRange: z.object({
        start: z.string().datetime('Invalid start date format'),
        end: z.string().datetime('Invalid end date format').optional()
    }),
    // Analytics validation
    eventType: z.string().min(1, 'Event type is required').max(50, 'Event type too long'),
    analyticsToolId: z.string().uuid('Invalid tool ID format').optional(),
    // Search validation
    searchQuery: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
    // Rating validation
    rating: z.coerce.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    // Priority validation
    priority: z.enum(['low', 'medium', 'high', 'critical'], {
        errorMap: () => ({ message: 'Priority must be low, medium, high, or critical' })
    }),
    // Audience validation
    audience: z.enum(['all', 'free', 'pro', 'enterprise'], {
        errorMap: () => ({ message: 'Audience must be all, free, pro, or enterprise' })
    })
};
// Request validation schemas
export const requestSchemas = {
    // Tool requests
    getTools: z.object({
        category: z.string().uuid().optional(),
        search: z.string().optional(),
        page: schemas.page,
        limit: schemas.limit
    }),
    getToolById: z.object({
        id: schemas.toolId
    }),
    // Analytics requests
    trackEvent: z.object({
        event_type: schemas.eventType,
        tool_id: schemas.toolId.optional(),
        metadata: z.record(z.any()).optional(),
        user_id: schemas.userId
    }),
    getAnalytics: z.object({
        tool_id: schemas.toolId.optional(),
        start_date: z.string().datetime(),
        end_date: z.string().datetime().optional(),
        page: schemas.page,
        limit: schemas.limit
    }),
    // Performance requests
    trackPerformance: z.object({
        endpoint: z.string().min(1, 'Endpoint is required'),
        response_time: z.coerce.number().min(0, 'Response time must be positive'),
        error_rate: z.coerce.number().min(0, 'Error rate must be non-negative').max(1, 'Error rate cannot exceed 1')
    }),
    // Announcement requests
    getAnnouncements: z.object({
        audience: schemas.audience.optional(),
        priority: schemas.priority.optional()
    }),
    // Search requests
    search: z.object({
        q: schemas.searchQuery,
        category: z.string().uuid().optional(),
        page: schemas.page,
        limit: schemas.limit
    }),
    // Rating requests
    createRating: z.object({
        tool_id: schemas.toolId,
        rating: schemas.rating,
        review_text: z.string().max(1000, 'Review text too long').optional()
    })
};
// Validation helper functions
export function validateRequest(schema, data) {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }));
            return { success: false, errors };
        }
        return {
            success: false,
            errors: [{
                    field: 'unknown',
                    message: 'Validation failed',
                    code: 'UNKNOWN_ERROR'
                }]
        };
    }
}
export function validateQueryParams(schema, url) {
    const params = {};
    for (const [key, value] of url.searchParams.entries()) {
        params[key] = value;
    }
    return validateRequest(schema, params);
}
export function validateBody(schema, body) {
    return validateRequest(schema, body);
}
// Sanitization helpers
export function sanitizeString(input) {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
}
export function sanitizeSearchQuery(query) {
    return query
        .trim()
        .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
        .substring(0, 100); // Limit length
}
export function sanitizeEmail(email) {
    return email.trim().toLowerCase();
}
// Rate limiting validation
export function validateRateLimit(requestCount, limit) {
    return requestCount <= limit;
}
// IP validation
export function isValidIP(ip) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
// User agent validation
export function isValidUserAgent(userAgent) {
    // Basic validation - not empty and reasonable length
    return userAgent.length > 0 && userAgent.length < 1000;
}
// Content type validation
export function isValidContentType(contentType, allowedTypes) {
    return allowedTypes.some(type => contentType.includes(type));
}
//# sourceMappingURL=validation.js.map