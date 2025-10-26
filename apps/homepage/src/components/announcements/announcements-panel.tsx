'use client'

import { useEffect } from 'react'
import { useAnnouncementsStore } from '@/stores/announcements-store'
import { useUserStore } from '@/stores/user-store'
import { AnnouncementBanner } from './announcement-banner'
import { mockAnnouncements } from '@/lib/mock-announcements'
import { mockSystemStatus } from '@/lib/mock-system-status'
import { Bell, CheckCircle, AlertCircle } from 'lucide-react'

interface AnnouncementsPanelProps {
  compact?: boolean
  maxItems?: number
}

export function AnnouncementsPanel({ compact = false, maxItems = 3 }: AnnouncementsPanelProps) {
  const { user } = useUserStore()
  const {
    announcements,
    systemStatus,
    setAnnouncements,
    setSystemStatus,
    dismissAnnouncement,
    getVisibleAnnouncements,
    hasUnreadAnnouncements
  } = useAnnouncementsStore()

  useEffect(() => {
    // Initialize mock data
    if (announcements.length === 0) {
      setAnnouncements(mockAnnouncements)
    }
    if (!systemStatus) {
      setSystemStatus(mockSystemStatus)
    }
  }, [announcements, systemStatus, setAnnouncements, setSystemStatus])

  const userPlan = user?.subscription.plan || 'free'
  const visibleAnnouncements = getVisibleAnnouncements(userPlan)
  const displayedAnnouncements = compact 
    ? visibleAnnouncements.slice(0, maxItems)
    : visibleAnnouncements

  const hasUnread = hasUnreadAnnouncements(userPlan)

  if (compact && displayedAnnouncements.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Announcements
            {hasUnread && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {visibleAnnouncements.length}
              </span>
            )}
          </h3>
          
          {/* System Status Indicator */}
          {systemStatus && (
            <div className="flex items-center space-x-2 text-sm">
              {systemStatus.overall === 'operational' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              )}
              <span className="text-muted-foreground">
                {systemStatus.overall === 'operational' ? 'All systems operational' : 'Service issues'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Announcements */}
      {displayedAnnouncements.length > 0 ? (
        <div className="space-y-3">
          {displayedAnnouncements.map((announcement) => (
            <AnnouncementBanner
              key={announcement.id}
              announcement={announcement}
              onDismiss={dismissAnnouncement}
            />
          ))}
          
          {compact && visibleAnnouncements.length > maxItems && (
            <div className="text-center">
              <button className="text-sm text-primary hover:underline">
                View {visibleAnnouncements.length - maxItems} more announcements
              </button>
            </div>
          )}
        </div>
      ) : (
        !compact && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-sm font-medium text-foreground mb-2">No announcements</h4>
            <p className="text-sm text-muted-foreground">
              You're all caught up! We'll notify you when there are new updates.
            </p>
          </div>
        )
      )}
    </div>
  )
}
