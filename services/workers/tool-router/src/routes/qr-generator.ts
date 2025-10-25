// QR Code Generator API routes

import { RequestContext } from '../../../shared/src/types';
import { 
  createSuccessResponse, 
  createBadRequestResponse,
  createErrorResponse 
} from '../../../shared/src/utils/response';
import { validateBody, requestSchemas } from '../../../shared/src/utils/validation';

// POST /api/tools/qr-generator - Generate QR code
export async function generateQRCode(context: RequestContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const validation = validateBody(requestSchemas.qrGenerator, body);
    
    if (!validation.success) {
      return createBadRequestResponse('Invalid request data');
    }

    const { 
      text, 
      size = 200, 
      format = 'png', 
      errorCorrectionLevel = 'M',
      foregroundColor = '#000000',
      backgroundColor = '#FFFFFF',
      margin = 4
    } = validation.data;
    
    // Generate QR code
    const qrCodeData = await generateQRCodeData(text, {
      size,
      format,
      errorCorrectionLevel,
      foregroundColor,
      backgroundColor,
      margin
    });
    
    return createSuccessResponse({
      qrCode: {
        data: qrCodeData,
        format,
        size,
        text
      },
      metadata: {
        errorCorrectionLevel,
        foregroundColor,
        backgroundColor,
        margin,
        generatedAt: new Date().toISOString()
      }
    }, context.request_id);
  } catch (error) {
    console.error('QR generator error:', error);
    return createErrorResponse('QR code generation failed', 'QR_GENERATION_ERROR', 500, context.request_id);
  }
}

// POST /api/tools/qr-generator/bulk - Generate multiple QR codes
export async function generateBulkQRCodes(context: RequestContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const validation = validateBody(requestSchemas.bulkQrGenerator, body);
    
    if (!validation.success) {
      return createBadRequestResponse('Invalid request data');
    }

    const { texts, options = {} } = validation.data;
    
    if (texts.length > 100) {
      return createBadRequestResponse('Maximum 100 QR codes allowed per request');
    }
    
    const qrCodes = [];
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      if (!text) continue;
      
      try {
        const qrCodeData = await generateQRCodeData(text, {
          size: options?.size || 200,
          format: options?.format || 'png',
          errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
          foregroundColor: options?.foregroundColor || '#000000',
          backgroundColor: options?.backgroundColor || '#FFFFFF',
          margin: options?.margin || 4
        });
        qrCodes.push({
          index: i,
          text: text,
          qrCode: qrCodeData,
          success: true
        });
      } catch (error: any) {
        qrCodes.push({
          index: i,
          text: text,
          error: error.message || 'Unknown error',
          success: false
        });
      }
    }
    
    return createSuccessResponse({
      qrCodes,
      total: texts.length,
      successful: qrCodes.filter(qr => qr.success).length,
      failed: qrCodes.filter(qr => !qr.success).length
    }, context.request_id);
  } catch (error: any) {
    console.error('Bulk QR generator error:', error);
    return createErrorResponse('Bulk QR code generation failed', 'BULK_QR_ERROR', 500, context.request_id);
  }
}

// GET /api/tools/qr-generator/formats - Get supported formats
export async function getSupportedFormats(context: RequestContext): Promise<Response> {
  try {
    const formats = [
      {
        id: 'png',
        name: 'PNG',
        description: 'Portable Network Graphics',
        supportsTransparency: true,
        maxSize: 2048
      },
      {
        id: 'svg',
        name: 'SVG',
        description: 'Scalable Vector Graphics',
        supportsTransparency: true,
        maxSize: 4096
      },
      {
        id: 'jpeg',
        name: 'JPEG',
        description: 'Joint Photographic Experts Group',
        supportsTransparency: false,
        maxSize: 2048
      }
    ];

    return createSuccessResponse(formats, context.request_id);
  } catch (error) {
    console.error('Get formats error:', error);
    return createErrorResponse('Failed to fetch formats', 'FORMATS_ERROR', 500, context.request_id);
  }
}

// GET /api/tools/qr-generator/error-levels - Get error correction levels
export async function getErrorCorrectionLevels(context: RequestContext): Promise<Response> {
  try {
    const levels = [
      {
        id: 'L',
        name: 'Low',
        description: '~7% error correction',
        recommended: 'For simple, clean environments'
      },
      {
        id: 'M',
        name: 'Medium',
        description: '~15% error correction',
        recommended: 'Default choice for most applications'
      },
      {
        id: 'Q',
        name: 'Quartile',
        description: '~25% error correction',
        recommended: 'For noisy or damaged environments'
      },
      {
        id: 'H',
        name: 'High',
        description: '~30% error correction',
        recommended: 'Maximum error correction'
      }
    ];

    return createSuccessResponse(levels, context.request_id);
  } catch (error) {
    console.error('Get error levels error:', error);
    return createErrorResponse('Failed to fetch error levels', 'ERROR_LEVELS_ERROR', 500, context.request_id);
  }
}

// Helper function to generate QR code data
async function generateQRCodeData(
  text: string, 
  options: {
    size: number;
    format: string;
    errorCorrectionLevel: string;
    foregroundColor: string;
    backgroundColor: string;
    margin: number;
  }
): Promise<string> {
  // In production, this would use a real QR code library
  // For now, return a mock base64 encoded QR code
  
  const qrCodeConfig = {
    text,
    size: options.size,
    format: options.format,
    errorCorrectionLevel: options.errorCorrectionLevel,
    foregroundColor: options.foregroundColor,
    backgroundColor: options.backgroundColor,
    margin: options.margin
  };

  // Mock QR code generation
  const mockQRCode = generateMockQRCode(qrCodeConfig);
  
  return mockQRCode;
}

// Helper function to generate mock QR code
function generateMockQRCode(config: any): string {
  // This is a simplified mock - in production, use a real QR code library
  const { text, size, format, foregroundColor, backgroundColor } = config;
  
  // Generate a simple pattern that looks like a QR code
  switch (format) {
    case 'png':
      return createMockQRCodeData(text, size, foregroundColor, backgroundColor);
    case 'svg':
      return generateMockSVG(size, foregroundColor, backgroundColor);
    case 'pdf':
      return createMockQRCodeData(text, size, foregroundColor, backgroundColor);
    default:
      return createMockQRCodeData(text, size, foregroundColor, backgroundColor);
  }
}

// Helper function to create mock QR code data
function createMockQRCodeData(text: string, size: number, fgColor: string, bgColor: string): string {
  // This is a mock implementation for Cloudflare Workers
  // In production, use a real QR code library that works in Workers
  const mockPattern = generateMockQRPattern(text, size);
  
  // Create a simple base64 encoded mock QR code
  const mockData = {
    text,
    size,
    fgColor,
    bgColor,
    pattern: mockPattern,
    timestamp: new Date().toISOString()
  };
  
  return btoa(JSON.stringify(mockData));
}

// Generate a mock QR pattern
function generateMockQRPattern(text: string, size: number): string {
  // Create a simple pattern based on text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const pattern = [];
  for (let i = 0; i < size; i += 10) {
    for (let j = 0; j < size; j += 10) {
      if ((i + j + hash) % 20 === 0) {
        pattern.push(`${i},${j}`);
      }
    }
  }
  
  return pattern.join('|');
}

// Helper function to generate mock SVG
function generateMockSVG(size: number, fgColor: string, bgColor: string): string {
  const moduleSize = Math.floor(size / 25);
  let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="${bgColor}"/>`;
  
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      if ((i + j) % 3 === 0) {
        svg += `<rect x="${i * moduleSize}" y="${j * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${fgColor}"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
