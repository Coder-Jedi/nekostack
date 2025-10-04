import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OnboardingTour, OnboardingProgress } from '@nekostack/types'

interface OnboardingState {
  // Data
  completedTours: string[]
  skippedTours: string[]
  activeTour: OnboardingTour | null
  isVisible: boolean
  
  // Settings
  isOnboardingEnabled: boolean
  showOnboardingPrompts: boolean
  
  // Actions
  startTour: (tour: OnboardingTour) => void
  completeTour: (tourId: string) => void
  skipTour: (tourId: string) => void
  closeTour: () => void
  setOnboardingEnabled: (enabled: boolean) => void
  resetOnboarding: () => void
  
  // Computed
  isTourCompleted: (tourId: string) => boolean
  isTourSkipped: (tourId: string) => boolean
  shouldShowTour: (tour: OnboardingTour) => boolean
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      completedTours: [],
      skippedTours: [],
      activeTour: null,
      isVisible: false,
      isOnboardingEnabled: true,
      showOnboardingPrompts: true,

      // Actions
      startTour: (tour) => {
        const { shouldShowTour } = get()
        if (shouldShowTour(tour)) {
          set({
            activeTour: tour,
            isVisible: true
          })
        }
      },

      completeTour: (tourId) => {
        const { completedTours } = get()
        if (!completedTours.includes(tourId)) {
          set({
            completedTours: [...completedTours, tourId],
            activeTour: null,
            isVisible: false
          })
        }
      },

      skipTour: (tourId) => {
        const { skippedTours } = get()
        if (!skippedTours.includes(tourId)) {
          set({
            skippedTours: [...skippedTours, tourId],
            activeTour: null,
            isVisible: false
          })
        }
      },

      closeTour: () => {
        set({
          activeTour: null,
          isVisible: false
        })
      },

      setOnboardingEnabled: (enabled) => {
        set({ isOnboardingEnabled: enabled })
        if (!enabled) {
          set({
            activeTour: null,
            isVisible: false
          })
        }
      },

      resetOnboarding: () => {
        set({
          completedTours: [],
          skippedTours: [],
          activeTour: null,
          isVisible: false,
          isOnboardingEnabled: true,
          showOnboardingPrompts: true
        })
      },

      // Computed functions
      isTourCompleted: (tourId) => {
        const { completedTours } = get()
        return completedTours.includes(tourId)
      },

      isTourSkipped: (tourId) => {
        const { skippedTours } = get()
        return skippedTours.includes(tourId)
      },

      shouldShowTour: (tour) => {
        const { 
          isOnboardingEnabled, 
          isTourCompleted, 
          isTourSkipped 
        } = get()
        
        if (!isOnboardingEnabled) return false
        if (!tour.isActive) return false
        if (isTourCompleted(tour.id)) return false
        if (isTourSkipped(tour.id)) return false
        
        return true
      }
    }),
    {
      name: 'nekostack-onboarding-storage',
      partialize: (state) => ({
        completedTours: state.completedTours,
        skippedTours: state.skippedTours,
        isOnboardingEnabled: state.isOnboardingEnabled,
        showOnboardingPrompts: state.showOnboardingPrompts
      })
    }
  )
)
