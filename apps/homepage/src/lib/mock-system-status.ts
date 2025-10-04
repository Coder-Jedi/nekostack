import { 
  SystemStatus, 
  ServiceStatus, 
  ServiceStatusDetail,
  Incident,
  IncidentStatus,
  IncidentImpact,
  MaintenanceWindow,
  MaintenanceStatus,
  MaintenanceImpact,
  SystemMetrics,
  HistoricalData
} from '@nekostack/types'

export const mockSystemStatus: SystemStatus = {
  overall: ServiceStatus.OPERATIONAL,
  services: [
    {
      id: 'api-gateway',
      name: 'API Gateway',
      description: 'Main API endpoint for all tool requests',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.98,
      responseTime: 145,
      region: 'Global'
    },
    {
      id: 'image-processor',
      name: 'Image Processing',
      description: 'Image compression and optimization service',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.95,
      responseTime: 2340,
      region: 'US-East'
    },
    {
      id: 'document-processor',
      name: 'Document Processing',
      description: 'PDF and document conversion service',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.92,
      responseTime: 1850,
      region: 'US-West'
    },
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'QR code generation and customization',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.99,
      responseTime: 89,
      region: 'Global'
    },
    {
      id: 'file-storage',
      name: 'File Storage',
      description: 'Secure file storage and retrieval',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.97,
      responseTime: 234,
      region: 'Multi-region'
    },
    {
      id: 'authentication',
      name: 'Authentication',
      description: 'User authentication and authorization',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.99,
      responseTime: 67,
      region: 'Global'
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Primary database cluster',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.96,
      responseTime: 12,
      region: 'Multi-region'
    },
    {
      id: 'cdn',
      name: 'Content Delivery',
      description: 'Global CDN for static assets',
      status: ServiceStatus.OPERATIONAL,
      uptime: 99.99,
      responseTime: 45,
      region: 'Global'
    }
  ],
  incidents: [
    {
      id: 'inc-001',
      title: 'Intermittent Image Processing Delays',
      description: 'Some users may experience longer than usual processing times for large image files.',
      status: IncidentStatus.RESOLVED,
      impact: IncidentImpact.MINOR,
      affectedServices: ['image-processor'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3), // 2 days ago + 3 hours
      resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3),
      updates: [
        {
          id: 'update-001',
          message: 'We are investigating reports of slower than usual image processing times.',
          status: IncidentStatus.INVESTIGATING,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
          author: 'NekoStack Team'
        },
        {
          id: 'update-002',
          message: 'We have identified the issue as a temporary resource constraint and are scaling up processing capacity.',
          status: IncidentStatus.IDENTIFIED,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60),
          author: 'NekoStack Team'
        },
        {
          id: 'update-003',
          message: 'Additional processing capacity has been deployed. Processing times should return to normal.',
          status: IncidentStatus.MONITORING,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 2),
          author: 'NekoStack Team'
        },
        {
          id: 'update-004',
          message: 'All systems are operating normally. This incident has been resolved.',
          status: IncidentStatus.RESOLVED,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 3),
          author: 'NekoStack Team'
        }
      ]
    }
  ],
  maintenances: [
    {
      id: 'maint-001',
      title: 'Database Performance Optimization',
      description: 'Scheduled maintenance to optimize database performance and apply security updates.',
      status: MaintenanceStatus.SCHEDULED,
      affectedServices: ['database', 'api-gateway'],
      scheduledStart: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      scheduledEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2), // 7 days + 2 hours
      impact: MaintenanceImpact.MINOR_IMPACT,
      updates: [
        {
          id: 'maint-update-001',
          message: 'Scheduled maintenance window has been planned for database optimization.',
          status: MaintenanceStatus.SCHEDULED,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          author: 'NekoStack Team'
        }
      ]
    }
  ],
  metrics: {
    uptime: {
      last24Hours: 100.0,
      last7Days: 99.98,
      last30Days: 99.95,
      last90Days: 99.94,
      currentStreak: 45
    },
    performance: {
      averageResponseTime: 485,
      p95ResponseTime: 1200,
      p99ResponseTime: 2500,
      throughput: 1247,
      errorRate: 0.02
    },
    usage: {
      activeUsers: 1247,
      totalRequests: 89432,
      dataProcessed: 15728640000, // ~15GB
      peakConcurrentUsers: 342,
      averageSessionDuration: 18.5
    },
    errors: {
      total: 18,
      rate: 0.02,
      byType: {
        'timeout': 8,
        'rate_limit': 5,
        'validation': 3,
        'server_error': 2
      },
      criticalErrors: 0,
      resolved: 16
    }
  },
  lastUpdated: new Date()
}

export const mockHistoricalData: HistoricalData[] = generateHistoricalData()

function generateHistoricalData(): HistoricalData[] {
  const data: HistoricalData[] = []
  const now = new Date()
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    data.push({
      date,
      uptime: Math.random() > 0.05 ? 99.5 + Math.random() * 0.5 : 95 + Math.random() * 4, // 95% chance of good uptime
      responseTime: 400 + Math.random() * 200 + (Math.random() > 0.9 ? Math.random() * 1000 : 0), // occasional spikes
      incidents: Math.random() > 0.95 ? 1 : 0, // 5% chance of incident
      maintenances: Math.random() > 0.98 ? 1 : 0 // 2% chance of maintenance
    })
  }
  
  return data
}

export const getStatusColor = (status: ServiceStatus): string => {
  switch (status) {
    case ServiceStatus.OPERATIONAL:
      return 'text-green-600 dark:text-green-400'
    case ServiceStatus.DEGRADED:
      return 'text-yellow-600 dark:text-yellow-400'
    case ServiceStatus.PARTIAL_OUTAGE:
      return 'text-orange-600 dark:text-orange-400'
    case ServiceStatus.MAJOR_OUTAGE:
      return 'text-red-600 dark:text-red-400'
    case ServiceStatus.MAINTENANCE:
      return 'text-blue-600 dark:text-blue-400'
    default:
      return 'text-muted-foreground'
  }
}

export const getStatusBgColor = (status: ServiceStatus): string => {
  switch (status) {
    case ServiceStatus.OPERATIONAL:
      return 'bg-green-100 dark:bg-green-900/30'
    case ServiceStatus.DEGRADED:
      return 'bg-yellow-100 dark:bg-yellow-900/30'
    case ServiceStatus.PARTIAL_OUTAGE:
      return 'bg-orange-100 dark:bg-orange-900/30'
    case ServiceStatus.MAJOR_OUTAGE:
      return 'bg-red-100 dark:bg-red-900/30'
    case ServiceStatus.MAINTENANCE:
      return 'bg-blue-100 dark:bg-blue-900/30'
    default:
      return 'bg-muted'
  }
}

export const getStatusIcon = (status: ServiceStatus): string => {
  switch (status) {
    case ServiceStatus.OPERATIONAL:
      return '✅'
    case ServiceStatus.DEGRADED:
      return '⚠️'
    case ServiceStatus.PARTIAL_OUTAGE:
      return '🟡'
    case ServiceStatus.MAJOR_OUTAGE:
      return '🔴'
    case ServiceStatus.MAINTENANCE:
      return '🔧'
    default:
      return '❓'
  }
}

export const getIncidentImpactColor = (impact: IncidentImpact): string => {
  switch (impact) {
    case IncidentImpact.MINOR:
      return 'text-yellow-600 dark:text-yellow-400'
    case IncidentImpact.MAJOR:
      return 'text-orange-600 dark:text-orange-400'
    case IncidentImpact.CRITICAL:
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-muted-foreground'
  }
}

export const getIncidentStatusColor = (status: IncidentStatus): string => {
  switch (status) {
    case IncidentStatus.INVESTIGATING:
      return 'text-red-600 dark:text-red-400'
    case IncidentStatus.IDENTIFIED:
      return 'text-orange-600 dark:text-orange-400'
    case IncidentStatus.MONITORING:
      return 'text-yellow-600 dark:text-yellow-400'
    case IncidentStatus.RESOLVED:
      return 'text-green-600 dark:text-green-400'
    default:
      return 'text-muted-foreground'
  }
}

export const formatUptime = (uptime: number): string => {
  return `${uptime.toFixed(2)}%`
}

export const formatResponseTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export const getUptimeColor = (uptime: number): string => {
  if (uptime >= 99.9) return 'text-green-600 dark:text-green-400'
  if (uptime >= 99.5) return 'text-yellow-600 dark:text-yellow-400'
  if (uptime >= 99.0) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

export const getResponseTimeColor = (ms: number): string => {
  if (ms <= 200) return 'text-green-600 dark:text-green-400'
  if (ms <= 500) return 'text-yellow-600 dark:text-yellow-400'
  if (ms <= 1000) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}
