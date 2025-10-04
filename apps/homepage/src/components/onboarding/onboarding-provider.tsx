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
    isOnboardingEnabled
  } = useOnboardingStore()

  // Check if we should show onboarding for new users
  useEffect(() => {
    if (!isOnboardingEnabled) return
    
    // Show welcome tour for new authenticated users on homepage
    if (isAuthenticated && user && pathname === '/') {
      const userJoinedRecently = user.stats.joinedDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Within last 7 days
      
      if (userJoinedRecently && shouldShowTour(welcomeTour)) {
        // Delay to let the page load
        setTimeout(() => {
          startTour(welcomeTour)
        }, 3000)
      }
    }
    
    // Show page-specific tours
    const pageTour = getTourForPage(pathname)
    if (pageTour && shouldShowTour(pageTour)) {
      // Only show if user has completed the welcome tour or it's not required
      setTimeout(() => {
        startTour(pageTour)
      }, 2000)
    }
  }, [pathname, isAuthenticated, user, startTour, shouldShowTour, isOnboardingEnabled])

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
