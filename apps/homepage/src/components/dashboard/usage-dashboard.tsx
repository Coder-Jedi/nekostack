'use client'

import { UserProfile, RecentActivity, ActivityAction } from '@nekostack/types'
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Target,
  Calendar,
  ArrowUpRight,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { formatTimeAgo, getActivityIcon } from '@/lib/mock-user-data'

interface UsageDashboardProps {
  user: UserProfile
  recentActivity: RecentActivity[]
}

export function UsageDashboard({ user, recentActivity }: UsageDashboardProps) {
  const usagePercentage = user.usage.percentageUsed
  const isNearLimit = usagePercentage >= 80
  const isOverLimit = usagePercentage >= 100

  const getUsageColor = () => {
    if (isOverLimit) return 'text-red-600 dark:text-red-400'
    if (isNearLimit) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getProgressBarColor = () => {
    if (isOverLimit) return 'bg-red-500'
    if (isNearLimit) return 'bg-yellow-500'
    return 'bg-primary'
  }

  const formatActivityDescription = (activity: RecentActivity) => {
    switch (activity.action) {
      case ActivityAction.TOOL_USED:
        return `Used ${activity.toolName}`
      case ActivityAction.FAVORITE_ADDED:
        return `Added ${activity.toolName} to favorites`
      case ActivityAction.FAVORITE_REMOVED:
        return `Removed ${activity.toolName} from favorites`
      case ActivityAction.FILE_UPLOADED:
        return `Uploaded file in ${activity.toolName}`
      case ActivityAction.FILE_DOWNLOADED:
        return `Downloaded file from ${activity.toolName}`
      default:
        return `Activity in ${activity.toolName}`
    }
  }

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Usage Overview
          </h3>
          <Link 
            href="/usage"
            className="text-sm text-primary hover:underline flex items-center"
          >
            View details
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Usage Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {user.usage.toolsUsed}
            </div>
            <div className="text-sm text-muted-foreground">
              Tools Used This Month
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {user.stats.totalToolsUsed}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Tools Used
            </div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {user.stats.favoriteTools}
            </div>
            <div className="text-sm text-muted-foreground">
              Favorite Tools
            </div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Monthly Quota</span>
            <span className={`text-sm font-medium ${getUsageColor()}`}>
              {user.usage.toolsUsed}/{user.usage.quotaLimit} ({usagePercentage}%)
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={`rounded-full h-3 transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          
          {isNearLimit && (
            <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
              <Zap className="h-4 w-4 mr-2" />
              {isOverLimit 
                ? 'You\'ve exceeded your monthly quota. Consider upgrading your plan.'
                : 'You\'re approaching your monthly quota limit.'
              }
            </div>
          )}
        </div>

        {/* Upgrade prompt for free users */}
        {user.subscription.plan === 'free' && (
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Upgrade to Pro</h4>
                <p className="text-sm text-muted-foreground">
                  Get unlimited usage and premium features
                </p>
              </div>
              <Link 
                href="/billing"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
              >
                Upgrade
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </h3>
          <Link 
            href="/activity"
            className="text-sm text-primary hover:underline flex items-center"
          >
            View all
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm">
                      {getActivityIcon(activity.action)}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {formatActivityDescription(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
                
                {activity.metadata && (
                  <div className="text-xs text-muted-foreground">
                    {activity.metadata.filesProcessed && `${activity.metadata.filesProcessed} files`}
                    {activity.metadata.qrCodesGenerated && `${activity.metadata.qrCodesGenerated} codes`}
                    {activity.metadata.conversions && `${activity.metadata.conversions} conversions`}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-sm font-medium text-foreground mb-2">No recent activity</h4>
            <p className="text-sm text-muted-foreground">
              Start using tools to see your activity here
            </p>
            <Link 
              href="/tools"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 mt-4"
            >
              Browse Tools
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.floor(user.usage.toolsUsed * 0.3)}
              </p>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Days Active</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round((Date.now() - user.stats.joinedDate.getTime()) / (1000 * 60 * 60 * 24))}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
