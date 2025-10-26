-- NekoStack D1 Database Schema
-- Application data, analytics, and tool metadata

-- ============================================================================
-- TOOL CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tool_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TOOLS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_url TEXT,
  features TEXT, -- JSON array of features
  pricing_tier TEXT NOT NULL CHECK (pricing_tier IN ('free', 'pro', 'enterprise')),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES tool_categories(id)
);

-- ============================================================================
-- TOOL FEATURES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tool_features (
  tool_id TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  description TEXT,
  is_premium BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tool_id, feature_name),
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

-- ============================================================================
-- ANALYTICS EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT,
  event_type TEXT NOT NULL,
  tool_id TEXT,
  metadata TEXT, -- JSON object
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE SET NULL
);

-- ============================================================================
-- TOOL USAGE STATS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tool_usage_stats (
  tool_id TEXT NOT NULL,
  date DATE NOT NULL,
  usage_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  avg_duration REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tool_id, date),
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE
);

-- ============================================================================
-- PERFORMANCE METRICS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS performance_metrics (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  endpoint TEXT NOT NULL,
  response_time REAL NOT NULL,
  error_rate REAL DEFAULT 0,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TOOL RATINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS tool_ratings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tool_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  helpful_votes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
  UNIQUE(tool_id, user_id)
);

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  audience TEXT NOT NULL CHECK (audience IN ('all', 'free', 'pro', 'enterprise')),
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SYSTEM CONFIG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CHANGELOG ENTRIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS changelog_entries (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  release_date DATETIME NOT NULL,
  features TEXT, -- JSON array of features
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CACHE METADATA TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS cache_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  ttl INTEGER DEFAULT 0, -- TTL in seconds, 0 = no expiration
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- API RATE LIMITS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_rate_limits (
  endpoint TEXT NOT NULL,
  user_id TEXT,
  request_count INTEGER DEFAULT 1,
  window_start DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (endpoint, user_id, window_start)
);

-- ============================================================================
-- FOREX RATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS forex_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rates TEXT NOT NULL, -- JSON string of rates object
  last_updated TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('api', 'cache')),
  is_expired INTEGER NOT NULL DEFAULT 0, -- 0 = false, 1 = true
  rates_count INTEGER NOT NULL,
  api_quota_used INTEGER,
  api_quota_total INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Tools indexes
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_pricing_tier ON tools(pricing_tier);
CREATE INDEX IF NOT EXISTS idx_tools_is_active ON tools(is_active);
CREATE INDEX IF NOT EXISTS idx_tools_name ON tools(name);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_tool_id ON analytics_events(tool_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_endpoint ON performance_metrics(endpoint);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Ratings indexes
CREATE INDEX IF NOT EXISTS idx_tool_ratings_tool_id ON tool_ratings(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_ratings_user_id ON tool_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_ratings_rating ON tool_ratings(rating);

-- Announcements indexes
CREATE INDEX IF NOT EXISTS idx_announcements_audience ON announcements(audience);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);

-- Changelog indexes
CREATE INDEX IF NOT EXISTS idx_changelog_version ON changelog_entries(version);
CREATE INDEX IF NOT EXISTS idx_changelog_release_date ON changelog_entries(release_date);

-- Cache indexes
CREATE INDEX IF NOT EXISTS idx_cache_metadata_ttl ON cache_metadata(ttl);
CREATE INDEX IF NOT EXISTS idx_cache_metadata_last_accessed ON cache_metadata(last_accessed);

-- Rate limits indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON api_rate_limits(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_id ON api_rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON api_rate_limits(window_start);

-- Forex rates indexes
CREATE INDEX IF NOT EXISTS idx_forex_rates_last_updated ON forex_rates(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_forex_rates_created_at ON forex_rates(created_at DESC);

-- ============================================================================
-- TRIGGERS for updated_at
-- ============================================================================

-- Update tools.updated_at
CREATE TRIGGER IF NOT EXISTS update_tools_updated_at
  AFTER UPDATE ON tools
  FOR EACH ROW
  BEGIN
    UPDATE tools SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update tool_usage_stats.updated_at
CREATE TRIGGER IF NOT EXISTS update_tool_usage_stats_updated_at
  AFTER UPDATE ON tool_usage_stats
  FOR EACH ROW
  BEGIN
    UPDATE tool_usage_stats SET updated_at = CURRENT_TIMESTAMP 
    WHERE tool_id = NEW.tool_id AND date = NEW.date;
  END;

-- Update announcements.updated_at
CREATE TRIGGER IF NOT EXISTS update_announcements_updated_at
  AFTER UPDATE ON announcements
  FOR EACH ROW
  BEGIN
    UPDATE announcements SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update api_rate_limits.updated_at
CREATE TRIGGER IF NOT EXISTS update_api_rate_limits_updated_at
  AFTER UPDATE ON api_rate_limits
  FOR EACH ROW
  BEGIN
    UPDATE api_rate_limits SET updated_at = CURRENT_TIMESTAMP 
    WHERE endpoint = NEW.endpoint AND user_id = NEW.user_id AND window_start = NEW.window_start;
  END;

-- Update forex_rates.updated_at
CREATE TRIGGER IF NOT EXISTS update_forex_rates_updated_at
  AFTER UPDATE ON forex_rates
  FOR EACH ROW
  BEGIN
    UPDATE forex_rates SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- ============================================================================
-- VIEWS for Common Queries
-- ============================================================================

-- Tools with category information
CREATE VIEW IF NOT EXISTS tools_with_categories AS
SELECT 
  t.*,
  tc.name as category_name,
  tc.icon as category_icon,
  tc.description as category_description
FROM tools t
LEFT JOIN tool_categories tc ON t.category = tc.id;

-- Tool usage summary
CREATE VIEW IF NOT EXISTS tool_usage_summary AS
SELECT 
  t.id,
  t.name,
  t.category,
  COALESCE(SUM(tus.usage_count), 0) as total_usage,
  COALESCE(SUM(tus.unique_users), 0) as total_unique_users,
  COALESCE(AVG(tus.avg_duration), 0) as avg_duration,
  COALESCE(AVG(tr.rating), 0) as avg_rating,
  COUNT(tr.id) as rating_count
FROM tools t
LEFT JOIN tool_usage_stats tus ON t.id = tus.tool_id
LEFT JOIN tool_ratings tr ON t.id = tr.tool_id
WHERE t.is_active = 1
GROUP BY t.id, t.name, t.category;

-- Active announcements
CREATE VIEW IF NOT EXISTS active_announcements AS
SELECT *
FROM announcements
WHERE is_active = 1 
  AND start_date <= CURRENT_TIMESTAMP 
  AND (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP)
ORDER BY priority DESC, created_at DESC;
