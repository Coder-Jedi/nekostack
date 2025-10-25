// System Status API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createBadRequestResponse 
} from '../../../shared/src/utils/response';

// GET /api/notifications/status - Get system status
export async function getSystemStatus(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    
    // Check database health
    const dbHealthy = await db.healthCheck();
    
    // Get system configuration
    const config = await db.getAll(QUERIES.SYSTEM.GET_ALL_CONFIG);
    
    // Get recent performance metrics
    const performanceQuery = `
      SELECT 
        endpoint,
        AVG(response_time) as avg_response_time,
        AVG(error_rate) as avg_error_rate,
        COUNT(*) as request_count
      FROM performance_metrics
      WHERE timestamp >= datetime('now', '-1 hour')
      GROUP BY endpoint
    `;
    const performance = await db.getAll(performanceQuery);

    // Get active announcements
    const announcementsQuery = `
      SELECT COUNT(*) as active_announcements
      FROM announcements
      WHERE is_active = 1 
      AND (start_date <= ? AND (end_date IS NULL OR end_date >= ?))
    `;
    const announcements = await db.get(announcementsQuery, [new Date().toISOString(), new Date().toISOString()]);

    const status = {
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'healthy' : 'degraded',
        api: 'healthy',
        workers: 'healthy',
        notifications: 'healthy'
      },
      performance: {
        average_response_time: performance.reduce((sum, p) => sum + p.avg_response_time, 0) / performance.length || 0,
        error_rate: performance.reduce((sum, p) => sum + p.avg_error_rate, 0) / performance.length || 0,
        total_requests: performance.reduce((sum, p) => sum + p.request_count, 0)
      },
      notifications: {
        active_announcements: announcements?.active_announcements || 0
      },
      config: config.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>)
    };

    return createSuccessResponse(status, context.request_id);
  } catch (error) {
    console.error('Get system status error:', error);
    return createBadRequestResponse('Failed to fetch system status');
  }
}

// GET /api/notifications/status/health - Health check endpoint
export async function getHealthCheck(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    const dbHealthy = await db.healthCheck();

    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        notifications: 'healthy'
      }
    };

    const status = dbHealthy ? 200 : 503;
    return new Response(JSON.stringify(health), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// GET /api/notifications/status/incidents - Get system incidents
export async function getSystemIncidents(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const status = url.searchParams.get('status') || 'active';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    if (limit < 1 || limit > 100) {
      return createBadRequestResponse('Limit must be between 1 and 100');
    }

    const db = createD1Client(context.env);
    
    // Get incidents from announcements with critical priority
    const query = `
      SELECT 
        id,
        title,
        content,
        priority,
        start_date,
        end_date,
        created_at,
        CASE 
          WHEN end_date IS NULL OR end_date >= ? THEN 'active'
          ELSE 'resolved'
        END as incident_status
      FROM announcements
      WHERE priority = 'critical'
      AND (start_date <= ? AND (end_date IS NULL OR end_date >= ?))
      ORDER BY created_at DESC
      LIMIT ?
    `;
    
    const incidents = await db.getAll(query, [
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString(),
      limit
    ]);

    // Filter by status if specified
    const filteredIncidents = status === 'all' 
      ? incidents 
      : incidents.filter(incident => incident.incident_status === status);

    return createSuccessResponse({
      incidents: filteredIncidents,
      count: filteredIncidents.length,
      status,
      total: incidents.length
    }, context.request_id);
  } catch (error) {
    console.error('Get system incidents error:', error);
    return createBadRequestResponse('Failed to fetch system incidents');
  }
}

// GET /api/notifications/status/uptime - Get system uptime
export async function getSystemUptime(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const period = url.searchParams.get('period') || '24h';
    
    const db = createD1Client(context.env);
    
    // Calculate date range
    const { start, end } = calculateDateRange(period);
    
    // Get uptime data from performance metrics
    const query = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as total_requests,
        COUNT(CASE WHEN error_rate = 0 THEN 1 END) as successful_requests,
        AVG(response_time) as avg_response_time,
        AVG(error_rate) as avg_error_rate
      FROM performance_metrics
      WHERE timestamp >= ? AND timestamp <= ?
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;
    
    const uptimeData = await db.getAll(query, [start, end]);
    
    // Calculate overall uptime percentage
    const totalRequests = uptimeData.reduce((sum, day) => sum + day.total_requests, 0);
    const successfulRequests = uptimeData.reduce((sum, day) => sum + day.successful_requests, 0);
    const uptimePercentage = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;
    
    // Calculate average response time
    const avgResponseTime = uptimeData.reduce((sum, day) => sum + day.avg_response_time, 0) / uptimeData.length || 0;
    
    // Calculate average error rate
    const avgErrorRate = uptimeData.reduce((sum, day) => sum + day.avg_error_rate, 0) / uptimeData.length || 0;

    return createSuccessResponse({
      period: {
        start,
        end,
        days: Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
      },
      uptime: {
        percentage: Math.round(uptimePercentage * 100) / 100,
        total_requests: totalRequests,
        successful_requests: successfulRequests,
        failed_requests: totalRequests - successfulRequests
      },
      performance: {
        average_response_time: Math.round(avgResponseTime * 100) / 100,
        average_error_rate: Math.round(avgErrorRate * 10000) / 10000
      },
      daily_data: uptimeData.map(day => ({
        date: day.date,
        uptime_percentage: day.total_requests > 0 ? Math.round((day.successful_requests / day.total_requests) * 10000) / 100 : 100,
        total_requests: day.total_requests,
        avg_response_time: Math.round(day.avg_response_time * 100) / 100,
        avg_error_rate: Math.round(day.avg_error_rate * 10000) / 10000
      }))
    }, context.request_id);
  } catch (error) {
    console.error('Get system uptime error:', error);
    return createBadRequestResponse('Failed to fetch system uptime');
  }
}

// Helper function to calculate date range
function calculateDateRange(period: string): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString();
  
  let start: Date;
  
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
    case '90d':
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
  
  return {
    start: start.toISOString(),
    end
  };
}
