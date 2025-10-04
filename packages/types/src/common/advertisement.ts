// Advertisement system type definitions

export interface Advertisement {
  id: string
  title: string
  description?: string
  imageUrl?: string
  clickUrl: string
  type: AdType
  format: AdFormat
  placement: AdPlacement
  priority: number
  targeting: AdTargeting
  schedule: AdSchedule
  isActive: boolean
  impressions: number
  clicks: number
  budget: AdBudget
  createdAt: Date
  updatedAt: Date
}

export enum AdType {
  DISPLAY = 'display',
  TEXT = 'text',
  NATIVE = 'native',
  SPONSORED = 'sponsored',
  BANNER = 'banner'
}

export enum AdFormat {
  RECTANGLE = 'rectangle', // 300x250
  LEADERBOARD = 'leaderboard', // 728x90
  SKYSCRAPER = 'skyscraper', // 160x600
  SQUARE = 'square', // 250x250
  MOBILE_BANNER = 'mobile_banner', // 320x50
  RESPONSIVE = 'responsive'
}

export enum AdPlacement {
  SIDEBAR_TOP = 'sidebar_top',
  SIDEBAR_BOTTOM = 'sidebar_bottom',
  CONTENT_TOP = 'content_top',
  CONTENT_BOTTOM = 'content_bottom',
  BETWEEN_CONTENT = 'between_content',
  FOOTER = 'footer',
  HEADER = 'header'
}

export interface AdTargeting {
  countries?: string[]
  languages?: string[]
  userPlans?: string[] // ['free', 'pro', 'enterprise']
  devices?: ('desktop' | 'mobile' | 'tablet')[]
  interests?: string[]
  excludeSubscribers?: boolean
}

export interface AdSchedule {
  startDate: Date
  endDate?: Date
  daysOfWeek?: number[] // 0-6, Sunday-Saturday
  hoursOfDay?: number[] // 0-23
  timezone?: string
}

export interface AdBudget {
  totalBudget: number
  spentBudget: number
  costPerClick: number
  costPerImpression: number
  currency: string
}

export interface AdZone {
  id: string
  name: string
  placement: AdPlacement
  format: AdFormat
  isActive: boolean
  currentAd?: Advertisement
  fallbackContent?: string
  refreshInterval?: number // seconds
  maxAdsPerSession?: number
}

export interface AdImpression {
  id: string
  adId: string
  userId?: string
  sessionId: string
  timestamp: Date
  placement: AdPlacement
  device: string
  country?: string
  referrer?: string
}

export interface AdClick {
  id: string
  adId: string
  impressionId: string
  userId?: string
  sessionId: string
  timestamp: Date
  placement: AdPlacement
}

export interface AdPerformance {
  adId: string
  period: 'day' | 'week' | 'month'
  impressions: number
  clicks: number
  ctr: number // Click-through rate
  conversions: number
  conversionRate: number
  revenue: number
  cost: number
  roi: number
}

export interface UserAdPreferences {
  userId: string
  hideAds: boolean // For premium users
  adPersonalization: boolean
  viewedAds: string[]
  clickedAds: string[]
  dismissedAds: string[]
  lastAdView?: Date
}

export const AD_REFRESH_INTERVALS = {
  NEVER: 0,
  SLOW: 60, // 1 minute
  MEDIUM: 30, // 30 seconds
  FAST: 15 // 15 seconds
} as const

export const AD_SIZES: Record<AdFormat, { width: number; height: number }> = {
  [AdFormat.RECTANGLE]: { width: 300, height: 250 },
  [AdFormat.LEADERBOARD]: { width: 728, height: 90 },
  [AdFormat.SKYSCRAPER]: { width: 160, height: 600 },
  [AdFormat.SQUARE]: { width: 250, height: 250 },
  [AdFormat.MOBILE_BANNER]: { width: 320, height: 50 },
  [AdFormat.RESPONSIVE]: { width: 0, height: 0 } // Flexible
}
