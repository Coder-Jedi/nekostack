// System status monitoring type definitions

export interface SystemStatus {
  overall: ServiceStatus
  services: ServiceStatusDetail[]
  incidents: Incident[]
  maintenances: MaintenanceWindow[]
  metrics: SystemMetrics
  lastUpdated: Date
}

export enum ServiceStatus {
  OPERATIONAL = 'operational',
  DEGRADED = 'degraded',
  PARTIAL_OUTAGE = 'partial_outage',
  MAJOR_OUTAGE = 'major_outage',
  MAINTENANCE = 'maintenance'
}

export interface ServiceStatusDetail {
  id: string
  name: string
  description: string
  status: ServiceStatus
  uptime: number // percentage
  responseTime: number // milliseconds
  lastIncident?: Date
  dependencies?: string[]
  region?: string
}

export interface Incident {
  id: string
  title: string
  description: string
  status: IncidentStatus
  impact: IncidentImpact
  affectedServices: string[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  updates: IncidentUpdate[]
  estimatedResolution?: Date
}

export enum IncidentStatus {
  INVESTIGATING = 'investigating',
  IDENTIFIED = 'identified',
  MONITORING = 'monitoring',
  RESOLVED = 'resolved'
}

export enum IncidentImpact {
  MINOR = 'minor',
  MAJOR = 'major',
  CRITICAL = 'critical'
}

export interface IncidentUpdate {
  id: string
  message: string
  status: IncidentStatus
  createdAt: Date
  author: string
}

export interface MaintenanceWindow {
  id: string
  title: string
  description: string
  status: MaintenanceStatus
  affectedServices: string[]
  scheduledStart: Date
  scheduledEnd: Date
  actualStart?: Date
  actualEnd?: Date
  impact: MaintenanceImpact
  updates: MaintenanceUpdate[]
}

export enum MaintenanceStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MaintenanceImpact {
  NO_IMPACT = 'no_impact',
  MINOR_IMPACT = 'minor_impact',
  MAJOR_IMPACT = 'major_impact'
}

export interface MaintenanceUpdate {
  id: string
  message: string
  status: MaintenanceStatus
  createdAt: Date
  author: string
}

export interface SystemMetrics {
  uptime: UptimeMetrics
  performance: PerformanceMetrics
  usage: UsageMetrics
  errors: ErrorMetrics
}

export interface UptimeMetrics {
  last24Hours: number
  last7Days: number
  last30Days: number
  last90Days: number
  currentStreak: number // days
}

export interface PerformanceMetrics {
  averageResponseTime: number // milliseconds
  p95ResponseTime: number
  p99ResponseTime: number
  throughput: number // requests per second
  errorRate: number // percentage
}

export interface UsageMetrics {
  activeUsers: number
  totalRequests: number
  dataProcessed: number // bytes
  peakConcurrentUsers: number
  averageSessionDuration: number // minutes
}

export interface ErrorMetrics {
  total: number
  rate: number // percentage
  byType: Record<string, number>
  criticalErrors: number
  resolved: number
}

export interface StatusSubscription {
  id: string
  userId: string
  services: string[]
  notificationMethods: StatusNotificationMethod[]
  isActive: boolean
  createdAt: Date
}

export enum StatusNotificationMethod {
  EMAIL = 'email',
  SMS = 'sms',
  WEBHOOK = 'webhook',
  SLACK = 'slack',
  DISCORD = 'discord'
}

export interface StatusPageConfig {
  title: string
  description: string
  logo?: string
  customDomain?: string
  theme: StatusPageTheme
  showMetrics: boolean
  showIncidentHistory: boolean
  autoRefresh: boolean
  refreshInterval: number // seconds
}

export enum StatusPageTheme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
  CUSTOM = 'custom'
}

export interface HistoricalData {
  date: Date
  uptime: number
  responseTime: number
  incidents: number
  maintenances: number
}
