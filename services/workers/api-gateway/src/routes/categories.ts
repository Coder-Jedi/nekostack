// Categories API routes

import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { QUERIES } from '../../../shared/src/database/queries';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createBadRequestResponse 
} from '../../../shared/src/utils/response';

// GET /api/categories - Get all categories
export async function getCategories(context: RequestContext): Promise<Response> {
  try {
    const db = createD1Client(context.env);
    const categories = await db.getAll(QUERIES.CATEGORIES.GET_ALL);

    return createSuccessResponse(categories, context.request_id);
  } catch (error) {
    console.error('Get categories error:', error);
    return createBadRequestResponse('Failed to fetch categories');
  }
}

// GET /api/categories/:id - Get category by ID
export async function getCategoryById(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const categoryId = url.pathname.split('/').pop();

    if (!categoryId) {
      return createBadRequestResponse('Category ID is required');
    }

    const db = createD1Client(context.env);
    const category = await db.get(QUERIES.CATEGORIES.GET_BY_ID, [categoryId]);

    if (!category) {
      return createNotFoundResponse('Category not found', context.request_id);
    }

    return createSuccessResponse(category, context.request_id);
  } catch (error) {
    console.error('Get category by ID error:', error);
    return createBadRequestResponse('Failed to fetch category');
  }
}

// GET /api/categories/:id/tools - Get tools in category
export async function getCategoryTools(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const categoryId = url.pathname.split('/')[3]; // /api/categories/:id/tools

    if (!categoryId) {
      return createBadRequestResponse('Category ID is required');
    }

    const db = createD1Client(context.env);
    
    // First check if category exists
    const category = await db.get(QUERIES.CATEGORIES.GET_BY_ID, [categoryId]);
    if (!category) {
      return createNotFoundResponse('Category not found', context.request_id);
    }

    // Get tools in category
    const tools = await db.getAll(QUERIES.TOOLS.GET_BY_CATEGORY, [categoryId]);

    // Get features for each tool
    for (const tool of tools) {
      const features = await db.getAll(QUERIES.TOOLS.GET_FEATURES, [tool.id]);
      tool.features = features;
    }

    return createSuccessResponse({
      category,
      tools,
      count: tools.length
    }, context.request_id);
  } catch (error) {
    console.error('Get category tools error:', error);
    return createBadRequestResponse('Failed to fetch category tools');
  }
}
