// User type definitions
export * from './subscription'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  isEmailVerified: boolean
  preferences: UserPreferences
  subscription: UserSubscription
  usage: UserUsage
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  browser: boolean
  marketing: boolean
  updates: boolean
  security: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  analyticsOptIn: boolean
  dataSharing: boolean
}

export interface UserSubscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  trialEnd?: Date
  customerId?: string
  subscriptionId?: string
}

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  TRIALING = 'trialing'
}

export interface UserUsage {
  id: string
  userId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  toolsUsed: number
  totalRequests: number
  storageUsed: number // in bytes
  quotas: UsageQuotas
  recentActivity: RecentActivity[]
}

export interface UsageQuotas {
  toolsPerMonth: number
  requestsPerMonth: number
  storageLimit: number // in bytes
  premiumFeatures: boolean
}

export interface RecentActivity {
  id: string
  userId: string
  toolId: string
  toolName: string
  action: ActivityAction
  timestamp: Date
  metadata?: Record<string, any>
}

export enum ActivityAction {
  TOOL_USED = 'tool_used',
  FILE_UPLOADED = 'file_uploaded',
  FILE_DOWNLOADED = 'file_downloaded',
  FAVORITE_ADDED = 'favorite_added',
  FAVORITE_REMOVED = 'favorite_removed',
  SUBSCRIPTION_CHANGED = 'subscription_changed'
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  subscription: {
    plan: SubscriptionPlan
    status: SubscriptionStatus
    isActive: boolean
    daysRemaining?: number
  }
  usage: {
    toolsUsed: number
    quotaUsed: number
    quotaLimit: number
    percentageUsed: number
  }
  stats: {
    totalToolsUsed: number
    favoriteTools: number
    joinedDate: Date
  }
}
