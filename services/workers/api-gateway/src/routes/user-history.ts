// User History API routes

import { RequestContext } from '../../../shared/src/types';
import { 
  createSuccessResponse, 
  createBadRequestResponse, 
  createErrorResponse, 
  createUnauthorizedResponse 
} from '../../../shared/src/utils/response';

// GET /api/user/conversion-history - Get user's conversion history
export async function getUserHistory(context: RequestContext): Promise<Response> {
  try {
    if (!context.user_id) {
      return createUnauthorizedResponse('Authentication required');
    }

    const url = new URL(context.request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // In a real implementation, this would query the database
    // For now, return empty history with pagination info
    return createSuccessResponse({ 
      history: [], 
      pagination: { 
        limit, 
        offset, 
        total: 0,
        hasMore: false
      } 
    }, context.request_id);
  } catch (error) {
    console.error('Get user history error:', error);
    return createErrorResponse('Failed to fetch user history', 'HISTORY_FETCH_ERROR', 500, context.request_id);
  }
}

// POST /api/user/conversion-history - Save a conversion to user history
export async function saveUserHistory(context: RequestContext): Promise<Response> {
  try {
    if (!context.user_id) {
      return createUnauthorizedResponse('Authentication required');
    }

    const body = await context.request.json() as any;
    
    if (!body.type || !body.from || !body.to) {
      return createBadRequestResponse('Missing required fields: type, from, to');
    }

    // Validate type
    if (!['unit', 'currency'].includes(body.type)) {
      return createBadRequestResponse('Invalid type. Must be "unit" or "currency"');
    }

    // In a real implementation, this would save to the database
    // For now, return a mock success response
    const historyId = Math.random().toString(36).substring(2, 15);
    
    return createSuccessResponse({ 
      saved: true, 
      id: historyId,
      timestamp: new Date().toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Save user history error:', error);
    return createErrorResponse('Failed to save conversion history', 'HISTORY_SAVE_ERROR', 500, context.request_id);
  }
}

// DELETE /api/user/conversion-history - Clear user's conversion history
export async function clearUserHistory(context: RequestContext): Promise<Response> {
  try {
    if (!context.user_id) {
      return createUnauthorizedResponse('Authentication required');
    }

    // In a real implementation, this would delete from the database
    // For now, return a mock success response
    return createSuccessResponse({ 
      cleared: true, 
      deletedCount: 0,
      timestamp: new Date().toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Clear user history error:', error);
    return createErrorResponse('Failed to clear conversion history', 'HISTORY_CLEAR_ERROR', 500, context.request_id);
  }
}
