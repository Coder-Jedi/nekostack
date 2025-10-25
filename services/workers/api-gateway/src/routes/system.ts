// System API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createBadRequestResponse 
} from '../../../shared/src/utils/response';

// GET /api/system/status - Get system status
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

    const status = {
      status: dbHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'healthy' : 'degraded',
        api: 'healthy',
        workers: 'healthy'
      },
      performance: {
        average_response_time: performance.reduce((sum, p) => sum + p.avg_response_time, 0) / performance.length || 0,
        error_rate: performance.reduce((sum, p) => sum + p.avg_error_rate, 0) / performance.length || 0,
        total_requests: performance.reduce((sum, p) => sum + p.request_count, 0)
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

// GET /api/system/config - Get system configuration
export async function getSystemConfig(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    const config = await db.getAll(QUERIES.SYSTEM.GET_ALL_CONFIG);

    const configObject = config.reduce((acc, item) => {
      acc[item.key] = {
        value: item.value,
        description: item.description
      };
      return acc;
    }, {} as Record<string, any>);

    return createSuccessResponse(configObject, context.request_id);
  } catch (error) {
    console.error('Get system config error:', error);
    return createBadRequestResponse('Failed to fetch system configuration');
  }
}

// GET /api/system/config/:key - Get specific config value
export async function getSystemConfigValue(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const key = url.pathname.split('/').pop();

    if (!key) {
      return createBadRequestResponse('Config key is required');
    }

    const db = createD1Client(context.env);
    const config = await db.get(QUERIES.SYSTEM.GET_CONFIG, [key]);

    if (!config) {
      return createNotFoundResponse('Config key not found', context.request_id);
    }

    return createSuccessResponse({
      key: config.key,
      value: config.value,
      description: config.description
    }, context.request_id);
  } catch (error) {
    console.error('Get system config value error:', error);
    return createBadRequestResponse('Failed to fetch config value');
  }
}

// GET /api/system/health - Health check endpoint
export async function getHealthCheck(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    const dbHealthy = await db.healthCheck();

    const health = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy'
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

// GET /api/system/metrics - Get system metrics
export async function getSystemMetrics(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    
    // Get performance metrics for the last 24 hours
    const performanceQuery = `
      SELECT 
        endpoint,
        AVG(response_time) as avg_response_time,
        AVG(error_rate) as avg_error_rate,
        COUNT(*) as request_count,
        MAX(timestamp) as last_request
      FROM performance_metrics
      WHERE timestamp >= datetime('now', '-24 hours')
      GROUP BY endpoint
      ORDER BY request_count DESC
    `;
    const performance = await db.getAll(performanceQuery);

    // Get tool usage stats
    const usageQuery = `
      SELECT 
        t.name as tool_name,
        SUM(tus.usage_count) as total_usage,
        SUM(tus.unique_users) as total_users,
        AVG(tus.avg_duration) as avg_duration
      FROM tools t
      LEFT JOIN tool_usage_stats tus ON t.id = tus.tool_id
      WHERE t.is_active = 1
      GROUP BY t.id, t.name
      ORDER BY total_usage DESC
    `;
    const usage = await db.getAll(usageQuery);

    const metrics = {
      timestamp: new Date().toISOString(),
      performance,
      usage,
      summary: {
        total_endpoints: performance.length,
        total_tools: usage.length,
        total_requests: performance.reduce((sum, p) => sum + p.request_count, 0),
        total_tool_usage: usage.reduce((sum, u) => sum + (u.total_usage || 0), 0)
      }
    };

    return createSuccessResponse(metrics, context.request_id);
  } catch (error) {
    console.error('Get system metrics error:', error);
    return createBadRequestResponse('Failed to fetch system metrics');
  }
}
