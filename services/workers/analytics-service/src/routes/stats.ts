// Analytics Stats API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createBadRequestResponse,
  createErrorResponse 
} from '../../../shared/src/utils/response';
import { validateQueryParams, requestSchemas } from '../../../shared/src/utils/validation';

// GET /api/analytics/stats - Get overall analytics stats
export async function getAnalyticsStats(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const period = url.searchParams.get('period') || '7d';
    
    const db = createD1Client(context.env);
    
    // Calculate date range
    const { start, end } = calculateDateRange(period, startDate || undefined, endDate || undefined);
    
    // Get overall stats
    const overallStats = await getOverallStats(db, start, end);
    
    // Get tool usage stats
    const toolStats = await getToolUsageStats(db, start, end);
    
    // Get user activity stats
    const userStats = await getUserActivityStats(db, start, end);
    
    // Get event type breakdown
    const eventBreakdown = await getEventTypeBreakdown(db, start, end);
    
    return createSuccessResponse({
      period: {
        start,
        end,
        days: Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
      },
      overall: overallStats,
      tools: toolStats,
      users: userStats,
      events: eventBreakdown
    }, context.request_id);
  } catch (error) {
    console.error('Get analytics stats error:', error);
    return createErrorResponse('Failed to fetch analytics stats', 'STATS_ERROR', 500, context.request_id);
  }
}

// GET /api/analytics/tools/:toolId/stats - Get tool-specific stats
export async function getToolStats(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const toolId = url.pathname.split('/')[4]; // /api/analytics/tools/:toolId/stats
    
    if (!toolId) {
      return createBadRequestResponse('Tool ID is required');
    }
    
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const period = url.searchParams.get('period') || '7d';
    
    const db = createD1Client(context.env);
    
    // Calculate date range
    const { start, end } = calculateDateRange(period, startDate || undefined, endDate || undefined);
    
    // Get tool usage stats
    const usageStats = await getToolUsageStats(db, start, end, toolId);
    
    // Get tool performance metrics
    const performanceStats = await getToolPerformanceStats(db, start, end, toolId);
    
    // Get user demographics for this tool
    const userDemographics = await getToolUserDemographics(db, start, end, toolId);
    
    // Get event timeline
    const eventTimeline = await getToolEventTimeline(db, start, end, toolId);
    
    return createSuccessResponse({
      tool_id: toolId,
      period: {
        start,
        end,
        days: Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
      },
      usage: usageStats,
      performance: performanceStats,
      demographics: userDemographics,
      timeline: eventTimeline
    }, context.request_id);
  } catch (error) {
    console.error('Get tool stats error:', error);
    return createErrorResponse('Failed to fetch tool stats', 'TOOL_STATS_ERROR', 500, context.request_id);
  }
}

// GET /api/analytics/trends - Get usage trends
export async function getUsageTrends(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const toolId = url.searchParams.get('tool_id');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const granularity = url.searchParams.get('granularity') || 'day';
    
    const db = createD1Client(context.env);
    
    // Calculate date range
    const { start, end } = calculateDateRange('30d', startDate || undefined, endDate || undefined);
    
    // Get trend data
    const trends = await getTrendData(db, start, end, toolId || undefined, granularity);
    
    return createSuccessResponse({
      trends,
      granularity,
      period: {
        start,
        end
      }
    }, context.request_id);
  } catch (error) {
    console.error('Get usage trends error:', error);
    return createErrorResponse('Failed to fetch usage trends', 'TRENDS_ERROR', 500, context.request_id);
  }
}

// Helper function to calculate date range
function calculateDateRange(period: string, startDate?: string, endDate?: string): { start: string; end: string } {
  const now = new Date();
  const end = endDate ? new Date(endDate) : now;
  
  let start: Date;
  
  if (startDate) {
    start = new Date(startDate);
  } else {
    switch (period) {
      case '1d':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}

// Helper function to get overall stats
async function getOverallStats(db: any, start: string, end: string): Promise<any> {
  const query = `
    SELECT 
      COUNT(*) as total_events,
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(DISTINCT tool_id) as unique_tools,
      COUNT(DISTINCT event_type) as unique_event_types
    FROM analytics_events
    WHERE timestamp >= ? AND timestamp <= ?
  `;
  
  const result = await db.get(query, [start, end]);
  return result;
}

// Helper function to get tool usage stats
async function getToolUsageStats(db: any, start: string, end: string, toolId?: string): Promise<any> {
  let query = `
    SELECT 
      t.id,
      t.name,
      t.category,
      COUNT(ae.id) as usage_count,
      COUNT(DISTINCT ae.user_id) as unique_users,
      AVG(CAST(JSON_EXTRACT(ae.metadata, '$.duration') AS REAL)) as avg_duration
    FROM tools t
    LEFT JOIN analytics_events ae ON t.id = ae.tool_id
    WHERE t.is_active = 1
    AND (ae.timestamp >= ? AND ae.timestamp <= ?)
  `;
  
  const params = [start, end];
  
  if (toolId) {
    query += ' AND t.id = ?';
    params.push(toolId);
  }
  
  query += ' GROUP BY t.id, t.name, t.category ORDER BY usage_count DESC';
  
  const results = await db.getAll(query, params);
  return results;
}

// Helper function to get user activity stats
async function getUserActivityStats(db: any, start: string, end: string): Promise<any> {
  const query = `
    SELECT 
      COUNT(DISTINCT user_id) as total_users,
      COUNT(DISTINCT CASE WHEN user_id IS NOT NULL THEN user_id END) as authenticated_users,
      COUNT(DISTINCT CASE WHEN user_id IS NULL THEN 'anonymous' END) as anonymous_users
    FROM analytics_events
    WHERE timestamp >= ? AND timestamp <= ?
  `;
  
  const result = await db.get(query, [start, end]);
  return result;
}

// Helper function to get event type breakdown
async function getEventTypeBreakdown(db: any, start: string, end: string): Promise<any> {
  const query = `
    SELECT 
      event_type,
      COUNT(*) as count,
      COUNT(DISTINCT user_id) as unique_users
    FROM analytics_events
    WHERE timestamp >= ? AND timestamp <= ?
    GROUP BY event_type
    ORDER BY count DESC
  `;
  
  const results = await db.getAll(query, [start, end]);
  return results;
}

// Helper function to get tool performance stats
async function getToolPerformanceStats(db: any, start: string, end: string, toolId: string): Promise<any> {
  const query = `
    SELECT 
      AVG(response_time) as avg_response_time,
      AVG(error_rate) as avg_error_rate,
      COUNT(*) as total_requests
    FROM performance_metrics
    WHERE endpoint LIKE ? AND timestamp >= ? AND timestamp <= ?
  `;
  
  const result = await db.get(query, [`%${toolId}%`, start, end]);
  return result;
}

// Helper function to get tool user demographics
async function getToolUserDemographics(db: any, start: string, end: string, toolId: string): Promise<any> {
  const query = `
    SELECT 
      COUNT(DISTINCT user_id) as unique_users,
      COUNT(*) as total_events,
      AVG(CAST(JSON_EXTRACT(metadata, '$.duration') AS REAL)) as avg_session_duration
    FROM analytics_events
    WHERE tool_id = ? AND timestamp >= ? AND timestamp <= ?
  `;
  
  const result = await db.get(query, [toolId, start, end]);
  return result;
}

// Helper function to get tool event timeline
async function getToolEventTimeline(db: any, start: string, end: string, toolId: string): Promise<any> {
  const query = `
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as events,
      COUNT(DISTINCT user_id) as unique_users
    FROM analytics_events
    WHERE tool_id = ? AND timestamp >= ? AND timestamp <= ?
    GROUP BY DATE(timestamp)
    ORDER BY date ASC
  `;
  
  const results = await db.getAll(query, [toolId, start, end]);
  return results;
}

// Helper function to get trend data
async function getTrendData(db: any, start: string, end: string, toolId?: string, granularity: string = 'day'): Promise<any> {
  let dateFormat: string;
  switch (granularity) {
    case 'hour':
      dateFormat = '%Y-%m-%d %H:00:00';
      break;
    case 'day':
      dateFormat = '%Y-%m-%d';
      break;
    case 'week':
      dateFormat = '%Y-%W';
      break;
    case 'month':
      dateFormat = '%Y-%m';
      break;
    default:
      dateFormat = '%Y-%m-%d';
  }
  
  let query = `
    SELECT 
      strftime('${dateFormat}', timestamp) as period,
      COUNT(*) as events,
      COUNT(DISTINCT user_id) as unique_users
    FROM analytics_events
    WHERE timestamp >= ? AND timestamp <= ?
  `;
  
  const params = [start, end];
  
  if (toolId) {
    query += ' AND tool_id = ?';
    params.push(toolId);
  }
  
  query += ` GROUP BY strftime('${dateFormat}', timestamp) ORDER BY period ASC`;
  
  const results = await db.getAll(query, params);
  return results;
}
