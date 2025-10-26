// API Gateway Worker - Main entry point

import { Env, RequestContext } from '../../shared/src/types';
import { createRouter } from './utils/router';
import { createPublicMiddleware, applyMiddlewareToResponse } from './middleware/index';

// Import route handlers
import { getTools, getToolById, searchTools, getToolFeatures } from './routes/tools';
import { getCategories, getCategoryById, getCategoryTools } from './routes/categories';
import { getSystemStatus, getSystemConfig, getSystemConfigValue, getHealthCheck, getSystemMetrics } from './routes/system';
import { getAnnouncements, getAnnouncementById, getActiveAnnouncements, getAnnouncementsByPriority, getAnnouncementsByAudience } from './routes/announcements';
import { getChangelog, getChangelogByVersion, getRecentChangelog, getLatestVersion } from './routes/changelog';
import { getUserHistory, saveUserHistory, clearUserHistory } from './routes/user-history';
import { createProtectedMiddleware } from './middleware/index';

// Create router
const router = createRouter();

// Create protected middleware for user routes
const protectedMiddleware = createProtectedMiddleware();

// Register routes
// Tools routes
router.get('/api/tools', getTools);
router.get('/api/tools/search', searchTools);
router.get('/api/tools/:id', getToolById);
router.get('/api/tools/:id/features', getToolFeatures);

// Categories routes
router.get('/api/categories', getCategories);
router.get('/api/categories/:id', getCategoryById);
router.get('/api/categories/:id/tools', getCategoryTools);

// System routes
router.get('/api/system/status', getSystemStatus);
router.get('/api/system/config', getSystemConfig);
router.get('/api/system/config/:key', getSystemConfigValue);
router.get('/api/system/health', getHealthCheck);
router.get('/api/system/metrics', getSystemMetrics);

// Announcements routes
router.get('/api/announcements', getAnnouncements);
router.get('/api/announcements/active', getActiveAnnouncements);
router.get('/api/announcements/:id', getAnnouncementById);
router.get('/api/announcements/priority/:priority', getAnnouncementsByPriority);
router.get('/api/announcements/audience/:audience', getAnnouncementsByAudience);

// Changelog routes
router.get('/api/changelog', getChangelog);
router.get('/api/changelog/latest', getLatestVersion);
router.get('/api/changelog/recent', getRecentChangelog);
router.get('/api/changelog/version/:version', getChangelogByVersion);

// User History routes (protected)
router.get('/api/user/conversion-history', getUserHistory, protectedMiddleware);
router.post('/api/user/conversion-history', saveUserHistory, protectedMiddleware);
router.delete('/api/user/conversion-history', clearUserHistory, protectedMiddleware);

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
        // Apply middleware to response even for rate limit errors to include headers
        return applyMiddlewareToResponse(middlewareResult, context);
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