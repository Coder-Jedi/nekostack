'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/user-store'
import { useToolsStore } from '@/stores/tools-store'
import { UserProfileComponent } from '@/components/dashboard/user-profile'
import { UsageDashboard } from '@/components/dashboard/usage-dashboard'
import { FavoritesSection } from '@/components/dashboard/favorites-section'
import { AnnouncementsPanel } from '@/components/announcements/announcements-panel'
import { RecentFilesWidget } from '@/components/files/recent-files-widget'
import { CTAManager } from '@/components/cta/cta-manager'
import { mockUserProfile, mockRecentActivity } from '@/lib/mock-user-data'
import { mockTools } from '@/lib/mock-data'

export default function ProfilePage() {
  const { user, recentActivity, setUser, setRecentActivity } = useUserStore()
  const { tools, setTools, toggleFavorite } = useToolsStore()

  useEffect(() => {
    // Initialize mock data for development
    if (!user) {
      setUser(mockUserProfile)
    }
    if (recentActivity.length === 0) {
      setRecentActivity(mockRecentActivity)
    }
    if (tools.length === 0) {
      setTools(mockTools)
    }
  }, [user, recentActivity, tools, setUser, setRecentActivity, setTools])

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-48 bg-muted rounded-lg" />
        </div>
      </div>
    )
  }

  const favoriteTools = tools.filter(tool => tool.isFavorite)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your account, view usage statistics, and access your favorite tools
          </p>
        </div>

        {/* User Profile Card */}
        <UserProfileComponent user={user} />

        {/* Announcements */}
        <AnnouncementsPanel />

        {/* CTA Banners */}
        <CTAManager maxCTAs={1} position="inline" />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Usage Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            <div data-tour="usage-dashboard">
              <UsageDashboard user={user} recentActivity={recentActivity} />
            </div>
            <RecentFilesWidget maxItems={4} />
          </div>

          {/* Right Column - Favorites */}
          <div className="lg:col-span-1" data-tour="favorites-section">
            <FavoritesSection 
              favoriteTools={favoriteTools}
              onFavoriteToggle={toggleFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Profile Dashboard - NekoStack',
  description: 'Manage your NekoStack account, view usage statistics, and access your favorite tools.',
}
