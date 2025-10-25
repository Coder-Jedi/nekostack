// Analytics API Service

import { apiClient } from '../client';
import { AnalyticsEvent } from '../types';

export const analyticsService = {
  trackConversion: async (toolId: string, metadata: Record<string, any>) => {
    try {
      await apiClient.post('analytics', '/api/analytics/track', {
        event_type: 'tool_conversion',
        tool_id: toolId,
        metadata
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      // Don't throw - analytics failures shouldn't break the user experience
    }
  },

  trackEvent: async (event: AnalyticsEvent) => {
    try {
      await apiClient.post('analytics', '/api/analytics/track', event);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      // Don't throw - analytics failures shouldn't break the user experience
    }
  }
};
