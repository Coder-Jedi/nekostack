// Analytics Service Worker - Main entry point

import { Env, RequestContext } from '../../shared/src/types';
import { createRouter } from './utils/router';
import { createPublicMiddleware, applyMiddlewareToResponse } from './middleware/index';

// Import route handlers
import { trackEvent, getEvents, trackBatchEvents } from './routes/events';
import { getAnalyticsStats, getToolStats, getUsageTrends } from './routes/stats';
import { trackPerformance, getPerformanceMetrics, getPerformanceSummary, getPerformanceHealth } from './routes/performance';

// Create router
const router = createRouter();

// Register routes
// Events routes
router.post('/api/analytics/track', trackEvent);
router.get('/api/analytics/events', getEvents);
router.post('/api/analytics/batch', trackBatchEvents);

// Stats routes
router.get('/api/analytics/stats', getAnalyticsStats);
router.get('/api/analytics/tools/:toolId/stats', getToolStats);
router.get('/api/analytics/trends', getUsageTrends);

// Performance routes
router.post('/api/analytics/performance', trackPerformance);
router.get('/api/analytics/performance', getPerformanceMetrics);
router.get('/api/analytics/performance/summary', getPerformanceSummary);
router.get('/api/analytics/performance/health', getPerformanceHealth);

// CORS preflight
router.options('*', async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
});

// Create middleware
const middleware = createPublicMiddleware();

// Main worker handler
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Create request context
      const context: RequestContext = {
        request,
        env,
        ctx,
        request_id: generateRequestId()
      };

      // Apply middleware
      const middlewareResult = await middleware(context);
      if (middlewareResult.status !== 200) {
        return middlewareResult;
      }

      // Handle request with router
      const response = await router.handle(context);

      // Apply middleware to response
      return applyMiddlewareToResponse(response, context);
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error'
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: generateRequestId()
        }
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};

// Helper function to generate request ID
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
