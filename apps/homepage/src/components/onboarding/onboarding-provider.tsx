'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useOnboardingStore } from '@/stores/onboarding-store'
import { useUserStore } from '@/stores/user-store'
import { TourOverlay } from './tour-overlay'
import { getTourForPage, welcomeTour } from '@/lib/mock-onboarding'

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isAuthenticated } = useUserStore()
  const {
    activeTour,
    isVisible,
    startTour,
    completeTour,
    skipTour,
    closeTour,
    shouldShowTour,
    isOnboardingEnabled,
    completedTours
  } = useOnboardingStore()

  // Check if we should show onboarding for new users
  useEffect(() => {
    if (!isOnboardingEnabled) return
    
    // Don't show tours for non-authenticated users on tools page
    if (!isAuthenticated && pathname === '/tools') return
    
    // Show welcome tour for new authenticated users on homepage only
    if (isAuthenticated && user && pathname === '/') {
      const userJoinedRecently = user.stats.joinedDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Within last 7 days
      
      if (userJoinedRecently && shouldShowTour(welcomeTour)) {
        // Delay to let the page load
        setTimeout(() => {
          startTour(welcomeTour)
        }, 3000)
      }
    }
    
    // Show page-specific tours only for authenticated users who have completed welcome tour
    if (isAuthenticated && user) {
      const pageTour = getTourForPage(pathname)
      if (pageTour && shouldShowTour(pageTour)) {
        // Only show page tours if user has completed welcome tour or it's not the welcome tour
        const hasCompletedWelcome = completedTours.includes('welcome-tour')
        if (hasCompletedWelcome || pageTour.id !== 'welcome-tour') {
          setTimeout(() => {
            startTour(pageTour)
          }, 2000)
        }
      }
    }
  }, [pathname, isAuthenticated, user, startTour, shouldShowTour, isOnboardingEnabled, completedTours])

  const handleComplete = () => {
    if (activeTour) {
      completeTour(activeTour.id)
    }
  }

  const handleSkip = () => {
    if (activeTour) {
      skipTour(activeTour.id)
    }
  }

  return (
    <>
      {children}
      {activeTour && (
        <TourOverlay
          tour={activeTour}
          isVisible={isVisible}
          onComplete={handleComplete}
          onSkip={handleSkip}
          onClose={closeTour}
        />
      )}
    </>
  )
}
