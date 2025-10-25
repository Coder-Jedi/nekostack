// Changelog API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createBadRequestResponse 
} from '../../../shared/src/utils/response';

// GET /api/changelog - Get latest changelog entries
export async function getChangelog(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    if (limit < 1 || limit > 100) {
      return createBadRequestResponse('Limit must be between 1 and 100');
    }

    const db = createD1Client(context.env);
    const changelog = await db.getAll(QUERIES.CHANGELOG.GET_LATEST, [limit]);

    return createSuccessResponse({
      changelog,
      count: changelog.length,
      limit
    }, context.request_id);
  } catch (error) {
    console.error('Get changelog error:', error);
    return createBadRequestResponse('Failed to fetch changelog');
  }
}

// GET /api/changelog/version/:version - Get changelog by version
export async function getChangelogByVersion(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const version = url.pathname.split('/').pop();

    if (!version) {
      return createBadRequestResponse('Version is required');
    }

    const db = createD1Client(context.env);
    const changelog = await db.get(QUERIES.CHANGELOG.GET_BY_VERSION, [version]);

    if (!changelog) {
      return createNotFoundResponse('Version not found', context.request_id);
    }

    return createSuccessResponse(changelog, context.request_id);
  } catch (error) {
    console.error('Get changelog by version error:', error);
    return createBadRequestResponse('Failed to fetch changelog version');
  }
}

// GET /api/changelog/recent - Get recent changelog entries
export async function getRecentChangelog(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    
    if (days < 1 || days > 365) {
      return createBadRequestResponse('Days must be between 1 and 365');
    }

    const db = createD1Client(context.env);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const changelog = await db.getAll(QUERIES.CHANGELOG.GET_RECENT, [startDate.toISOString()]);

    return createSuccessResponse({
      changelog,
      count: changelog.length,
      days,
      start_date: startDate.toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Get recent changelog error:', error);
    return createBadRequestResponse('Failed to fetch recent changelog');
  }
}

// GET /api/changelog/latest - Get latest version info
export async function getLatestVersion(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    const latest = await db.get(QUERIES.CHANGELOG.GET_LATEST, [1]);

    if (!latest || latest.length === 0) {
      return createNotFoundResponse('No changelog entries found', context.request_id);
    }

    const version = latest[0];

    return createSuccessResponse({
      version: version.version,
      title: version.title,
      description: version.description,
      release_date: version.release_date,
      features: version.features ? JSON.parse(version.features) : []
    }, context.request_id);
  } catch (error) {
    console.error('Get latest version error:', error);
    return createBadRequestResponse('Failed to fetch latest version');
  }
}
