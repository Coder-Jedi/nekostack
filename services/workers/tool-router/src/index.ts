// Tool Router Worker - Main entry point

import { Env, RequestContext } from '../../shared/src/types';
import { createRouter } from './utils/router';
import { createPublicMiddleware, applyMiddlewareToResponse } from './middleware/index';

// Import route handlers
import { convertUnits, convertCurrency, getConversionCategories, getCurrencyList, getCurrencyRates } from './routes/unit-converter';
import { generateQRCode, generateBulkQRCodes, getSupportedFormats as getQrFormats, getErrorCorrectionLevels } from './routes/qr-generator';
import { convertMarkdown, getMarkdownJobStatus, getSupportedFormats as getMarkdownFormats } from './routes/markdown-converter';

// Create router
const router = createRouter();

// Register routes
// Unit Converter routes
router.post('/api/tools/unit-converter', convertUnits);
router.post('/api/tools/unit-converter/currency', convertCurrency);
router.get('/api/tools/unit-converter/categories', getConversionCategories);
router.get('/api/tools/unit-converter/currency/list', getCurrencyList);
router.get('/api/tools/unit-converter/currency/rates', getCurrencyRates);

// QR Generator routes
router.post('/api/tools/qr-generator', generateQRCode);
router.post('/api/tools/qr-generator/bulk', generateBulkQRCodes);
router.get('/api/tools/qr-generator/formats', getQrFormats);
router.get('/api/tools/qr-generator/error-levels', getErrorCorrectionLevels);

// Markdown Converter routes
router.post('/api/tools/markdown-converter', convertMarkdown);
router.get('/api/tools/markdown-converter/job/:jobId', getMarkdownJobStatus);
router.get('/api/tools/markdown-converter/formats', getMarkdownFormats);

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
    // Check for manual forex rate refresh trigger
    const url = new URL(request.url);
    if (url.pathname === '/api/admin/refresh-rates' && request.method === 'POST') {
      try {
        const context: RequestContext = {
          request,
          env,
          ctx,
          request_id: generateRequestId()
        };
        
        // Import and call updateForexRatesFromAPI
        const { updateForexRatesFromAPI } = await import('./services/forex-service');
        await updateForexRatesFromAPI(context);
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Forex rates refreshed successfully',
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Manual rate refresh failed:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

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
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Cron triggered at:', new Date(event.scheduledTime).toISOString());
    
    try {
      const context: RequestContext = {
        request: new Request('https://internal/cron'),
        env,
        ctx,
        request_id: `cron-${Date.now()}`
      };
      
      // Import and call updateForexRatesFromAPI
      const { updateForexRatesFromAPI } = await import('./services/forex-service');
      await updateForexRatesFromAPI(context);
      
      console.log('Forex rates updated successfully');
    } catch (error) {
      console.error('Cron job failed:', error);
      // Don't throw - let existing cache continue to serve
    }
  }
};

// Helper function to generate request ID
function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
