'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { LanguageSelector } from './language-selector'
import { ToolsDropdown } from './tools-dropdown'
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown'
import { useUserStore } from '@/stores/user-store'
import { useAnnouncementsStore } from '@/stores/announcements-store'
import { CompactAnnouncementBanner } from '@/components/announcements/announcement-banner'
import { mockAnnouncements } from '@/lib/mock-announcements'
import { useAnalytics } from '@/lib/analytics'
import { Search, Menu, User, Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useUserStore()
  const { 
    announcements, 
    setAnnouncements, 
    dismissAnnouncement, 
    getVisibleAnnouncements,
    hasUnreadAnnouncements 
  } = useAnnouncementsStore()
  const { buttonClicked, announcementInteraction } = useAnalytics()

  // No auto-login - user must click CTA buttons

  // Initialize announcements
  useEffect(() => {
    if (announcements.length === 0) {
      setAnnouncements(mockAnnouncements)
    }
  }, [announcements, setAnnouncements])

  const userPlan = user?.subscription.plan || 'free'
  const visibleAnnouncements = getVisibleAnnouncements(userPlan)
  const hasUnread = hasUnreadAnnouncements(userPlan)
  const topAnnouncement = visibleAnnouncements[0] // Show only the top priority announcement

  const handleAnnouncementDismiss = (announcementId: string) => {
    dismissAnnouncement(announcementId)
    announcementInteraction(announcementId, 'dismissed')
  }

  return (
    <>
      {/* Top Announcement Banner */}
      {topAnnouncement && (
        <CompactAnnouncementBanner
          announcement={topAnnouncement}
          onDismiss={handleAnnouncementDismiss}
        />
      )}
      
      <header className="dashboard-header sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <span className="hidden font-bold sm:inline-block">NekoStack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" data-tour="main-nav">
            {isAuthenticated ? (
              // Authenticated Navigation
              <>
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/tools"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Tools
                </Link>
                <Link
                  href="/analytics"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Analytics
                </Link>
                <Link
                  href="/billing"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Billing
                </Link>
                <Link
                  href="/status"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Status
                </Link>
                <Link
                  href="/export"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Export
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Profile
                </Link>
              </>
            ) : (
              // Public Navigation
              <>
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <ToolsDropdown />
                <Link
                  href="/pricing"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  About
                </Link>
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop only */}
            <div className="hidden lg:flex">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search tools..."
                  className="search-input pl-8 w-64"
                  data-tour="search-input"
                />
              </div>
            </div>

            {/* Notifications Bell */}
            {isAuthenticated && hasUnread && (
              <button 
                onClick={() => buttonClicked('notifications_bell', 'header')}
                className="relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
              >
                <Bell className="h-[1.2rem] w-[1.2rem]" />
                {visibleAnnouncements.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {visibleAnnouncements.length}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </button>
            )}

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <div data-tour="theme-toggle">
              <ThemeToggle />
            </div>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div data-tour="profile-dropdown">
                <ProfileDropdown user={user} onLogout={logout} />
              </div>
            ) : (
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <User className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">User menu</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden"
            >
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {isAuthenticated ? (
                // Authenticated Mobile Nav
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/tools"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link
                    href="/analytics"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/billing"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Billing
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                // Public Mobile Nav
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/tools"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </>
              )}
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search tools..."
                    className="search-input pl-8 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  )
}
