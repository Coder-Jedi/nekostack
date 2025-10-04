import { Analytics } from '@nekostack/types'

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
}

class AnalyticsService {
  private userId?: string
  private sessionId: string
  private isEnabled: boolean = true

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSession() {
    // Track session start
    this.track('session_start', {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      referrer: typeof window !== 'undefined' ? document.referrer : 'unknown'
    })
  }

  setUserId(userId: string) {
    this.userId = userId
    this.track('user_identified', { userId })
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    const analyticsData: Analytics = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        path: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date()
    }

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', analyticsData)
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(analyticsData)
    }
  }

  private async sendToAnalytics(data: Analytics) {
    try {
      // This would send to your analytics service (e.g., Cloudflare Analytics, Google Analytics, etc.)
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  // Tool-specific tracking methods
  toolUsed(toolId: string, toolName: string, metadata?: Record<string, any>) {
    this.track('tool_used', {
      toolId,
      toolName,
      ...metadata
    })
  }

  toolFavorited(toolId: string, toolName: string, action: 'added' | 'removed') {
    this.track('tool_favorited', {
      toolId,
      toolName,
      action
    })
  }

  searchPerformed(query: string, resultsCount: number, filters?: Record<string, any>) {
    this.track('search_performed', {
      query,
      resultsCount,
      filters
    })
  }

  pageViewed(pageName: string, metadata?: Record<string, any>) {
    this.track('page_viewed', {
      pageName,
      ...metadata
    })
  }

  buttonClicked(buttonName: string, location: string, metadata?: Record<string, any>) {
    this.track('button_clicked', {
      buttonName,
      location,
      ...metadata
    })
  }

  announcementInteraction(announcementId: string, action: 'viewed' | 'dismissed' | 'clicked') {
    this.track('announcement_interaction', {
      announcementId,
      action
    })
  }

  userAuthenticated(method: string) {
    this.track('user_authenticated', {
      method
    })
  }

  subscriptionEvent(action: string, plan: string, metadata?: Record<string, any>) {
    this.track('subscription_event', {
      action,
      plan,
      ...metadata
    })
  }

  // Performance tracking
  performanceMetric(metric: string, value: number, metadata?: Record<string, any>) {
    this.track('performance_metric', {
      metric,
      value,
      ...metadata
    })
  }

  // Error tracking
  errorOccurred(error: string, context?: string, metadata?: Record<string, any>) {
    this.track('error_occurred', {
      error,
      context,
      ...metadata
    })
  }

  // Feature usage tracking
  featureUsed(featureName: string, metadata?: Record<string, any>) {
    this.track('feature_used', {
      featureName,
      ...metadata
    })
  }

  // Disable analytics (for privacy compliance)
  disable() {
    this.isEnabled = false
    this.track('analytics_disabled')
  }

  // Enable analytics
  enable() {
    this.isEnabled = true
    this.track('analytics_enabled')
  }
}

// Create singleton instance
export const analytics = new AnalyticsService()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    toolUsed: analytics.toolUsed.bind(analytics),
    toolFavorited: analytics.toolFavorited.bind(analytics),
    searchPerformed: analytics.searchPerformed.bind(analytics),
    pageViewed: analytics.pageViewed.bind(analytics),
    buttonClicked: analytics.buttonClicked.bind(analytics),
    announcementInteraction: analytics.announcementInteraction.bind(analytics),
    performanceMetric: analytics.performanceMetric.bind(analytics),
    errorOccurred: analytics.errorOccurred.bind(analytics),
    featureUsed: analytics.featureUsed.bind(analytics)
  }
}
