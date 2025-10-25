// Notification Service Worker - Main entry point

import { Env, RequestContext } from '../../shared/src/types';
import { createRouter } from './utils/router';
import { createPublicMiddleware, applyMiddlewareToResponse } from './middleware/index';

// Import route handlers
import { 
  getAnnouncements, 
  getAnnouncementById, 
  getAnnouncementsByPriority, 
  getAnnouncementsByAudience, 
  getActiveAnnouncements, 
  getCriticalAnnouncements 
} from './routes/announcements';
import { 
  getSystemStatus, 
  getHealthCheck, 
  getSystemIncidents, 
  getSystemUptime 
} from './routes/system-status';

// Create router
const router = createRouter();

// Register routes
// Announcements routes
router.get('/api/notifications/announcements', getAnnouncements);
router.get('/api/notifications/announcements/active', getActiveAnnouncements);
router.get('/api/notifications/announcements/critical', getCriticalAnnouncements);
router.get('/api/notifications/announcements/:id', getAnnouncementById);
router.get('/api/notifications/announcements/priority/:priority', getAnnouncementsByPriority);
router.get('/api/notifications/announcements/audience/:audience', getAnnouncementsByAudience);

// System status routes
router.get('/api/notifications/status', getSystemStatus);
router.get('/api/notifications/status/health', getHealthCheck);
router.get('/api/notifications/status/incidents', getSystemIncidents);
router.get('/api/notifications/status/uptime', getSystemUptime);

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
