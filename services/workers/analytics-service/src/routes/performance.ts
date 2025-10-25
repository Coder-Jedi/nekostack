// Performance Metrics API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createBadRequestResponse,
  createErrorResponse 
} from '../../../shared/src/utils/response';
import { validateBody, requestSchemas } from '../../../shared/src/utils/validation';

// POST /api/analytics/performance - Track performance metrics
export async function trackPerformance(context: RequestContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const validation = validateBody(requestSchemas.trackPerformance, body);
    
    if (!validation.success) {
      return createBadRequestResponse('Invalid performance data');
    }

    const { endpoint, response_time, error_rate } = validation.data;
    const db = createD1Client(context.env);
    
    // Insert performance metric
    const metricId = await db.insert('performance_metrics', {
      endpoint,
      response_time,
      error_rate,
      timestamp: new Date().toISOString()
    });
    
    return createSuccessResponse({
      metricId,
      endpoint,
      response_time,
      error_rate,
      timestamp: new Date().toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Track performance error:', error);
    return createErrorResponse('Failed to track performance', 'PERFORMANCE_ERROR', 500, context.request_id);
  }
}

// GET /api/analytics/performance - Get performance metrics
export async function getPerformanceMetrics(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const endpoint = url.searchParams.get('endpoint');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    if (limit < 1 || limit > 1000) {
      return createBadRequestResponse('Limit must be between 1 and 1000');
    }
    
    const db = createD1Client(context.env);
    
    // Build query based on filters
    let query = 'SELECT * FROM performance_metrics WHERE 1=1';
    const params: any[] = [];
    
    if (endpoint) {
      query += ' AND endpoint = ?';
      params.push(endpoint);
    }
    
    if (startDate) {
      query += ' AND timestamp >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND timestamp <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limit);
    
    const metrics = await db.getAll(query, params);
    
    return createSuccessResponse({
      metrics,
      count: metrics.length,
      filters: {
        endpoint,
        start_date: startDate,
        end_date: endDate
      }
    }, context.request_id);
  } catch (error) {
    console.error('Get performance metrics error:', error);
    return createErrorResponse('Failed to fetch performance metrics', 'FETCH_ERROR', 500, context.request_id);
  }
}

// GET /api/analytics/performance/summary - Get performance summary
export async function getPerformanceSummary(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const endpoint = url.searchParams.get('endpoint');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const period = url.searchParams.get('period') || '24h';
    
    const db = createD1Client(context.env);
    
    // Calculate date range
    const { start, end } = calculateDateRange(period, startDate || undefined, endDate || undefined);
    
    // Get performance summary
    const summary = await getPerformanceSummaryData(db, start, end, endpoint || undefined);
    
    // Get endpoint breakdown
    const endpointBreakdown = await getEndpointBreakdown(db, start, end);
    
    // Get performance trends
    const trends = await getPerformanceTrends(db, start, end, endpoint || undefined);
    
    return createSuccessResponse({
      period: {
        start,
        end,
        hours: Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60))
      },
      summary,
      endpoints: endpointBreakdown,
      trends
    }, context.request_id);
  } catch (error) {
    console.error('Get performance summary error:', error);
    return createErrorResponse('Failed to fetch performance summary', 'SUMMARY_ERROR', 500, context.request_id);
  }
}

// GET /api/analytics/performance/health - Get performance health status
export async function getPerformanceHealth(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const endpoint = url.searchParams.get('endpoint');
    
    const db = createD1Client(context.env);
    
    // Get recent performance data (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    let query = `
      SELECT 
        endpoint,
        AVG(response_time) as avg_response_time,
        AVG(error_rate) as avg_error_rate,
        COUNT(*) as request_count,
        MAX(timestamp) as last_request
      FROM performance_metrics
      WHERE timestamp >= ?
    `;
    
    const params = [oneHourAgo];
    
    if (endpoint) {
      query += ' AND endpoint = ?';
      params.push(endpoint);
    }
    
    query += ' GROUP BY endpoint ORDER BY avg_response_time DESC';
    
    const metrics = await db.getAll(query, params);
    
    // Calculate health status
    const healthStatus = calculateHealthStatus(metrics);
    
    return createSuccessResponse({
      status: healthStatus.overall,
      timestamp: new Date().toISOString(),
      endpoints: metrics.map(metric => ({
        endpoint: metric.endpoint,
        status: getEndpointHealthStatus(metric.avg_response_time, metric.avg_error_rate),
        avg_response_time: metric.avg_response_time,
        avg_error_rate: metric.avg_error_rate,
        request_count: metric.request_count,
        last_request: metric.last_request
      })),
      thresholds: {
        response_time: {
          good: 1000,
          warning: 3000,
          critical: 5000
        },
        error_rate: {
          good: 0.01,
          warning: 0.05,
          critical: 0.1
        }
      }
    }, context.request_id);
  } catch (error) {
    console.error('Get performance health error:', error);
    return createErrorResponse('Failed to fetch performance health', 'HEALTH_ERROR', 500, context.request_id);
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
      case '1h':
        start = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}

// Helper function to get performance summary data
async function getPerformanceSummaryData(db: any, start: string, end: string, endpoint?: string): Promise<any> {
  let query = `
    SELECT 
      AVG(response_time) as avg_response_time,
      MIN(response_time) as min_response_time,
      MAX(response_time) as max_response_time,
      AVG(error_rate) as avg_error_rate,
      MAX(error_rate) as max_error_rate,
      COUNT(*) as total_requests,
      COUNT(DISTINCT endpoint) as unique_endpoints
    FROM performance_metrics
    WHERE timestamp >= ? AND timestamp <= ?
  `;
  
  const params = [start, end];
  
  if (endpoint) {
    query += ' AND endpoint = ?';
    params.push(endpoint);
  }
  
  const result = await db.get(query, params);
  return result;
}

// Helper function to get endpoint breakdown
async function getEndpointBreakdown(db: any, start: string, end: string): Promise<any> {
  const query = `
    SELECT 
      endpoint,
      AVG(response_time) as avg_response_time,
      AVG(error_rate) as avg_error_rate,
      COUNT(*) as request_count,
      COUNT(DISTINCT DATE(timestamp)) as active_days
    FROM performance_metrics
    WHERE timestamp >= ? AND timestamp <= ?
    GROUP BY endpoint
    ORDER BY request_count DESC
  `;
  
  const results = await db.getAll(query, [start, end]);
  return results;
}

// Helper function to get performance trends
async function getPerformanceTrends(db: any, start: string, end: string, endpoint?: string): Promise<any> {
  let query = `
    SELECT 
      DATE(timestamp) as date,
      AVG(response_time) as avg_response_time,
      AVG(error_rate) as avg_error_rate,
      COUNT(*) as request_count
    FROM performance_metrics
    WHERE timestamp >= ? AND timestamp <= ?
  `;
  
  const params = [start, end];
  
  if (endpoint) {
    query += ' AND endpoint = ?';
    params.push(endpoint);
  }
  
  query += ' GROUP BY DATE(timestamp) ORDER BY date ASC';
  
  const results = await db.getAll(query, params);
  return results;
}

// Helper function to calculate health status
function calculateHealthStatus(metrics: any[]): { overall: string; details: any } {
  if (metrics.length === 0) {
    return { overall: 'unknown', details: {} };
  }
  
  const avgResponseTime = metrics.reduce((sum, m) => sum + m.avg_response_time, 0) / metrics.length;
  const avgErrorRate = metrics.reduce((sum, m) => sum + m.avg_error_rate, 0) / metrics.length;
  
  let overall = 'good';
  
  if (avgResponseTime > 5000 || avgErrorRate > 0.1) {
    overall = 'critical';
  } else if (avgResponseTime > 3000 || avgErrorRate > 0.05) {
    overall = 'warning';
  }
  
  return {
    overall,
    details: {
      avg_response_time: avgResponseTime,
      avg_error_rate: avgErrorRate,
      total_endpoints: metrics.length
    }
  };
}

// Helper function to get endpoint health status
function getEndpointHealthStatus(avgResponseTime: number, avgErrorRate: number): string {
  if (avgResponseTime > 5000 || avgErrorRate > 0.1) {
    return 'critical';
  } else if (avgResponseTime > 3000 || avgErrorRate > 0.05) {
    return 'warning';
  } else {
    return 'good';
  }
}
