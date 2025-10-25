// Tools API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createBadRequestResponse 
} from '../../../shared/src/utils/response';
import { validateQueryParams, requestSchemas } from '../../../shared/src/utils/validation';

// GET /api/tools - Get all tools
export async function getTools(context: RequestContext): Promise<Response> {
  try {
    const validation = validateQueryParams(requestSchemas.getTools, new URL(context.request.url));
    if (!validation.success) {
      return createBadRequestResponse('Invalid query parameters');
    }

    const { category, search, page, limit } = validation.data;
    const db = createD1Client(context.env);
    
    let query = QUERIES.TOOLS.GET_ALL;
    let params: any[] = [];

    // Apply filters
    if (category) {
      query = QUERIES.TOOLS.GET_BY_CATEGORY;
      params = [category];
    } else if (search) {
      query = QUERIES.TOOLS.SEARCH;
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm];
    }

    // Add pagination
    const offset = ((page || 1) - 1) * (limit || 20);
    query += ` LIMIT ${limit || 20} OFFSET ${offset}`;

    const tools = await db.getAll(query, params);

    // Get features for each tool
    for (const tool of tools) {
      const features = await db.getAll(QUERIES.TOOLS.GET_FEATURES, [tool.id]);
      tool.features = features;
    }

    return createSuccessResponse({
      tools,
      pagination: {
        page,
        limit,
        total: tools.length
      }
    }, context.request_id);
  } catch (error) {
    console.error('Get tools error:', error);
    return createBadRequestResponse('Failed to fetch tools');
  }
}

// GET /api/tools/:id - Get tool by ID
export async function getToolById(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const toolId = url.pathname.split('/').pop();

    if (!toolId) {
      return createBadRequestResponse('Tool ID is required');
    }

    const db = createD1Client(context.env);
    const tool = await db.get(QUERIES.TOOLS.GET_BY_ID, [toolId]);

    if (!tool) {
      return createNotFoundResponse('Tool not found', context.request_id);
    }

    // Get features
    const features = await db.getAll(QUERIES.TOOLS.GET_FEATURES, [toolId]);
    tool.features = features;

    return createSuccessResponse(tool, context.request_id);
  } catch (error) {
    console.error('Get tool by ID error:', error);
    return createBadRequestResponse('Failed to fetch tool');
  }
}

// GET /api/tools/search - Search tools
export async function searchTools(context: RequestContext): Promise<Response> {
  try {
    const validation = validateQueryParams(requestSchemas.search, new URL(context.request.url));
    if (!validation.success) {
      return createBadRequestResponse('Invalid search parameters');
    }

    const { q, category, page, limit } = validation.data;
    const db = createD1Client(context.env);
    
    let query = QUERIES.TOOLS.SEARCH;
    const searchTerm = `%${q}%`;
    let params = [searchTerm, searchTerm];

    // Add category filter if specified
    if (category) {
      query = `
        SELECT t.*, tc.name as category_name, tc.icon as category_icon
        FROM tools t
        LEFT JOIN tool_categories tc ON t.category = tc.id
        WHERE t.is_active = 1 
        AND t.category = ?
        AND (t.name LIKE ? OR t.description LIKE ?)
        ORDER BY t.name ASC
      `;
      params = [category, searchTerm, searchTerm];
    }

    // Add pagination
    const offset = ((page || 1) - 1) * (limit || 20);
    query += ` LIMIT ${limit || 20} OFFSET ${offset}`;

    const tools = await db.getAll(query, params);

    // Get features for each tool
    for (const tool of tools) {
      const features = await db.getAll(QUERIES.TOOLS.GET_FEATURES, [tool.id]);
      tool.features = features;
    }

    return createSuccessResponse({
      tools,
      query: q,
      pagination: {
        page,
        limit,
        total: tools.length
      }
    }, context.request_id);
  } catch (error) {
    console.error('Search tools error:', error);
    return createBadRequestResponse('Failed to search tools');
  }
}

// GET /api/tools/:id/features - Get tool features
export async function getToolFeatures(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const toolId = url.pathname.split('/')[3]; // /api/tools/:id/features

    if (!toolId) {
      return createBadRequestResponse('Tool ID is required');
    }

    const db = createD1Client(context.env);
    const features = await db.getAll(QUERIES.TOOLS.GET_FEATURES, [toolId]);

    return createSuccessResponse(features, context.request_id);
  } catch (error) {
    console.error('Get tool features error:', error);
    return createBadRequestResponse('Failed to fetch tool features');
  }
}
