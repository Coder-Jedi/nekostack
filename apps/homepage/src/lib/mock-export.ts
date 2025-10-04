import { 
  DataExport, 
  ExportType, 
  ExportFormat, 
  ExportStatus,
  BackupSchedule,
  BackupFrequency,
  BackupHistory,
  ExportTemplate,
  ExportQuota,
  NotificationMethod
} from '@nekostack/types'

export const mockExports: DataExport[] = [
  {
    id: 'export-001',
    userId: 'user-1',
    type: ExportType.FULL_ACCOUNT,
    format: ExportFormat.ZIP,
    status: ExportStatus.COMPLETED,
    progress: 100,
    fileSize: 15728640, // ~15MB
    downloadUrl: '/api/exports/export-001/download',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30), // 2 days ago + 30 minutes
    metadata: {
      includeFiles: true,
      includeAnalytics: true,
      includeBilling: true,
      compression: true,
      encryption: false
    }
  },
  {
    id: 'export-002',
    userId: 'user-1',
    type: ExportType.ANALYTICS_DATA,
    format: ExportFormat.CSV,
    status: ExportStatus.PROCESSING,
    progress: 65,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    metadata: {
      includeFiles: false,
      includeAnalytics: true,
      includeBilling: false,
      dateRange: {
        start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
        end: new Date()
      }
    }
  },
  {
    id: 'export-003',
    userId: 'user-1',
    type: ExportType.FILES_ONLY,
    format: ExportFormat.ZIP,
    status: ExportStatus.FAILED,
    progress: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    error: 'Storage quota exceeded. Please upgrade your plan or delete some files.',
    metadata: {
      includeFiles: true,
      includeAnalytics: false,
      includeBilling: false,
      fileTypes: ['image/jpeg', 'image/png', 'application/pdf']
    }
  }
]

export const mockBackupSchedules: BackupSchedule[] = [
  {
    id: 'schedule-001',
    userId: 'user-1',
    name: 'Weekly Full Backup',
    description: 'Complete backup of all account data every week',
    type: ExportType.FULL_ACCOUNT,
    format: ExportFormat.ZIP,
    frequency: BackupFrequency.WEEKLY,
    isActive: true,
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    retentionDays: 30,
    metadata: {
      includeFiles: true,
      includeAnalytics: true,
      includeBilling: true,
      compression: true,
      encryption: true
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4)
  },
  {
    id: 'schedule-002',
    userId: 'user-1',
    name: 'Monthly Analytics Export',
    description: 'Export analytics data for monthly reporting',
    type: ExportType.ANALYTICS_DATA,
    format: ExportFormat.XLSX,
    frequency: BackupFrequency.MONTHLY,
    isActive: true,
    nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
    lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    retentionDays: 90,
    metadata: {
      includeFiles: false,
      includeAnalytics: true,
      includeBilling: false
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15)
  }
]

export const mockBackupHistory: BackupHistory[] = [
  {
    id: 'backup-001',
    scheduleId: 'schedule-001',
    exportId: 'export-001',
    status: ExportStatus.COMPLETED,
    fileSize: 15728640,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    downloadUrl: '/api/backups/backup-001/download',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 26) // 26 days from now
  },
  {
    id: 'backup-002',
    scheduleId: 'schedule-001',
    exportId: 'export-004',
    status: ExportStatus.COMPLETED,
    fileSize: 14680064,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
    downloadUrl: '/api/backups/backup-002/download',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 19) // 19 days from now
  }
]

export const mockExportTemplates: ExportTemplate[] = [
  {
    id: 'template-001',
    name: 'Complete Account Export',
    description: 'Export all account data including files, analytics, and billing information',
    type: ExportType.FULL_ACCOUNT,
    format: ExportFormat.ZIP,
    metadata: {
      includeFiles: true,
      includeAnalytics: true,
      includeBilling: true,
      compression: true,
      encryption: true
    },
    isDefault: true,
    isPublic: true,
    createdBy: 'system',
    usageCount: 1247,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
  },
  {
    id: 'template-002',
    name: 'Files Only Export',
    description: 'Export only processed files without metadata',
    type: ExportType.FILES_ONLY,
    format: ExportFormat.ZIP,
    metadata: {
      includeFiles: true,
      includeAnalytics: false,
      includeBilling: false,
      compression: true
    },
    isDefault: false,
    isPublic: true,
    createdBy: 'system',
    usageCount: 892,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
  },
  {
    id: 'template-003',
    name: 'Analytics Report',
    description: 'Export usage analytics and performance data',
    type: ExportType.ANALYTICS_DATA,
    format: ExportFormat.XLSX,
    metadata: {
      includeFiles: false,
      includeAnalytics: true,
      includeBilling: false,
      dateRange: {
        start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        end: new Date()
      }
    },
    isDefault: false,
    isPublic: true,
    createdBy: 'system',
    usageCount: 456,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45)
  }
]

export const mockExportQuota: ExportQuota = {
  userId: 'user-1',
  plan: 'pro',
  limits: {
    maxExportsPerMonth: 10,
    maxFileSizePerExport: 1073741824, // 1GB
    maxRetentionDays: 30,
    allowedFormats: [ExportFormat.JSON, ExportFormat.CSV, ExportFormat.ZIP, ExportFormat.XLSX],
    allowedTypes: [
      ExportType.FULL_ACCOUNT,
      ExportType.USER_DATA,
      ExportType.FILES_ONLY,
      ExportType.ANALYTICS_DATA,
      ExportType.BILLING_DATA,
      ExportType.TOOL_USAGE,
      ExportType.FAVORITES
    ]
  },
  usage: {
    exportsThisMonth: 3,
    totalDataExported: 45875200, // ~44MB
    lastExportDate: new Date(Date.now() - 1000 * 60 * 30)
  },
  resetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15) // 15 days from now
}

export const getExportStatusColor = (status: ExportStatus): string => {
  switch (status) {
    case ExportStatus.COMPLETED:
      return 'text-green-600 dark:text-green-400'
    case ExportStatus.PROCESSING:
      return 'text-blue-600 dark:text-blue-400'
    case ExportStatus.PENDING:
      return 'text-yellow-600 dark:text-yellow-400'
    case ExportStatus.FAILED:
      return 'text-red-600 dark:text-red-400'
    case ExportStatus.EXPIRED:
      return 'text-muted-foreground'
    case ExportStatus.CANCELLED:
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}

export const getExportStatusBgColor = (status: ExportStatus): string => {
  switch (status) {
    case ExportStatus.COMPLETED:
      return 'bg-green-100 dark:bg-green-900/30'
    case ExportStatus.PROCESSING:
      return 'bg-blue-100 dark:bg-blue-900/30'
    case ExportStatus.PENDING:
      return 'bg-yellow-100 dark:bg-yellow-900/30'
    case ExportStatus.FAILED:
      return 'bg-red-100 dark:bg-red-900/30'
    case ExportStatus.EXPIRED:
      return 'bg-muted'
    case ExportStatus.CANCELLED:
      return 'bg-muted'
    default:
      return 'bg-muted'
  }
}

export const getExportTypeIcon = (type: ExportType): string => {
  switch (type) {
    case ExportType.FULL_ACCOUNT:
      return '📦'
    case ExportType.USER_DATA:
      return '👤'
    case ExportType.FILES_ONLY:
      return '📁'
    case ExportType.ANALYTICS_DATA:
      return '📊'
    case ExportType.BILLING_DATA:
      return '💳'
    case ExportType.TOOL_USAGE:
      return '🔧'
    case ExportType.FAVORITES:
      return '⭐'
    case ExportType.SETTINGS:
      return '⚙️'
    default:
      return '📄'
  }
}

export const getFormatIcon = (format: ExportFormat): string => {
  switch (format) {
    case ExportFormat.JSON:
      return '{ }'
    case ExportFormat.CSV:
      return '📈'
    case ExportFormat.ZIP:
      return '🗜️'
    case ExportFormat.PDF:
      return '📄'
    case ExportFormat.XLSX:
      return '📊'
    default:
      return '📄'
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const getExportTypeDescription = (type: ExportType): string => {
  switch (type) {
    case ExportType.FULL_ACCOUNT:
      return 'Complete account data including files, analytics, billing, and settings'
    case ExportType.USER_DATA:
      return 'User profile, preferences, and account information'
    case ExportType.FILES_ONLY:
      return 'All processed files and their metadata'
    case ExportType.ANALYTICS_DATA:
      return 'Usage statistics, performance metrics, and analytics data'
    case ExportType.BILLING_DATA:
      return 'Billing history, invoices, and subscription information'
    case ExportType.TOOL_USAGE:
      return 'Tool usage history and performance data'
    case ExportType.FAVORITES:
      return 'Favorite tools and bookmarked items'
    case ExportType.SETTINGS:
      return 'Account settings and preferences'
    default:
      return 'Data export'
  }
}

export const getFrequencyDescription = (frequency: BackupFrequency): string => {
  switch (frequency) {
    case BackupFrequency.DAILY:
      return 'Every day'
    case BackupFrequency.WEEKLY:
      return 'Every week'
    case BackupFrequency.MONTHLY:
      return 'Every month'
    case BackupFrequency.QUARTERLY:
      return 'Every 3 months'
    case BackupFrequency.YEARLY:
      return 'Every year'
    default:
      return 'Custom schedule'
  }
}
