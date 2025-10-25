// Common SQL queries for D1 database
export const QUERIES = {
    // Tools queries
    TOOLS: {
        GET_ALL: `
      SELECT t.*, tc.name as category_name, tc.icon as category_icon
      FROM tools t
      LEFT JOIN tool_categories tc ON t.category = tc.id
      WHERE t.is_active = 1
      ORDER BY t.name ASC
    `,
        GET_BY_ID: `
      SELECT t.*, tc.name as category_name, tc.icon as category_icon
      FROM tools t
      LEFT JOIN tool_categories tc ON t.category = tc.id
      WHERE t.id = ? AND t.is_active = 1
    `,
        GET_BY_CATEGORY: `
      SELECT t.*, tc.name as category_name, tc.icon as category_icon
      FROM tools t
      LEFT JOIN tool_categories tc ON t.category = tc.id
      WHERE t.category = ? AND t.is_active = 1
      ORDER BY t.name ASC
    `,
        GET_FEATURES: `
      SELECT feature_name, description, is_premium
      FROM tool_features
      WHERE tool_id = ?
      ORDER BY feature_name ASC
    `,
        SEARCH: `
      SELECT t.*, tc.name as category_name, tc.icon as category_icon
      FROM tools t
      LEFT JOIN tool_categories tc ON t.category = tc.id
      WHERE t.is_active = 1 
      AND (t.name LIKE ? OR t.description LIKE ?)
      ORDER BY t.name ASC
    `
    },
    // Categories queries
    CATEGORIES: {
        GET_ALL: `
      SELECT * FROM tool_categories
      ORDER BY sort_order ASC, name ASC
    `,
        GET_BY_ID: `
      SELECT * FROM tool_categories
      WHERE id = ?
    `
    },
    // Analytics queries
    ANALYTICS: {
        TRACK_EVENT: `
      INSERT INTO analytics_events (user_id, event_type, tool_id, metadata, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `,
        GET_EVENTS: `
      SELECT * FROM analytics_events
      WHERE user_id = ? AND timestamp >= ?
      ORDER BY timestamp DESC
      LIMIT ?
    `,
        GET_TOOL_STATS: `
      SELECT 
        tool_id,
        COUNT(*) as usage_count,
        COUNT(DISTINCT user_id) as unique_users,
        AVG(CAST(JSON_EXTRACT(metadata, '$.duration') AS REAL)) as avg_duration
      FROM analytics_events
      WHERE tool_id = ? AND timestamp >= ?
      GROUP BY tool_id
    `,
        GET_DAILY_STATS: `
      SELECT 
        tool_id,
        DATE(timestamp) as date,
        COUNT(*) as usage_count,
        COUNT(DISTINCT user_id) as unique_users
      FROM analytics_events
      WHERE tool_id = ? AND timestamp >= ?
      GROUP BY tool_id, DATE(timestamp)
      ORDER BY date DESC
    `,
        UPDATE_USAGE_STATS: `
      INSERT OR REPLACE INTO tool_usage_stats 
      (tool_id, date, usage_count, unique_users, avg_duration)
      VALUES (?, ?, ?, ?, ?)
    `
    },
    // Performance queries
    PERFORMANCE: {
        TRACK_METRICS: `
      INSERT INTO performance_metrics (endpoint, response_time, error_rate, timestamp)
      VALUES (?, ?, ?, ?)
    `,
        GET_METRICS: `
      SELECT * FROM performance_metrics
      WHERE endpoint = ? AND timestamp >= ?
      ORDER BY timestamp DESC
      LIMIT ?
    `,
        GET_AVERAGE_RESPONSE_TIME: `
      SELECT AVG(response_time) as avg_response_time
      FROM performance_metrics
      WHERE endpoint = ? AND timestamp >= ?
    `
    },
    // Announcements queries
    ANNOUNCEMENTS: {
        GET_ACTIVE: `
      SELECT * FROM announcements
      WHERE is_active = 1 
      AND (start_date <= ? AND (end_date IS NULL OR end_date >= ?))
      ORDER BY priority DESC, created_at DESC
    `,
        GET_BY_AUDIENCE: `
      SELECT * FROM announcements
      WHERE is_active = 1 
      AND (audience = ? OR audience = 'all')
      AND (start_date <= ? AND (end_date IS NULL OR end_date >= ?))
      ORDER BY priority DESC, created_at DESC
    `,
        GET_BY_ID: `
      SELECT * FROM announcements
      WHERE id = ?
    `
    },
    // System config queries
    SYSTEM: {
        GET_CONFIG: `
      SELECT key, value, description FROM system_config
      WHERE key = ?
    `,
        GET_ALL_CONFIG: `
      SELECT key, value, description FROM system_config
      ORDER BY key ASC
    `,
        SET_CONFIG: `
      INSERT OR REPLACE INTO system_config (key, value, description, updated_at)
      VALUES (?, ?, ?, ?)
    `
    },
    // Changelog queries
    CHANGELOG: {
        GET_LATEST: `
      SELECT * FROM changelog_entries
      ORDER BY release_date DESC
      LIMIT ?
    `,
        GET_BY_VERSION: `
      SELECT * FROM changelog_entries
      WHERE version = ?
    `,
        GET_RECENT: `
      SELECT * FROM changelog_entries
      WHERE release_date >= ?
      ORDER BY release_date DESC
    `
    },
    // Cache queries
    CACHE: {
        GET: `
      SELECT * FROM cache_metadata
      WHERE key = ? AND (ttl = 0 OR created_at + ttl > ?)
    `,
        SET: `
      INSERT OR REPLACE INTO cache_metadata (key, value, ttl, created_at, last_accessed)
      VALUES (?, ?, ?, ?, ?)
    `,
        DELETE: `
      DELETE FROM cache_metadata
      WHERE key = ?
    `,
        CLEANUP: `
      DELETE FROM cache_metadata
      WHERE ttl > 0 AND created_at + ttl <= ?
    `
    },
    // Rate limiting queries
    RATE_LIMIT: {
        GET: `
      SELECT * FROM api_rate_limits
      WHERE endpoint = ? AND user_id = ? AND window_start >= ?
    `,
        UPDATE: `
      INSERT OR REPLACE INTO api_rate_limits (endpoint, user_id, request_count, window_start)
      VALUES (?, ?, ?, ?)
    `,
        CLEANUP: `
      DELETE FROM api_rate_limits
      WHERE window_start < ?
    `
    }
};
// Helper function to build search query
export function buildSearchQuery(searchTerm) {
    const likeTerm = `%${searchTerm}%`;
    return QUERIES.TOOLS.SEARCH.replace(/\?/g, `'${likeTerm}'`);
}
// Helper function to build date range query
export function buildDateRangeQuery(startDate, endDate) {
    if (endDate) {
        return `AND timestamp >= '${startDate}' AND timestamp <= '${endDate}'`;
    }
    return `AND timestamp >= '${startDate}'`;
}
//# sourceMappingURL=queries.js.map