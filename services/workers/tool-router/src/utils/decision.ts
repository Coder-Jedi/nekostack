// Light vs heavy task decision logic

import { RequestContext } from '../../../shared/src/types';

export interface TaskDecision {
  isLight: boolean;
  reason: string;
  estimatedDuration?: number;
  requiresQueue?: boolean;
}

export interface TaskMetrics {
  complexity: 'low' | 'medium' | 'high';
  dataSize: number; // in bytes
  processingTime: number; // estimated in ms
  memoryUsage: number; // estimated in MB
}

// Task complexity thresholds
const THRESHOLDS = {
  MAX_LIGHT_DATA_SIZE: 1024 * 1024, // 1MB
  MAX_LIGHT_PROCESSING_TIME: 5000, // 5 seconds
  MAX_LIGHT_MEMORY_USAGE: 128, // 128MB
  MAX_LIGHT_COMPLEXITY: 'medium'
};

// Tool-specific configurations
const TOOL_CONFIGS = {
  'unit-converter': {
    isLight: true,
    maxDataSize: 1024, // 1KB
    maxProcessingTime: 100, // 100ms
    maxMemoryUsage: 16 // 16MB
  },
  'qr-generator': {
    isLight: true,
    maxDataSize: 1024 * 10, // 10KB
    maxProcessingTime: 1000, // 1 second
    maxMemoryUsage: 32 // 32MB
  },
  'markdown-converter': {
    isLight: false, // Complex styling and PDF conversion
    maxDataSize: 1024 * 1024 * 10, // 10MB
    maxProcessingTime: 30000, // 30 seconds
    maxMemoryUsage: 256 // 256MB
  },
  'image-compressor': {
    isLight: false, // Heavy image processing
    maxDataSize: 1024 * 1024 * 50, // 50MB
    maxProcessingTime: 60000, // 60 seconds
    maxMemoryUsage: 512 // 512MB
  },
  'signature-creator': {
    isLight: false, // Canvas rendering and image processing
    maxDataSize: 1024 * 1024 * 5, // 5MB
    maxProcessingTime: 10000, // 10 seconds
    maxMemoryUsage: 128 // 128MB
  },
  'resume-builder': {
    isLight: false, // PDF generation and template processing
    maxDataSize: 1024 * 1024 * 20, // 20MB
    maxProcessingTime: 45000, // 45 seconds
    maxMemoryUsage: 256 // 256MB
  },
  'ats-checker': {
    isLight: false, // AI/ML analysis
    maxDataSize: 1024 * 1024 * 10, // 10MB
    maxProcessingTime: 30000, // 30 seconds
    maxMemoryUsage: 512 // 512MB
  }
};

export function decideTaskType(
  toolId: string,
  requestData: any,
  context: RequestContext
): TaskDecision {
  try {
    // Get tool configuration
    const toolConfig = TOOL_CONFIGS[toolId as keyof typeof TOOL_CONFIGS];
    if (!toolConfig) {
      return {
        isLight: false,
        reason: 'Unknown tool - defaulting to heavy processing',
        requiresQueue: true
      };
    }

    // If tool is configured as light, check if it can be processed in Workers
    if (toolConfig.isLight) {
      const metrics = analyzeTaskMetrics(toolId, requestData);
      
      if (canProcessInWorker(metrics, toolConfig)) {
        return {
          isLight: true,
          reason: 'Tool configured for light processing and within limits',
          estimatedDuration: metrics.processingTime,
          requiresQueue: false
        };
      } else {
        return {
          isLight: false,
          reason: 'Exceeds light processing limits',
          estimatedDuration: metrics.processingTime,
          requiresQueue: true
        };
      }
    }

    // Tool is configured as heavy
    return {
      isLight: false,
      reason: 'Tool configured for heavy processing',
      estimatedDuration: toolConfig.maxProcessingTime,
      requiresQueue: true
    };
  } catch (error) {
    console.error('Task decision error:', error);
    return {
      isLight: false,
      reason: 'Error analyzing task - defaulting to heavy processing',
      requiresQueue: true
    };
  }
}

function analyzeTaskMetrics(toolId: string, requestData: any): TaskMetrics {
  // Analyze request data to estimate processing requirements
  const dataSize = estimateDataSize(requestData);
  const complexity = estimateComplexity(toolId, requestData);
  const processingTime = estimateProcessingTime(toolId, requestData, dataSize);
  const memoryUsage = estimateMemoryUsage(toolId, requestData, dataSize);

  return {
    complexity,
    dataSize,
    processingTime,
    memoryUsage
  };
}

function estimateDataSize(requestData: any): number {
  try {
    const jsonString = JSON.stringify(requestData);
    return new Blob([jsonString]).size;
  } catch (error) {
    return 0;
  }
}

function estimateComplexity(toolId: string, requestData: any): 'low' | 'medium' | 'high' {
  // Simple complexity estimation based on tool and data
  switch (toolId) {
    case 'unit-converter':
      return 'low';
    case 'qr-generator':
      return 'low';
    case 'markdown-converter':
      // Check if it's simple conversion or complex styling
      if (requestData?.options?.includeMath || requestData?.options?.includeCharts) {
        return 'high';
      }
      return 'medium';
    case 'image-compressor':
      // Check image size and compression level
      if (requestData?.imageSize > 1024 * 1024 * 10) { // 10MB
        return 'high';
      }
      return 'medium';
    default:
      return 'high';
  }
}

function estimateProcessingTime(toolId: string, requestData: any, dataSize: number): number {
  // Estimate processing time based on tool and data size
  const baseTime = {
    'unit-converter': 10,
    'qr-generator': 50,
    'markdown-converter': 1000,
    'image-compressor': 5000,
    'signature-creator': 2000,
    'resume-builder': 10000,
    'ats-checker': 15000
  }[toolId] || 10000;

  // Scale based on data size
  const sizeMultiplier = Math.min(dataSize / (1024 * 1024), 10); // Cap at 10x
  return Math.floor(baseTime * (1 + sizeMultiplier));
}

function estimateMemoryUsage(toolId: string, requestData: any, dataSize: number): number {
  // Estimate memory usage based on tool and data size
  const baseMemory = {
    'unit-converter': 16,
    'qr-generator': 32,
    'markdown-converter': 64,
    'image-compressor': 128,
    'signature-creator': 64,
    'resume-builder': 128,
    'ats-checker': 256
  }[toolId] || 128;

  // Scale based on data size
  const sizeMultiplier = Math.min(dataSize / (1024 * 1024), 5); // Cap at 5x
  return Math.floor(baseMemory * (1 + sizeMultiplier));
}

function canProcessInWorker(metrics: TaskMetrics, toolConfig: any): boolean {
  return (
    metrics.dataSize <= toolConfig.maxDataSize &&
    metrics.processingTime <= toolConfig.maxProcessingTime &&
    metrics.memoryUsage <= toolConfig.maxMemoryUsage &&
    ['low', 'medium'].includes(metrics.complexity)
  );
}

// Helper function to get tool configuration
export function getToolConfig(toolId: string) {
  return TOOL_CONFIGS[toolId as keyof typeof TOOL_CONFIGS] || null;
}

// Helper function to check if tool exists
export function isValidTool(toolId: string): boolean {
  return toolId in TOOL_CONFIGS;
}

// Helper function to get all light tools
export function getLightTools(): string[] {
  return Object.entries(TOOL_CONFIGS)
    .filter(([_, config]) => config.isLight)
    .map(([toolId, _]) => toolId);
}

// Helper function to get all heavy tools
export function getHeavyTools(): string[] {
  return Object.entries(TOOL_CONFIGS)
    .filter(([_, config]) => !config.isLight)
    .map(([toolId, _]) => toolId);
}
