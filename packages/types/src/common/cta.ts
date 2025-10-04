// Call-to-Action banner type definitions

export interface CTABanner {
  id: string
  title: string
  subtitle?: string
  description: string
  type: CTAType
  priority: CTAPriority
  targetAudience: CTAAudience
  triggers: CTATrigger[]
  actions: CTAAction[]
  design: CTADesign
  isActive: boolean
  startDate: Date
  endDate?: Date
  impressionLimit?: number
  clickLimit?: number
  createdAt: Date
  updatedAt: Date
}

export enum CTAType {
  UPGRADE = 'upgrade',
  FEATURE_PROMOTION = 'feature_promotion',
  ONBOARDING = 'onboarding',
  FEEDBACK = 'feedback',
  SURVEY = 'survey',
  ANNOUNCEMENT = 'announcement',
  SEASONAL = 'seasonal',
  RETENTION = 'retention'
}

export enum CTAPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum CTAAudience {
  ALL = 'all',
  FREE_USERS = 'free_users',
  PRO_USERS = 'pro_users',
  ENTERPRISE_USERS = 'enterprise_users',
  NEW_USERS = 'new_users',
  INACTIVE_USERS = 'inactive_users',
  POWER_USERS = 'power_users'
}

export interface CTATrigger {
  type: CTATriggerType
  condition?: string
  value?: number
  delay?: number
}

export enum CTATriggerType {
  PAGE_LOAD = 'page_load',
  USAGE_LIMIT = 'usage_limit',
  TIME_BASED = 'time_based',
  USER_ACTION = 'user_action',
  FEATURE_USAGE = 'feature_usage',
  SUBSCRIPTION_STATUS = 'subscription_status'
}

export interface CTAAction {
  id: string
  label: string
  type: CTAActionType
  url?: string
  callback?: string
  isPrimary: boolean
  style?: CTAActionStyle
}

export enum CTAActionType {
  NAVIGATE = 'navigate',
  EXTERNAL_LINK = 'external_link',
  MODAL = 'modal',
  CALLBACK = 'callback',
  DISMISS = 'dismiss'
}

export enum CTAActionStyle {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  LINK = 'link'
}

export interface CTADesign {
  layout: CTALayout
  theme: CTATheme
  showIcon?: boolean
  icon?: string
  gradient?: boolean
  animation?: CTAAnimation
  position?: CTAPosition
}

export enum CTALayout {
  BANNER = 'banner',
  CARD = 'card',
  MODAL = 'modal',
  TOAST = 'toast',
  SIDEBAR = 'sidebar',
  INLINE = 'inline'
}

export enum CTATheme {
  DEFAULT = 'default',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  PREMIUM = 'premium',
  GRADIENT = 'gradient'
}

export enum CTAAnimation {
  NONE = 'none',
  FADE_IN = 'fade_in',
  SLIDE_IN = 'slide_in',
  BOUNCE = 'bounce',
  PULSE = 'pulse'
}

export enum CTAPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  FLOATING = 'floating'
}

export interface CTAInteraction {
  id: string
  ctaId: string
  userId: string
  action: CTAInteractionType
  timestamp: Date
  metadata?: Record<string, any>
}

export enum CTAInteractionType {
  VIEWED = 'viewed',
  CLICKED = 'clicked',
  DISMISSED = 'dismissed',
  CONVERTED = 'converted'
}

export interface CTAAnalytics {
  ctaId: string
  impressions: number
  clicks: number
  conversions: number
  dismissals: number
  ctr: number // Click-through rate
  conversionRate: number
  lastUpdated: Date
}
