'use client'

import { useEffect, useState } from 'react'
import { 
  mockAnalyticsData,
  getChartData,
  getToolUsageChartData,
  formatBytes,
  formatDuration,
  formatPercentage,
  getTrendIcon,
  getTrendColor
} from '@/lib/mock-analytics'
import { 
  UserAnalytics, 
  AnalyticsPeriod, 
  TrendDirection,
  AnalyticsGoal 
} from '@nekostack/types'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  FileText, 
  HardDrive, 
  Zap,
  Target,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<UserAnalytics | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<AnalyticsPeriod>(AnalyticsPeriod.LAST_30_DAYS)
  const [selectedChart, setSelectedChart] = useState<'usage' | 'files' | 'storage' | 'performance'>('usage')
  const { buttonClicked } = useAnalytics()

  useEffect(() => {
    // Initialize mock data
    setAnalyticsData(mockAnalyticsData)
  }, [])

  const handlePeriodChange = (period: AnalyticsPeriod) => {
    setSelectedPeriod(period)
    buttonClicked('analytics_period_changed', 'analytics_page', { period })
    // In a real app, this would fetch new data
  }

  const handleExportData = () => {
    buttonClicked('analytics_export', 'analytics_page', { period: selectedPeriod })
    // In a real app, this would trigger data export
    console.log('Exporting analytics data...')
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded-lg"></div>
        </div>
      </div>
    )
  }

  const { overview, toolUsage, comparisonData, goals } = analyticsData

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your productivity and tool usage insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value as AnalyticsPeriod)}
            className="px-3 py-2 border rounded-md bg-background text-foreground"
          >
            <option value={AnalyticsPeriod.LAST_7_DAYS}>Last 7 days</option>
            <option value={AnalyticsPeriod.LAST_30_DAYS}>Last 30 days</option>
            <option value={AnalyticsPeriod.LAST_90_DAYS}>Last 90 days</option>
            <option value={AnalyticsPeriod.LAST_YEAR}>Last year</option>
            <option value={AnalyticsPeriod.ALL_TIME}>All time</option>
          </select>
          
          {/* Export Button */}
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center text-sm">
              <span className={getTrendColor(TrendDirection.UP)}>
                {formatPercentage(comparisonData.percentageChange.toolsUsed)}
              </span>
              <TrendingUp className="h-4 w-4 ml-1 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{overview.totalToolsUsed}</div>
          <div className="text-sm text-muted-foreground">Tools Used</div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center text-sm">
              <span className={getTrendColor(TrendDirection.UP)}>
                {formatPercentage(comparisonData.percentageChange.filesProcessed)}
              </span>
              <TrendingUp className="h-4 w-4 ml-1 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{overview.totalFilesProcessed}</div>
          <div className="text-sm text-muted-foreground">Files Processed</div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <HardDrive className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex items-center text-sm">
              <span className={getTrendColor(TrendDirection.UP)}>
                {formatPercentage(comparisonData.percentageChange.storageUsed)}
              </span>
              <TrendingUp className="h-4 w-4 ml-1 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{formatBytes(overview.totalStorageUsed)}</div>
          <div className="text-sm text-muted-foreground">Storage Used</div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center text-sm">
              <span className={getTrendColor(TrendDirection.UP)}>
                {formatPercentage(comparisonData.percentageChange.timeSaved)}
              </span>
              <TrendingUp className="h-4 w-4 ml-1 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{formatDuration(overview.totalTimeSaved)}</div>
          <div className="text-sm text-muted-foreground">Time Saved</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Usage Chart */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Usage Trends</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedChart('usage')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    selectedChart === 'usage' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Usage
                </button>
                <button
                  onClick={() => setSelectedChart('files')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    selectedChart === 'files' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Files
                </button>
                <button
                  onClick={() => setSelectedChart('storage')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    selectedChart === 'storage' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Storage
                </button>
              </div>
            </div>
            
            {/* Simple Chart Placeholder */}
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Chart visualization would appear here
                </p>
              </div>
            </div>
          </div>

          {/* Tool Usage Breakdown */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-6">Tool Usage Breakdown</h3>
            
            <div className="space-y-4">
              {toolUsage.map((tool, index) => (
                <div key={tool.toolId} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 text-center text-sm font-medium text-muted-foreground">
                    #{index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{tool.toolName}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {tool.usageCount} uses
                        </span>
                        <span className={`text-sm ${getTrendColor(tool.trend)}`}>
                          {getTrendIcon(tool.trend)} {formatPercentage(tool.trendPercentage)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${(tool.usageCount / toolUsage[0].usageCount) * 100}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span>Success rate: {tool.successRate}%</span>
                      <span>Avg time: {tool.totalProcessingTime / tool.usageCount}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goals */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Goals</h3>
            </div>
            
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{goal.name}</span>
                    {goal.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {goal.currentValue}/{goal.targetValue} {goal.unit}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 transition-all duration-300 ${
                        goal.isCompleted ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{goal.progress.toFixed(0)}% complete</span>
                    <span>Due {goal.deadline.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Performance</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="font-medium">{overview.successRate}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Processing</span>
                <span className="font-medium">{overview.averageProcessingTime}s</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Peak Hour</span>
                <span className="font-medium">
                  {overview.peakUsageHour}:00
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Most Used</span>
                <span className="font-medium text-sm">{overview.mostUsedTool}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-medium">32 tools used</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-medium">{overview.totalToolsUsed} tools used</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Streak</span>
                <span className="font-medium">7 days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Efficiency</span>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">High</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
