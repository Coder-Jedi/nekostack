// Announcements API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createBadRequestResponse 
} from '../../../shared/src/utils/response';
import { validateQueryParams, requestSchemas } from '../../../shared/src/utils/validation';

// GET /api/notifications/announcements - Get active announcements
export async function getAnnouncements(context: RequestContext): Promise<Response> {
  try {
    const validation = validateQueryParams(requestSchemas.getAnnouncements, new URL(context.request.url));
    if (!validation.success) {
      return createBadRequestResponse('Invalid query parameters');
    }

    const { audience, priority } = validation.data;
    const db = createD1Client(context.env);
    
    let query = QUERIES.ANNOUNCEMENTS.GET_ACTIVE;
    let params = [new Date().toISOString(), new Date().toISOString()];

    // Apply audience filter
    if (audience && audience !== 'all') {
      query = QUERIES.ANNOUNCEMENTS.GET_BY_AUDIENCE;
      params = [audience, new Date().toISOString(), new Date().toISOString()];
    }

    let announcements = await db.getAll(query, params);

    // Apply priority filter
    if (priority) {
      announcements = announcements.filter(announcement => announcement.priority === priority);
    }

    // Sort by priority and creation date
    announcements.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return createSuccessResponse({
      announcements,
      count: announcements.length,
      filters: {
        audience: audience || 'all',
        priority: priority || 'all'
      }
    }, context.request_id);
  } catch (error) {
    console.error('Get announcements error:', error);
    return createBadRequestResponse('Failed to fetch announcements');
  }
}

// GET /api/notifications/announcements/:id - Get announcement by ID
export async function getAnnouncementById(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const announcementId = url.pathname.split('/').pop();

    if (!announcementId) {
      return createBadRequestResponse('Announcement ID is required');
    }

    const db = createD1Client(context.env);
    const announcement = await db.get(QUERIES.ANNOUNCEMENTS.GET_BY_ID, [announcementId]);

    if (!announcement) {
      return createNotFoundResponse('Announcement not found', context.request_id);
    }

    return createSuccessResponse(announcement, context.request_id);
  } catch (error) {
    console.error('Get announcement by ID error:', error);
    return createBadRequestResponse('Failed to fetch announcement');
  }
}

// GET /api/notifications/announcements/priority/:priority - Get announcements by priority
export async function getAnnouncementsByPriority(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const priority = url.pathname.split('/').pop();

    if (!priority || !['low', 'medium', 'high', 'critical'].includes(priority)) {
      return createBadRequestResponse('Valid priority is required (low, medium, high, critical)');
    }

    const db = createD1Client(context.env);
    const query = `
      SELECT * FROM announcements
      WHERE is_active = 1 
      AND priority = ?
      AND (start_date <= ? AND (end_date IS NULL OR end_date >= ?))
      ORDER BY created_at DESC
    `;
    const announcements = await db.getAll(query, [priority, new Date().toISOString(), new Date().toISOString()]);

    return createSuccessResponse({
      announcements,
      count: announcements.length,
      priority
    }, context.request_id);
  } catch (error) {
    console.error('Get announcements by priority error:', error);
    return createBadRequestResponse('Failed to fetch announcements by priority');
  }
}

// GET /api/notifications/announcements/audience/:audience - Get announcements by audience
export async function getAnnouncementsByAudience(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const audience = url.pathname.split('/').pop();

    if (!audience || !['all', 'free', 'pro', 'enterprise'].includes(audience)) {
      return createBadRequestResponse('Valid audience is required (all, free, pro, enterprise)');
    }

    const db = createD1Client(context.env);
    const query = QUERIES.ANNOUNCEMENTS.GET_BY_AUDIENCE;
    const announcements = await db.getAll(query, [audience, new Date().toISOString(), new Date().toISOString()]);

    return createSuccessResponse({
      announcements,
      count: announcements.length,
      audience
    }, context.request_id);
  } catch (error) {
    console.error('Get announcements by audience error:', error);
    return createBadRequestResponse('Failed to fetch announcements by audience');
  }
}

// GET /api/notifications/announcements/active - Get only active announcements (alias)
export async function getActiveAnnouncements(context: RequestContext): Promise<Response> {
  return getAnnouncements(context);
}

// GET /api/notifications/announcements/critical - Get critical announcements
export async function getCriticalAnnouncements(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    const query = `
      SELECT * FROM announcements
      WHERE is_active = 1 
      AND priority = 'critical'
      AND (start_date <= ? AND (end_date IS NULL OR end_date >= ?))
      ORDER BY created_at DESC
    `;
    const announcements = await db.getAll(query, [new Date().toISOString(), new Date().toISOString()]);

    return createSuccessResponse({
      announcements,
      count: announcements.length,
      priority: 'critical'
    }, context.request_id);
  } catch (error) {
    console.error('Get critical announcements error:', error);
    return createBadRequestResponse('Failed to fetch critical announcements');
  }
}
