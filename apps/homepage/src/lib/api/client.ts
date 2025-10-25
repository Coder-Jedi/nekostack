// API Client for NekoStack services

interface ApiResponse<T> {
  success: boolean;
  data: T;
  request_id: string;
  error?: { code: string; message: string };
}

class ApiClient {
  private baseUrls = {
    tools: process.env.NEXT_PUBLIC_TOOLS_API_URL || 'https://api-tools.nekostack.com',
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'https://api-analytics.nekostack.com',
    gateway: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'https://api-gateway.nekostack.com'
  };

  async post<T>(service: 'tools' | 'analytics' | 'gateway', endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrls[service]}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API POST error (${service}${endpoint}):`, error);
      throw error;
    }
  }

  async get<T>(service: 'tools' | 'analytics' | 'gateway', endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrls[service]}${endpoint}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API GET error (${service}${endpoint}):`, error);
      throw error;
    }
  }

  async delete<T>(service: 'tools' | 'analytics' | 'gateway', endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrls[service]}${endpoint}`, {
        method: 'DELETE',
        headers: { 
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API DELETE error (${service}${endpoint}):`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
