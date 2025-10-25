// Input validation utilities using Zod

import { z } from 'zod';
import { ValidationError } from '../types';

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
  }),

  // Tool Router requests
  unitConverter: z.object({
    value: z.coerce.number().finite('Value must be a valid number'),
    fromUnit: z.string().min(1, 'From unit is required'),
    toUnit: z.string().min(1, 'To unit is required'),
    category: z.string().min(1, 'Category is required')
  }),

  currencyConverter: z.object({
    amount: z.coerce.number().finite('Amount must be a valid number'),
    fromCurrency: z.string().min(3, 'From currency must be at least 3 characters'),
    toCurrency: z.string().min(3, 'To currency must be at least 3 characters'),
    date: z.string().datetime().optional()
  }),

  qrGenerator: z.object({
    text: z.string().min(1, 'Text is required').max(1000, 'Text too long'),
    size: z.coerce.number().int().min(100, 'Size must be at least 100').max(2000, 'Size cannot exceed 2000').default(200),
    format: z.enum(['png', 'svg', 'pdf']).default('png'),
    errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
    foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid foreground color format').default('#000000'),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid background color format').default('#FFFFFF'),
    margin: z.coerce.number().int().min(0, 'Margin must be non-negative').max(10, 'Margin cannot exceed 10').default(4)
  }),

  bulkQrGenerator: z.object({
    texts: z.array(z.string().min(1, 'Text is required').max(1000, 'Text too long')).min(1, 'At least one text is required').max(50, 'Cannot generate more than 50 QR codes at once'),
    options: z.object({
      size: z.coerce.number().int().min(100, 'Size must be at least 100').max(2000, 'Size cannot exceed 2000').default(200),
      format: z.enum(['png', 'svg', 'pdf']).default('png'),
      errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
      foregroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid foreground color format').default('#000000'),
      backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid background color format').default('#FFFFFF'),
      margin: z.coerce.number().int().min(0, 'Margin must be non-negative').max(10, 'Margin cannot exceed 10').default(4)
    }).optional()
  }),

  markdownConverter: z.object({
    markdown: z.string().min(1, 'Markdown content is required'),
    outputFormat: z.enum(['html', 'pdf', 'docx', 'txt']),
    options: z.object({
      includeToc: z.boolean().default(false),
      theme: z.string().default('default'),
      fontSize: z.coerce.number().int().min(8, 'Font size must be at least 8').max(72, 'Font size cannot exceed 72').default(12)
    }).optional()
  })
};

// Validation helper functions
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
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

export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  url: URL
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  const params: Record<string, any> = {};
  
  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }
  
  return validateRequest(schema, params);
}

export function validateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; errors: ValidationError[] } {
  return validateRequest(schema, body);
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
    .substring(0, 100); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Rate limiting validation
export function validateRateLimit(
  requestCount: number,
  limit: number
): boolean {
  return requestCount <= limit;
}

// IP validation
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// User agent validation
export function isValidUserAgent(userAgent: string): boolean {
  // Basic validation - not empty and reasonable length
  return userAgent.length > 0 && userAgent.length < 1000;
}

// Content type validation
export function isValidContentType(contentType: string, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => contentType.includes(type));
}
