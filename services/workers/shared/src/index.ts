// Shared utilities export for Cloudflare Workers

// Database utilities
export { D1Client, createD1Client } from './database/d1-client';
export { QUERIES, buildSearchQuery, buildDateRangeQuery } from './database/queries';

// KV utilities
export { KVClient, createKVClient } from './kv/kv-client';

// Response utilities
export {
  createSuccessResponse,
  createErrorResponse,
  createNotFoundResponse,
  createBadRequestResponse,
  createUnauthorizedResponse,
  createForbiddenResponse,
  createRateLimitResponse,
  createValidationErrorResponse,
  createCORSResponse,
  createHealthCheckResponse,
  addCORSHeaders,
  handleOptionsRequest
} from './utils/response';

// Validation utilities
export {
  schemas,
  requestSchemas,
  validateRequest,
  validateQueryParams,
  validateBody,
  sanitizeString,
  sanitizeSearchQuery,
  sanitizeEmail,
  validateRateLimit,
  isValidIP,
  isValidUserAgent,
  isValidContentType
} from './utils/validation';

// Middleware
export {
  corsMiddleware,
  createCORSResponse as createCORSResponseFromMiddleware,
  addCORSHeaders as addCORSHeadersFromMiddleware,
  isPreflightRequest,
  getAllowedOrigins,
  createCORSFromEnv
} from './middleware/cors';

export {
  rateLimitMiddleware,
  userRateLimitMiddleware,
  endpointRateLimitMiddleware,
  apiKeyRateLimitMiddleware,
  getRateLimitInfo,
  addRateLimitHeaders,
  createRateLimitKey,
  shouldRateLimit,
  getClientIP,
  getUserAgent
} from './middleware/rate-limit';

export {
  authMiddleware,
  optionalAuthMiddleware,
  publicRoutesMiddleware,
  adminAuthMiddleware,
  extractUserIdFromToken,
  isTokenExpired,
  getTokenFromRequest,
  createAuthContext
} from './middleware/auth';

// Types
export type {
  Env,
  ApiResponse,
  Tool,
  ToolCategory,
  ToolFeature,
  AnalyticsEvent,
  ToolUsageStats,
  PerformanceMetrics,
  ToolRating,
  Announcement,
  SystemConfig,
  ChangelogEntry,
  CacheMetadata,
  ApiRateLimit,
  RequestContext,
  MiddlewareResult,
  ValidationError,
  RateLimitInfo
} from './types';
