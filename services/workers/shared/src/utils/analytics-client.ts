// Analytics Client - Service binding integration for tracking events
import { RequestContext } from '../types';

export interface AnalyticsEvent {
  event_type: string;
  tool_id: string;
  metadata?: Record<string, any>;
  user_id?: string;
}

/**
 * Track analytics event using internal service binding
 * Only analytics-service should write to analytics_events table
 */
export async function trackEvent(
  context: RequestContext,
  event: AnalyticsEvent
): Promise<void> {
  try {
    if (!context.env.ANALYTICS_SERVICE) {
      console.warn('[Analytics] Service binding not available, event not tracked:', event.event_type);
      return;
    }
    
    const response = await context.env.ANALYTICS_SERVICE.fetch(
      new Request('http://internal/api/analytics/track', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true'
        },
        body: JSON.stringify({
          event_type: event.event_type,
          tool_id: event.tool_id,
          metadata: event.metadata || {},
          ...(event.user_id && { user_id: event.user_id })
        })
      })
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Analytics service returned ${response.status}: ${errorText}`);
    }
    
    console.log(`[Analytics] Event tracked via service binding: ${event.event_type}`);
    
  } catch (error) {
    console.error('[Analytics] Tracking failed:', error);
    // Don't throw - analytics failure shouldn't break main flow
  }
}

/**
 * Track multiple events in batch
 */
export async function trackEventBatch(
  context: RequestContext,
  events: AnalyticsEvent[]
): Promise<void> {
  if (events.length === 0) return;
  
  try {
    if (!context.env.ANALYTICS_SERVICE) {
      console.warn('[Analytics] Service binding not available, batch not tracked');
      return;
    }
    
    const response = await context.env.ANALYTICS_SERVICE.fetch(
      new Request('http://internal/api/analytics/batch', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true'
        },
        body: JSON.stringify({ events })
      })
    );
    
    if (!response.ok) {
      throw new Error(`Analytics batch failed: ${response.status}`);
    }
    
    console.log(`[Analytics] Batch tracked ${events.length} events via service binding`);
    
  } catch (error) {
    console.error('[Analytics] Batch tracking failed:', error);
  }
}

