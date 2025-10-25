import { z } from 'zod';
import { ValidationError } from '../types';
export declare const schemas: {
    toolId: z.ZodString;
    toolName: z.ZodString;
    toolDescription: z.ZodString;
    userId: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    date: z.ZodString;
    dateRange: z.ZodObject<{
        start: z.ZodString;
        end: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        start: string;
        end?: string | undefined;
    }, {
        start: string;
        end?: string | undefined;
    }>;
    eventType: z.ZodString;
    analyticsToolId: z.ZodOptional<z.ZodString>;
    searchQuery: z.ZodString;
    rating: z.ZodNumber;
    priority: z.ZodEnum<["low", "medium", "high", "critical"]>;
    audience: z.ZodEnum<["all", "free", "pro", "enterprise"]>;
};
export declare const requestSchemas: {
    getTools: z.ZodObject<{
        category: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        search?: string | undefined;
        category?: string | undefined;
    }, {
        search?: string | undefined;
        category?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    }>;
    getToolById: z.ZodObject<{
        id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
    }, {
        id: string;
    }>;
    trackEvent: z.ZodObject<{
        event_type: z.ZodString;
        tool_id: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        user_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        event_type: string;
        user_id?: string | undefined;
        tool_id?: string | undefined;
        metadata?: Record<string, any> | undefined;
    }, {
        event_type: string;
        user_id?: string | undefined;
        tool_id?: string | undefined;
        metadata?: Record<string, any> | undefined;
    }>;
    getAnalytics: z.ZodObject<{
        tool_id: z.ZodOptional<z.ZodString>;
        start_date: z.ZodString;
        end_date: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        start_date: string;
        tool_id?: string | undefined;
        end_date?: string | undefined;
    }, {
        start_date: string;
        page?: number | undefined;
        limit?: number | undefined;
        tool_id?: string | undefined;
        end_date?: string | undefined;
    }>;
    trackPerformance: z.ZodObject<{
        endpoint: z.ZodString;
        response_time: z.ZodNumber;
        error_rate: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        endpoint: string;
        response_time: number;
        error_rate: number;
    }, {
        endpoint: string;
        response_time: number;
        error_rate: number;
    }>;
    getAnnouncements: z.ZodObject<{
        audience: z.ZodOptional<z.ZodEnum<["all", "free", "pro", "enterprise"]>>;
        priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "critical"]>>;
    }, "strip", z.ZodTypeAny, {
        audience?: "free" | "pro" | "enterprise" | "all" | undefined;
        priority?: "low" | "medium" | "high" | "critical" | undefined;
    }, {
        audience?: "free" | "pro" | "enterprise" | "all" | undefined;
        priority?: "low" | "medium" | "high" | "critical" | undefined;
    }>;
    search: z.ZodObject<{
        q: z.ZodString;
        category: z.ZodOptional<z.ZodString>;
        page: z.ZodDefault<z.ZodNumber>;
        limit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        q: string;
        category?: string | undefined;
    }, {
        q: string;
        category?: string | undefined;
        page?: number | undefined;
        limit?: number | undefined;
    }>;
    createRating: z.ZodObject<{
        tool_id: z.ZodString;
        rating: z.ZodNumber;
        review_text: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        tool_id: string;
        rating: number;
        review_text?: string | undefined;
    }, {
        tool_id: string;
        rating: number;
        review_text?: string | undefined;
    }>;
};
export declare function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: ValidationError[];
};
export declare function validateQueryParams<T>(schema: z.ZodSchema<T>, url: URL): {
    success: true;
    data: T;
} | {
    success: false;
    errors: ValidationError[];
};
export declare function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): {
    success: true;
    data: T;
} | {
    success: false;
    errors: ValidationError[];
};
export declare function sanitizeString(input: string): string;
export declare function sanitizeSearchQuery(query: string): string;
export declare function sanitizeEmail(email: string): string;
export declare function validateRateLimit(requestCount: number, limit: number): boolean;
export declare function isValidIP(ip: string): boolean;
export declare function isValidUserAgent(userAgent: string): boolean;
export declare function isValidContentType(contentType: string, allowedTypes: string[]): boolean;
//# sourceMappingURL=validation.d.ts.map