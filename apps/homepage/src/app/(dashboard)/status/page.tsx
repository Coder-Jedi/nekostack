'use client'

import { useEffect, useState } from 'react'
import { 
  mockSystemStatus, 
  mockHistoricalData,
  getStatusColor,
  getStatusBgColor,
  getStatusIcon,
  getIncidentImpactColor,
  getIncidentStatusColor,
  formatUptime,
  formatResponseTime,
  getUptimeColor,
  getResponseTimeColor
} from '@/lib/mock-system-status'
import { 
  SystemStatus, 
  ServiceStatus, 
  Incident,
  MaintenanceWindow,
  HistoricalData 
} from '@nekostack/types'
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  Users, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Tool,
  Calendar,
  RefreshCw,
  ExternalLink,
  Bell,
  BarChart3
} from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

export default function StatusPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const { buttonClicked } = useAnalytics()

  useEffect(() => {
    // Initialize mock data
    setSystemStatus(mockSystemStatus)
    setHistoricalData(mockHistoricalData)
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      // In a real app, this would fetch fresh data
      setLastRefresh(new Date())
      buttonClicked('status_auto_refresh', 'status_page')
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, buttonClicked])

  const handleManualRefresh = () => {
    setLastRefresh(new Date())
    buttonClicked('status_manual_refresh', 'status_page')
    // In a real app, this would fetch fresh data
  }

  const handleSubscribeToUpdates = () => {
    buttonClicked('status_subscribe', 'status_page')
    // In a real app, this would open subscription modal
    console.log('Subscribe to status updates')
  }

  if (!systemStatus) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const overallStatusText = systemStatus.overall === ServiceStatus.OPERATIONAL 
    ? 'All Systems Operational' 
    : 'Some Systems Experiencing Issues'

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Status</h1>
          <p className="text-muted-foreground">
            Real-time status of NekoStack services and infrastructure
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Auto Refresh Toggle */}
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span>Auto-refresh</span>
          </label>
          
          {/* Manual Refresh */}
          <button
            onClick={handleManualRefresh}
            className="inline-flex items-center px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          {/* Subscribe Button */}
          <button
            onClick={handleSubscribeToUpdates}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
          >
            <Bell className="h-4 w-4 mr-2" />
            Subscribe to Updates
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <div className={`rounded-lg border p-6 mb-8 ${getStatusBgColor(systemStatus.overall)}`}>
        <div className="flex items-center space-x-4">
          <div className="text-4xl">
            {getStatusIcon(systemStatus.overall)}
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${getStatusColor(systemStatus.overall)}`}>
              {overallStatusText}
            </h2>
            <p className="text-muted-foreground mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Uptime</div>
            <div className={`text-2xl font-bold ${getUptimeColor(systemStatus.metrics.uptime.last30Days)}`}>
              {formatUptime(systemStatus.metrics.uptime.last30Days)}
            </div>
            <div className="text-sm text-muted-foreground">Last 30 days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Services Status */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-6">Services</h3>
            
            <div className="space-y-4">
              {systemStatus.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getStatusBgColor(service.status)}`}>
                      <Server className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <span className="text-lg">{getStatusIcon(service.status)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      {service.region && (
                        <p className="text-xs text-muted-foreground mt-1">Region: {service.region}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4 text-sm">
                      <div>
                        <div className={`font-medium ${getUptimeColor(service.uptime)}`}>
                          {formatUptime(service.uptime)}
                        </div>
                        <div className="text-muted-foreground">Uptime</div>
                      </div>
                      <div>
                        <div className={`font-medium ${getResponseTimeColor(service.responseTime)}`}>
                          {formatResponseTime(service.responseTime)}
                        </div>
                        <div className="text-muted-foreground">Response</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents */}
          {systemStatus.incidents.length > 0 && (
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-6">Recent Incidents</h3>
              
              <div className="space-y-6">
                {systemStatus.incidents.map((incident) => (
                  <div key={incident.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{incident.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            incident.status === 'resolved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Impact: <span className={getIncidentImpactColor(incident.impact)}>{incident.impact}</span></span>
                          <span>Started: {incident.createdAt.toLocaleString()}</span>
                          {incident.resolvedAt && (
                            <span>Resolved: {incident.resolvedAt.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Incident Updates */}
                    <div className="space-y-2 mt-4">
                      {incident.updates.slice(-2).map((update) => (
                        <div key={update.id} className="flex items-start space-x-3 text-sm">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            update.status === 'resolved' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <div className="flex-1">
                            <p className="text-foreground">{update.message}</p>
                            <p className="text-muted-foreground text-xs mt-1">
                              {update.createdAt.toLocaleString()} - {update.author}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scheduled Maintenance */}
          {systemStatus.maintenances.length > 0 && (
            <div className="bg-card rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-6">Scheduled Maintenance</h3>
              
              <div className="space-y-4">
                {systemStatus.maintenances.map((maintenance) => (
                  <div key={maintenance.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Tool className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-medium">{maintenance.title}</h4>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {maintenance.status.charAt(0).toUpperCase() + maintenance.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{maintenance.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {maintenance.scheduledStart.toLocaleString()} - {maintenance.scheduledEnd.toLocaleString()}
                          </span>
                          <span>Impact: {maintenance.impact.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Affected services: {maintenance.affectedServices.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Metrics */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              System Metrics
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Uptime Streak</span>
                  <span className="font-medium">{systemStatus.metrics.uptime.currentStreak} days</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Avg Response Time</span>
                  <span className={`font-medium ${getResponseTimeColor(systemStatus.metrics.performance.averageResponseTime)}`}>
                    {formatResponseTime(systemStatus.metrics.performance.averageResponseTime)}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Throughput</span>
                  <span className="font-medium">{systemStatus.metrics.performance.throughput} req/s</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Error Rate</span>
                  <span className={`font-medium ${
                    systemStatus.metrics.performance.errorRate < 0.1 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {systemStatus.metrics.performance.errorRate}%
                  </span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Active Users</span>
                  <span className="font-medium">{systemStatus.metrics.usage.activeUsers.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Uptime History */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Uptime History</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last 24 hours</span>
                <span className={`font-medium ${getUptimeColor(systemStatus.metrics.uptime.last24Hours)}`}>
                  {formatUptime(systemStatus.metrics.uptime.last24Hours)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last 7 days</span>
                <span className={`font-medium ${getUptimeColor(systemStatus.metrics.uptime.last7Days)}`}>
                  {formatUptime(systemStatus.metrics.uptime.last7Days)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last 30 days</span>
                <span className={`font-medium ${getUptimeColor(systemStatus.metrics.uptime.last30Days)}`}>
                  {formatUptime(systemStatus.metrics.uptime.last30Days)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last 90 days</span>
                <span className={`font-medium ${getUptimeColor(systemStatus.metrics.uptime.last90Days)}`}>
                  {formatUptime(systemStatus.metrics.uptime.last90Days)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            
            <div className="space-y-2">
              <a
                href="/support"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Contact Support</span>
              </a>
              <a
                href="/api-docs"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>API Documentation</span>
              </a>
              <a
                href="/changelog"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Changelog</span>
              </a>
              <a
                href="https://twitter.com/nekostack"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Follow Updates</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
