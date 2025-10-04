import { 
  UserAnalytics, 
  AnalyticsPeriod, 
  AnalyticsOverview,
  ToolUsageAnalytics,
  TimeSeriesData,
  TopFileAnalytics,
  PerformanceMetrics,
  ComparisonData,
  AnalyticsGoal,
  TrendDirection,
  ChartData,
  ChartDataset
} from '@nekostack/types'

export const mockAnalyticsData: UserAnalytics = {
  userId: 'user-1',
  period: AnalyticsPeriod.LAST_30_DAYS,
  overview: {
    totalToolsUsed: 127,
    totalFilesProcessed: 89,
    totalStorageUsed: 15728640, // ~15MB
    totalTimeSaved: 340, // minutes
    averageProcessingTime: 2.3, // seconds
    successRate: 97.8, // percentage
    mostUsedTool: 'Image Compressor',
    peakUsageHour: 14 // 2 PM
  },
  toolUsage: [
    {
      toolId: 'image-compressor',
      toolName: 'Image Compressor',
      usageCount: 34,
      totalProcessingTime: 78.5,
      averageFileSize: 2048000, // ~2MB
      successRate: 98.5,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      trend: TrendDirection.UP,
      trendPercentage: 15.3
    },
    {
      toolId: 'qr-generator',
      toolName: 'QR Generator',
      usageCount: 28,
      totalProcessingTime: 14.2,
      averageFileSize: 15360, // ~15KB
      successRate: 100,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      trend: TrendDirection.UP,
      trendPercentage: 8.7
    },
    {
      toolId: 'markdown-editor',
      toolName: 'Markdown Editor',
      usageCount: 22,
      totalProcessingTime: 156.8,
      averageFileSize: 51200, // ~50KB
      successRate: 95.5,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      trend: TrendDirection.STABLE,
      trendPercentage: 2.1
    },
    {
      toolId: 'unit-converter',
      toolName: 'Unit Converter',
      usageCount: 18,
      totalProcessingTime: 9.1,
      averageFileSize: 0, // No file processing
      successRate: 100,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
      trend: TrendDirection.DOWN,
      trendPercentage: -5.2
    },
    {
      toolId: 'signature-creator',
      toolName: 'Signature Creator',
      usageCount: 15,
      totalProcessingTime: 45.3,
      averageFileSize: 8192, // ~8KB
      successRate: 96.7,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      trend: TrendDirection.UP,
      trendPercentage: 12.5
    },
    {
      toolId: 'resume-builder',
      toolName: 'Resume Builder',
      usageCount: 8,
      totalProcessingTime: 124.7,
      averageFileSize: 524288, // ~512KB
      successRate: 100,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      trend: TrendDirection.STABLE,
      trendPercentage: 0.8
    },
    {
      toolId: 'ats-checker',
      toolName: 'ATS Checker',
      usageCount: 2,
      totalProcessingTime: 67.4,
      averageFileSize: 204800, // ~200KB
      successRate: 100,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      trend: TrendDirection.DOWN,
      trendPercentage: -20.0
    }
  ],
  timeSeriesData: generateTimeSeriesData(),
  topFiles: [
    {
      fileName: 'hero-banner-optimized.jpg',
      fileType: 'image/jpeg',
      fileSize: 1048576, // 1MB
      toolUsed: 'Image Compressor',
      processedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      processingTime: 3.2,
      downloadCount: 15
    },
    {
      fileName: 'company-website-qr.png',
      fileType: 'image/png',
      fileSize: 15360,
      toolUsed: 'QR Generator',
      processedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
      processingTime: 0.8,
      downloadCount: 12
    },
    {
      fileName: 'project-documentation.pdf',
      fileType: 'application/pdf',
      fileSize: 524288,
      toolUsed: 'Markdown Editor',
      processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      processingTime: 8.5,
      downloadCount: 8
    },
    {
      fileName: 'john-doe-signature.png',
      fileType: 'image/png',
      fileSize: 8192,
      toolUsed: 'Signature Creator',
      processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      processingTime: 2.1,
      downloadCount: 6
    },
    {
      fileName: 'alex-johnson-resume.pdf',
      fileType: 'application/pdf',
      fileSize: 204800,
      toolUsed: 'Resume Builder',
      processedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      processingTime: 15.6,
      downloadCount: 4
    }
  ],
  performanceMetrics: {
    averageUploadSpeed: 12.5, // MB/s
    averageProcessingSpeed: 45.2, // files/minute
    errorRate: 2.2, // percentage
    uptimePercentage: 99.8,
    peakConcurrentUsers: 1,
    averageQueueTime: 0.3 // seconds
  },
  comparisonData: {
    previousPeriod: {
      totalToolsUsed: 98,
      totalFilesProcessed: 67,
      totalStorageUsed: 12582912, // ~12MB
      totalTimeSaved: 285,
      averageProcessingTime: 2.8,
      successRate: 96.2,
      mostUsedTool: 'QR Generator',
      peakUsageHour: 15
    },
    percentageChange: {
      toolsUsed: 29.6,
      filesProcessed: 32.8,
      storageUsed: 25.0,
      timeSaved: 19.3
    }
  },
  goals: [
    {
      id: 'goal-1',
      name: 'Process 100 files',
      description: 'Process 100 files this month',
      targetValue: 100,
      currentValue: 89,
      unit: 'files',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      isCompleted: false,
      progress: 89
    },
    {
      id: 'goal-2',
      name: 'Save 5 hours',
      description: 'Save 5 hours of manual work',
      targetValue: 300,
      currentValue: 340,
      unit: 'minutes',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      isCompleted: true,
      progress: 100
    },
    {
      id: 'goal-3',
      name: 'Try all tools',
      description: 'Use all 7 available tools',
      targetValue: 7,
      currentValue: 6,
      unit: 'tools',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
      isCompleted: false,
      progress: 85.7
    }
  ]
}

function generateTimeSeriesData(): TimeSeriesData[] {
  const data: TimeSeriesData[] = []
  const now = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    data.push({
      date,
      toolsUsed: Math.floor(Math.random() * 8) + 1,
      filesProcessed: Math.floor(Math.random() * 6) + 1,
      storageUsed: Math.floor(Math.random() * 1048576) + 524288, // 0.5-1.5MB
      processingTime: Math.random() * 5 + 1, // 1-6 seconds
      errors: Math.random() < 0.1 ? 1 : 0 // 10% chance of error
    })
  }
  
  return data
}

export const getChartData = (type: 'usage' | 'files' | 'storage' | 'performance'): ChartData => {
  const timeSeriesData = mockAnalyticsData.timeSeriesData
  const labels = timeSeriesData.map(d => d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  
  switch (type) {
    case 'usage':
      return {
        labels,
        datasets: [
          {
            label: 'Tools Used',
            data: timeSeriesData.map(d => d.toolsUsed),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    
    case 'files':
      return {
        labels,
        datasets: [
          {
            label: 'Files Processed',
            data: timeSeriesData.map(d => d.filesProcessed),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    
    case 'storage':
      return {
        labels,
        datasets: [
          {
            label: 'Storage Used (MB)',
            data: timeSeriesData.map(d => Math.round(d.storageUsed / 1048576 * 100) / 100),
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    
    case 'performance':
      return {
        labels,
        datasets: [
          {
            label: 'Processing Time (s)',
            data: timeSeriesData.map(d => Math.round(d.processingTime * 100) / 100),
            borderColor: 'rgb(139, 92, 246)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    
    default:
      return { labels: [], datasets: [] }
  }
}

export const getToolUsageChartData = (): ChartData => {
  const toolUsage = mockAnalyticsData.toolUsage
  
  return {
    labels: toolUsage.map(tool => tool.toolName),
    datasets: [
      {
        label: 'Usage Count',
        data: toolUsage.map(tool => tool.usageCount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${Math.round(minutes)}m`
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = Math.round(minutes % 60)
  
  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

export const getTrendIcon = (trend: TrendDirection): string => {
  switch (trend) {
    case TrendDirection.UP: return '📈'
    case TrendDirection.DOWN: return '📉'
    case TrendDirection.STABLE: return '➡️'
    default: return '➡️'
  }
}

export const getTrendColor = (trend: TrendDirection): string => {
  switch (trend) {
    case TrendDirection.UP: return 'text-green-600 dark:text-green-400'
    case TrendDirection.DOWN: return 'text-red-600 dark:text-red-400'
    case TrendDirection.STABLE: return 'text-muted-foreground'
    default: return 'text-muted-foreground'
  }
}
