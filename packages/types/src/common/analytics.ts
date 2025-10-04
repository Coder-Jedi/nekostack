// Analytics type definitions

export interface UserAnalytics {
  userId: string
  period: AnalyticsPeriod
  overview: AnalyticsOverview
  toolUsage: ToolUsageAnalytics[]
  timeSeriesData: TimeSeriesData[]
  topFiles: TopFileAnalytics[]
  performanceMetrics: PerformanceMetrics
  comparisonData: ComparisonData
  goals: AnalyticsGoal[]
}

export enum AnalyticsPeriod {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  LAST_YEAR = 'last_year',
  ALL_TIME = 'all_time'
}

export interface AnalyticsOverview {
  totalToolsUsed: number
  totalFilesProcessed: number
  totalStorageUsed: number
  totalTimeSaved: number // in minutes
  averageProcessingTime: number // in seconds
  successRate: number // percentage
  mostUsedTool: string
  peakUsageHour: number
}

export interface ToolUsageAnalytics {
  toolId: string
  toolName: string
  usageCount: number
  totalProcessingTime: number
  averageFileSize: number
  successRate: number
  lastUsed: Date
  trend: TrendDirection
  trendPercentage: number
}

export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable'
}

export interface TimeSeriesData {
  date: Date
  toolsUsed: number
  filesProcessed: number
  storageUsed: number
  processingTime: number
  errors: number
}

export interface TopFileAnalytics {
  fileName: string
  fileType: string
  fileSize: number
  toolUsed: string
  processedAt: Date
  processingTime: number
  downloadCount: number
}

export interface PerformanceMetrics {
  averageUploadSpeed: number // MB/s
  averageProcessingSpeed: number // files/minute
  errorRate: number // percentage
  uptimePercentage: number
  peakConcurrentUsers: number
  averageQueueTime: number // seconds
}

export interface ComparisonData {
  previousPeriod: AnalyticsOverview
  percentageChange: {
    toolsUsed: number
    filesProcessed: number
    storageUsed: number
    timeSaved: number
  }
}

export interface AnalyticsGoal {
  id: string
  name: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
  isCompleted: boolean
  progress: number // percentage
}

export interface AnalyticsExport {
  userId: string
  exportType: AnalyticsExportType
  period: AnalyticsPeriod
  format: AnalyticsExportFormat
  includeRawData: boolean
  createdAt: Date
  downloadUrl?: string
  status: AnalyticsExportStatus
}

export enum AnalyticsExportType {
  FULL_ANALYTICS = 'full_analytics',
  TOOL_USAGE = 'tool_usage',
  FILE_HISTORY = 'file_history',
  BILLING_DATA = 'billing_data'
}

export enum AnalyticsExportFormat {
  CSV = 'csv',
  JSON = 'json',
  PDF = 'pdf',
  XLSX = 'xlsx'
}

export enum AnalyticsExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
  fill?: boolean
  tension?: number
}

export interface ChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  plugins: {
    legend: {
      display: boolean
      position?: 'top' | 'bottom' | 'left' | 'right'
    }
    tooltip: {
      enabled: boolean
    }
  }
  scales?: {
    x?: {
      display: boolean
      grid?: {
        display: boolean
      }
    }
    y?: {
      display: boolean
      beginAtZero: boolean
      grid?: {
        display: boolean
      }
    }
  }
}
