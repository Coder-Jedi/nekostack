// Shared TypeScript types for Cloudflare Workers

export interface Env {
  DB: any; // D1Database
  CACHE: any; // KVNamespace
  ANALYTICS_SERVICE?: any; // Service binding for analytics-service
  ORACLE_QUEUE_URL?: string;
  ORACLE_API_KEY?: string;
  FOREXRATE_API_KEY?: string;
  ENVIRONMENT?: string;
  ANALYTICS_RETENTION_DAYS?: string;
  REAL_TIME_AGGREGATION?: string;
  SUPABASE_JWT_SECRET?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_url: string;
  features: string[];
  pricing_tier: 'free' | 'pro' | 'enterprise';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface ToolFeature {
  tool_id: string;
  feature_name: string;
  description: string;
  is_premium: boolean;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_type: string;
  tool_id?: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface ToolUsageStats {
  tool_id: string;
  date: string;
  usage_count: number;
  unique_users: number;
  avg_duration: number;
}

export interface PerformanceMetrics {
  endpoint: string;
  response_time: number;
  error_rate: number;
  timestamp: string;
}

export interface ToolRating {
  id: string;
  tool_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  helpful_votes: number;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  audience: 'all' | 'free' | 'pro' | 'enterprise';
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface SystemConfig {
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  release_date: string;
  features: string[];
}

export interface CacheMetadata {
  key: string;
  value: string;
  ttl: number;
  created_at: string;
  last_accessed: string;
}

export interface ApiRateLimit {
  endpoint: string;
  user_id?: string;
  request_count: number;
  window_start: string;
}

export interface RequestContext {
  request: Request;
  env: Env;
  ctx: any; // ExecutionContext
  user_id?: string;
  user?: any;
  request_id: string;
  corsHeaders?: Record<string, string>;
  rateLimitInfo?: RateLimitInfo;
}

export interface MiddlewareResult {
  success: boolean;
  response?: Response;
  context?: Partial<RequestContext>;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
