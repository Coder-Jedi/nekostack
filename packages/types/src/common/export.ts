// Data export and backup type definitions

export interface DataExport {
  id: string
  userId: string
  type: ExportType
  format: ExportFormat
  status: ExportStatus
  progress: number // percentage
  fileSize?: number // bytes
  downloadUrl?: string
  expiresAt?: Date
  createdAt: Date
  completedAt?: Date
  error?: string
  metadata: ExportMetadata
}

export enum ExportType {
  FULL_ACCOUNT = 'full_account',
  USER_DATA = 'user_data',
  FILES_ONLY = 'files_only',
  ANALYTICS_DATA = 'analytics_data',
  BILLING_DATA = 'billing_data',
  TOOL_USAGE = 'tool_usage',
  FAVORITES = 'favorites',
  SETTINGS = 'settings'
}

export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  ZIP = 'zip',
  PDF = 'pdf',
  XLSX = 'xlsx'
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface ExportMetadata {
  includeFiles: boolean
  includeAnalytics: boolean
  includeBilling: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  fileTypes?: string[]
  toolIds?: string[]
  compression?: boolean
  encryption?: boolean
}

export interface ExportRequest {
  type: ExportType
  format: ExportFormat
  metadata: ExportMetadata
  notifyOnCompletion: boolean
  notificationMethods: NotificationMethod[]
}

export enum NotificationMethod {
  EMAIL = 'email',
  IN_APP = 'in_app',
  WEBHOOK = 'webhook'
}

export interface BackupSchedule {
  id: string
  userId: string
  name: string
  description?: string
  type: ExportType
  format: ExportFormat
  frequency: BackupFrequency
  isActive: boolean
  nextRun: Date
  lastRun?: Date
  retentionDays: number
  metadata: ExportMetadata
  createdAt: Date
  updatedAt: Date
}

export enum BackupFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export interface BackupHistory {
  id: string
  scheduleId: string
  exportId: string
  status: ExportStatus
  fileSize: number
  createdAt: Date
  downloadUrl?: string
  expiresAt: Date
}

export interface DataImport {
  id: string
  userId: string
  type: ImportType
  format: ExportFormat
  status: ImportStatus
  progress: number
  fileName: string
  fileSize: number
  createdAt: Date
  completedAt?: Date
  error?: string
  summary?: ImportSummary
}

export enum ImportType {
  FULL_RESTORE = 'full_restore',
  PARTIAL_RESTORE = 'partial_restore',
  MERGE_DATA = 'merge_data'
}

export enum ImportStatus {
  PENDING = 'pending',
  VALIDATING = 'validating',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface ImportSummary {
  totalRecords: number
  importedRecords: number
  skippedRecords: number
  errorRecords: number
  warnings: string[]
  errors: string[]
}

export interface ExportTemplate {
  id: string
  name: string
  description: string
  type: ExportType
  format: ExportFormat
  metadata: ExportMetadata
  isDefault: boolean
  isPublic: boolean
  createdBy: string
  usageCount: number
  createdAt: Date
}

export interface ExportQuota {
  userId: string
  plan: string
  limits: {
    maxExportsPerMonth: number
    maxFileSizePerExport: number // bytes
    maxRetentionDays: number
    allowedFormats: ExportFormat[]
    allowedTypes: ExportType[]
  }
  usage: {
    exportsThisMonth: number
    totalDataExported: number // bytes
    lastExportDate?: Date
  }
  resetDate: Date
}
