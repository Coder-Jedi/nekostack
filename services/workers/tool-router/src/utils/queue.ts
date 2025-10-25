// Oracle queue integration for heavy tasks

import { RequestContext } from '../../../shared/src/types';

export interface QueueJob {
  id: string;
  toolId: string;
  userId?: string;
  data: any;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  estimatedDuration: number;
  metadata?: Record<string, any>;
}

export interface QueueResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  estimatedWaitTime?: number;
  resultUrl?: string;
  error?: string;
}

export class OracleQueueClient {
  private queueUrl: string;
  private apiKey: string;

  constructor(queueUrl: string, apiKey: string) {
    this.queueUrl = queueUrl;
    this.apiKey = apiKey;
  }

  // Submit job to queue
  async submitJob(job: Omit<QueueJob, 'id' | 'createdAt'>): Promise<QueueResponse> {
    try {
      const jobId = generateJobId();
      const fullJob: QueueJob = {
        ...job,
        id: jobId,
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${this.queueUrl}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Request-ID': jobId
        },
        body: JSON.stringify(fullJob)
      });

      if (!response.ok) {
        throw new Error(`Queue submission failed: ${response.status} ${response.statusText}`);
      }

      const result: any = await response.json();
      return {
        jobId: result.jobId || jobId,
        status: result.status || 'queued',
        estimatedWaitTime: result.estimatedWaitTime,
        resultUrl: result.resultUrl
      };
    } catch (error: any) {
      console.error('Queue submission error:', error);
      throw new Error(`Failed to submit job to queue: ${error.message || 'Unknown error'}`);
    }
  }

  // Get job status
  async getJobStatus(jobId: string): Promise<QueueResponse> {
    try {
      const response = await fetch(`${this.queueUrl}/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Job not found');
        }
        throw new Error(`Failed to get job status: ${response.status} ${response.statusText}`);
      }

      const result: any = await response.json();
      return {
        jobId: result.jobId || jobId,
        status: result.status || 'unknown',
        estimatedWaitTime: result.estimatedWaitTime,
        resultUrl: result.resultUrl,
        error: result.error
      };
    } catch (error: any) {
      console.error('Get job status error:', error);
      throw new Error(`Failed to get job status: ${error.message || 'Unknown error'}`);
    }
  }

  // Get job result
  async getJobResult(jobId: string): Promise<any> {
    try {
      const response = await fetch(`${this.queueUrl}/jobs/${jobId}/result`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get job result: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get job result error:', error);
      throw new Error(`Failed to get job result: ${error.message || 'Unknown error'}`);
    }
  }

  // Cancel job
  async cancelJob(jobId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.queueUrl}/jobs/${jobId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Cancel job error:', error);
      return false;
    }
  }

  // Get queue status
  async getQueueStatus(): Promise<{
    totalJobs: number;
    processingJobs: number;
    queuedJobs: number;
    averageWaitTime: number;
  }> {
    try {
      const response = await fetch(`${this.queueUrl}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get queue status: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Get queue status error:', error);
      throw new Error(`Failed to get queue status: ${error.message || 'Unknown error'}`);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.queueUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Queue health check error:', error);
      return false;
    }
  }
}

// Helper function to create queue client
export function createQueueClient(env: any): OracleQueueClient {
  const queueUrl = env.ORACLE_QUEUE_URL;
  const apiKey = env.ORACLE_API_KEY;

  if (!queueUrl || !apiKey) {
    throw new Error('Oracle queue URL and API key are required');
  }

  return new OracleQueueClient(queueUrl, apiKey);
}

// Helper function to generate job ID
function generateJobId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `job_${timestamp}_${random}`;
}

// Helper function to determine job priority
export function determineJobPriority(
  toolId: string,
  userId?: string,
  isPremium?: boolean
): 'low' | 'normal' | 'high' | 'urgent' {
  // Premium users get higher priority
  if (isPremium) {
    return 'high';
  }

  // Critical tools get higher priority
  const criticalTools = ['ats-checker', 'resume-builder'];
  if (criticalTools.includes(toolId)) {
    return 'high';
  }

  // Default priority
  return 'normal';
}

// Helper function to estimate wait time
export function estimateWaitTime(
  queueStatus: any,
  jobPriority: string,
  estimatedDuration: number
): number {
  const baseWaitTime = queueStatus.averageWaitTime || 0;
  const priorityMultiplier = {
    'low': 1.5,
    'normal': 1.0,
    'high': 0.5,
    'urgent': 0.25
  }[jobPriority] || 1.0;

  return Math.floor(baseWaitTime * priorityMultiplier + estimatedDuration);
}
