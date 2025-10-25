// Markdown Converter API routes

import { RequestContext } from '../../../shared/src/types';
import { 
  createSuccessResponse, 
  createBadRequestResponse,
  createErrorResponse 
} from '../../../shared/src/utils/response';
import { validateBody, requestSchemas } from '../../../shared/src/utils/validation';
import { decideTaskType } from '../utils/decision';
import { createQueueClient } from '../utils/queue';

// POST /api/tools/markdown-converter - Convert markdown
export async function convertMarkdown(context: RequestContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const validation = validateBody(requestSchemas.markdownConverter, body);
    
    if (!validation.success) {
      return createBadRequestResponse('Invalid request data');
    }

    const { 
      markdown, 
      outputFormat, 
      options = {} 
    } = validation.data;
    
    // Decide if this is a light or heavy task
    const decision = decideTaskType('markdown-converter', body, context);
    
    if (decision.isLight) {
      // Process in Worker
      return await processMarkdownInWorker(markdown, outputFormat, options, context);
    } else {
      // Queue for heavy processing
      return await queueMarkdownProcessing(markdown, outputFormat, options, context);
    }
  } catch (error) {
    console.error('Markdown converter error:', error);
    return createErrorResponse('Markdown conversion failed', 'MARKDOWN_ERROR', 500, context.request_id);
  }
}

// Process markdown in Worker (light processing)
async function processMarkdownInWorker(
  markdown: string, 
  outputFormat: string, 
  options: any, 
  context: RequestContext
): Promise<Response> {
  try {
    let result: string;
    
    switch (outputFormat) {
      case 'html':
        result = await convertMarkdownToHTML(markdown, options);
        break;
      case 'text':
        result = await convertMarkdownToText(markdown, options);
        break;
      default:
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }
    
    return createSuccessResponse({
      output: result,
      format: outputFormat,
      metadata: {
        inputLength: markdown.length,
        outputLength: result.length,
        processedAt: new Date().toISOString(),
        processingMethod: 'worker'
      }
    }, context.request_id);
  } catch (error) {
    console.error('Worker markdown processing error:', error);
    return createErrorResponse('Markdown processing failed', 'PROCESSING_ERROR', 500, context.request_id);
  }
}

// Queue markdown for heavy processing
async function queueMarkdownProcessing(
  markdown: string, 
  outputFormat: string, 
  options: any, 
  context: RequestContext
): Promise<Response> {
  try {
    const queue = createQueueClient(context.env);
    
    const job = {
      toolId: 'markdown-converter',
      userId: context.user_id || 'anonymous',
      data: {
        markdown,
        outputFormat,
        options
      },
      priority: 'normal' as const,
      estimatedDuration: 10000, // 10 seconds
      metadata: {
        inputLength: markdown.length,
        requestedAt: new Date().toISOString()
      }
    };
    
    const queueResponse = await queue.submitJob(job);
    
    return createSuccessResponse({
      jobId: queueResponse.jobId,
      status: queueResponse.status,
      estimatedWaitTime: queueResponse.estimatedWaitTime,
      message: 'Markdown conversion queued for processing',
      metadata: {
        inputLength: markdown.length,
        outputFormat,
        queuedAt: new Date().toISOString(),
        processingMethod: 'queue'
      }
    }, context.request_id);
  } catch (error) {
    console.error('Queue markdown processing error:', error);
    return createErrorResponse('Failed to queue markdown processing', 'QUEUE_ERROR', 500, context.request_id);
  }
}

// GET /api/tools/markdown-converter/job/:jobId - Get job status
export async function getMarkdownJobStatus(context: RequestContext): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const jobId = url.pathname.split('/').pop();
    
    if (!jobId) {
      return createBadRequestResponse('Job ID is required');
    }
    
    const queue = createQueueClient(context.env);
    const status = await queue.getJobStatus(jobId);
    
    if (status.status === 'completed') {
      const result = await queue.getJobResult(jobId);
      return createSuccessResponse({
        jobId,
        status: status.status,
        result: result.output,
        metadata: result.metadata
      }, context.request_id);
    }
    
    return createSuccessResponse({
      jobId,
      status: status.status,
      estimatedWaitTime: status.estimatedWaitTime,
      error: status.error
    }, context.request_id);
  } catch (error) {
    console.error('Get job status error:', error);
    return createErrorResponse('Failed to get job status', 'STATUS_ERROR', 500, context.request_id);
  }
}

// GET /api/tools/markdown-converter/formats - Get supported formats
export async function getSupportedFormats(context: RequestContext): Promise<Response> {
  try {
    const formats = [
      {
        id: 'html',
        name: 'HTML',
        description: 'HyperText Markup Language',
        supportsMath: true,
        supportsCharts: true,
        supportsTables: true,
        processingType: 'light'
      },
      {
        id: 'text',
        name: 'Plain Text',
        description: 'Plain text without formatting',
        supportsMath: false,
        supportsCharts: false,
        supportsTables: true,
        processingType: 'light'
      },
      {
        id: 'pdf',
        name: 'PDF',
        description: 'Portable Document Format',
        supportsMath: true,
        supportsCharts: true,
        supportsTables: true,
        processingType: 'heavy'
      },
      {
        id: 'docx',
        name: 'Word Document',
        description: 'Microsoft Word document',
        supportsMath: true,
        supportsCharts: true,
        supportsTables: true,
        processingType: 'heavy'
      }
    ];

    return createSuccessResponse(formats, context.request_id);
  } catch (error) {
    console.error('Get formats error:', error);
    return createErrorResponse('Failed to fetch formats', 'FORMATS_ERROR', 500, context.request_id);
  }
}

// Helper function to convert markdown to HTML
async function convertMarkdownToHTML(markdown: string, options: any): Promise<string> {
  // Simple markdown to HTML conversion
  // In production, use a proper markdown library like marked or remark
  
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]*)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n/gim, '<br>');
  
  // Wrap in basic HTML structure
  html = `<div class="markdown-content">${html}</div>`;
  
  return html;
}

// Helper function to convert markdown to text
async function convertMarkdownToText(markdown: string, options: any): Promise<string> {
  // Simple markdown to text conversion
  // Remove markdown syntax and return plain text
  
  let text = markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]*)`/g, '$1')
    // Remove links (keep text)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
  
  return text;
}
