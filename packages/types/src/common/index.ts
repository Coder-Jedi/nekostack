// Common type definitions
export * from './files'
export * from './onboarding'
export * from './cta'
export * from './analytics'
export * from './system-status'
export * from './export'
export * from './advertisement'

export interface Announcement {
  id: string
  title: string
  message: string
  type: AnnouncementType
  priority: AnnouncementPriority
  startDate: Date
  endDate?: Date
  isActive: boolean
  isDismissible: boolean
  targetAudience: TargetAudience
  actionButton?: AnnouncementAction
  createdAt: Date
  updatedAt: Date
}

export enum AnnouncementType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  UPDATE = 'update',
  MAINTENANCE = 'maintenance',
  FEATURE = 'feature',
  PROMOTION = 'promotion'
}

export enum AnnouncementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TargetAudience {
  ALL = 'all',
  FREE_USERS = 'free_users',
  PRO_USERS = 'pro_users',
  ENTERPRISE_USERS = 'enterprise_users',
  NEW_USERS = 'new_users',
  BETA_USERS = 'beta_users'
}

export interface AnnouncementAction {
  label: string
  url: string
  type: 'internal' | 'external'
}

export { 
  ServiceStatus,
  IncidentStatus,
  IncidentImpact,
  MaintenanceStatus,
  MaintenanceImpact,
  StatusPageTheme,
  StatusNotificationMethod
} from './system-status'

export type { 
  SystemStatus,
  ServiceStatusDetail,
  Incident,
  MaintenanceWindow,
  SystemMetrics,
  StatusSubscription,
  StatusPageConfig,
  HistoricalData
} from './system-status'

export interface CommonNotificationSettings {
  announcements: boolean
  systemStatus: boolean
  maintenanceAlerts: boolean
  featureUpdates: boolean
  promotions: boolean
  email: boolean
  browser: boolean
}

export interface Analytics {
  event: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp: Date
}