// History API Service

import { apiClient } from '../client';
import { ConversionHistoryItem, ConversionHistoryResponse } from '../types';

export const historyService = {
  saveConversion: async (conversion: ConversionHistoryItem) => {
    try {
      await apiClient.post('gateway', '/api/user/conversion-history', conversion);
    } catch (error) {
      console.warn('History sync failed:', error);
      // Don't throw - history sync failures shouldn't break the user experience
    }
  },

  getHistory: async (limit: number = 50, offset: number = 0): Promise<ConversionHistoryItem[]> => {
    try {
      const response = await apiClient.get<ConversionHistoryResponse>(
        'gateway', 
        `/api/user/conversion-history?limit=${limit}&offset=${offset}`
      );
      return response.data.history;
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.status === 429) {
        console.warn('Rate limited - using cached history');
        // Return empty array for rate limited requests
        return [];
      }
      console.warn('Failed to fetch history:', error);
      return [];
    }
  },

  clearHistory: async (): Promise<boolean> => {
    try {
      await apiClient.delete('gateway', '/api/user/conversion-history');
      return true;
    } catch (error) {
      console.warn('Failed to clear history:', error);
      return false;
    }
  }
};
