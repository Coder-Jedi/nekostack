// Analytics Events API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createBadRequestResponse,
  createErrorResponse 
} from '../../../shared/src/utils/response';
import { validateBody, requestSchemas } from '../../../shared/src/utils/validation';

// POST /api/analytics/track - Track analytics event
export async function trackEvent(context: RequestContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const validation = validateBody(requestSchemas.trackEvent, body);
    
    if (!validation.success) {
      return createBadRequestResponse('Invalid event data');
    }

    const { event_type, tool_id, metadata, user_id } = validation.data;
    const db = createD1Client(context.env);
    
    // Insert event
    const eventId = await db.insert('analytics_events', {
      user_id: user_id || null,
      event_type,
      tool_id: tool_id || null,
      metadata: JSON.stringify(metadata || {}),
      timestamp: new Date().toISOString()
    });
    
    // Update real-time stats if enabled
    if ((context.env as any).REAL_TIME_AGGREGATION === 'true') {
      await updateRealtimeStats(db, tool_id || null, user_id || null, event_type);
    }
    
    return createSuccessResponse({
      eventId,
      event_type,
      tool_id,
      user_id,
      timestamp: new Date().toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Track event error:', error);
    return createErrorResponse('Failed to track event', 'TRACKING_ERROR', 500, context.request_id);
  }
}

// GET /api/analytics/events - Get analytics events
export async function getEvents(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const userId = url.searchParams.get('user_id');
    const toolId = url.searchParams.get('tool_id');
    const eventType = url.searchParams.get('event_type');
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    
    if (limit < 1 || limit > 1000) {
      return createBadRequestResponse('Limit must be between 1 and 1000');
    }
    
    const db = createD1Client(context.env);
    
    // Build query based on filters
    let query = 'SELECT * FROM analytics_events WHERE 1=1';
    const params: any[] = [];
    
    if (userId) {
      query += ' AND user_id = ?';
      params.push(userId);
    }
    
    if (toolId) {
      query += ' AND tool_id = ?';
      params.push(toolId);
    }
    
    if (eventType) {
      query += ' AND event_type = ?';
      params.push(eventType);
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
    
    const events = await db.getAll(query, params);
    
    // Parse metadata JSON
    const parsedEvents = events.map(event => ({
      ...event,
      metadata: JSON.parse(event.metadata || '{}')
    }));
    
    return createSuccessResponse({
      events: parsedEvents,
      count: parsedEvents.length,
      filters: {
        user_id: userId,
        tool_id: toolId,
        event_type: eventType,
        start_date: startDate,
        end_date: endDate
      }
    }, context.request_id);
  } catch (error) {
    console.error('Get events error:', error);
    return createErrorResponse('Failed to fetch events', 'FETCH_ERROR', 500, context.request_id);
  }
}

// POST /api/analytics/batch - Track multiple events
export async function trackBatchEvents(context: RequestContext): Promise<Response> {
  try {
    const body: any = await context.request.json();
    const { events } = body;
    
    if (!Array.isArray(events) || events.length === 0) {
      return createBadRequestResponse('Events array is required');
    }
    
    if (events.length > 100) {
      return createBadRequestResponse('Maximum 100 events allowed per batch');
    }
    
    const db = createD1Client(context.env);
    const results = [];
    
    for (let i = 0; i < events.length; i++) {
      try {
        const validation = validateBody(requestSchemas.trackEvent, events[i]);
        if (!validation.success) {
          results.push({
            index: i,
            success: false,
            error: 'Invalid event data'
          });
          continue;
        }
        
        const { event_type, tool_id, metadata, user_id } = validation.data;
        const eventId = await db.insert('analytics_events', {
          user_id: user_id || null,
          event_type,
          tool_id: tool_id || null,
          metadata: JSON.stringify(metadata || {}),
          timestamp: new Date().toISOString()
        });
        
        results.push({
          index: i,
          success: true,
          eventId
        });
      } catch (error: any) {
        results.push({
          index: i,
          success: false,
          error: error.message || 'Unknown error'
        });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return createSuccessResponse({
      results,
      summary: {
        total: events.length,
        successful,
        failed
      }
    }, context.request_id);
  } catch (error) {
    console.error('Track batch events error:', error);
    return createErrorResponse('Failed to track batch events', 'BATCH_ERROR', 500, context.request_id);
  }
}

// Helper function to update real-time stats
async function updateRealtimeStats(
  db: any, 
  toolId: string | null, 
  userId: string | null, 
  eventType: string
): Promise<void> {
  try {
    if (!toolId) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Get current stats
    const existingStats = await db.get(
      'SELECT * FROM tool_usage_stats WHERE tool_id = ? AND date = ?',
      [toolId, today]
    );
    
    if (existingStats) {
      // Update existing stats
      await db.update('tool_usage_stats', {
        usage_count: existingStats.usage_count + 1,
        unique_users: userId ? existingStats.unique_users : existingStats.unique_users,
        updated_at: new Date().toISOString()
      }, {
        tool_id: toolId,
        date: today
      });
    } else {
      // Create new stats
      await db.insert('tool_usage_stats', {
        tool_id: toolId,
        date: today,
        usage_count: 1,
        unique_users: userId ? 1 : 0,
        avg_duration: 0
      });
    }
  } catch (error) {
    console.error('Update real-time stats error:', error);
    // Don't throw error to avoid breaking the main flow
  }
}
