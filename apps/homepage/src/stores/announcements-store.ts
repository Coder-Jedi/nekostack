import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Announcement, SystemStatus, TargetAudience } from '@nekostack/types'

interface AnnouncementsState {
  // Data
  announcements: Announcement[]
  systemStatus: SystemStatus | null
  dismissedAnnouncements: string[]
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Actions
  setAnnouncements: (announcements: Announcement[]) => void
  setSystemStatus: (status: SystemStatus) => void
  dismissAnnouncement: (announcementId: string) => void
  undismissAnnouncement: (announcementId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  getActiveAnnouncements: (userPlan?: string) => Announcement[]
  getVisibleAnnouncements: (userPlan?: string) => Announcement[]
  hasUnreadAnnouncements: (userPlan?: string) => boolean
}

export const useAnnouncementsStore = create<AnnouncementsState>()(
  persist(
    (set, get) => ({
      // Initial state
      announcements: [],
      systemStatus: null,
      dismissedAnnouncements: [],
      isLoading: false,
      error: null,

      // Actions
      setAnnouncements: (announcements) => {
        set({ announcements })
      },

      setSystemStatus: (status) => {
        set({ systemStatus: status })
      },

      dismissAnnouncement: (announcementId) => {
        const { dismissedAnnouncements } = get()
        if (!dismissedAnnouncements.includes(announcementId)) {
          set({
            dismissedAnnouncements: [...dismissedAnnouncements, announcementId]
          })
        }
      },

      undismissAnnouncement: (announcementId) => {
        const { dismissedAnnouncements } = get()
        set({
          dismissedAnnouncements: dismissedAnnouncements.filter(id => id !== announcementId)
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      // Computed functions
      getActiveAnnouncements: (userPlan = 'free') => {
        const { announcements } = get()
        const now = new Date()
        
        return announcements.filter(announcement => {
          // Check if announcement is active
          if (!announcement.isActive) return false
          
          // Check date range
          if (announcement.startDate > now) return false
          if (announcement.endDate && announcement.endDate < now) return false
          
          // Check target audience
          if (announcement.targetAudience === TargetAudience.ALL) return true
          if (announcement.targetAudience === TargetAudience.FREE_USERS && userPlan === 'free') return true
          if (announcement.targetAudience === TargetAudience.PRO_USERS && userPlan === 'pro') return true
          if (announcement.targetAudience === TargetAudience.ENTERPRISE_USERS && userPlan === 'enterprise') return true
          
          return false
        })
      },

      getVisibleAnnouncements: (userPlan = 'free') => {
        const { dismissedAnnouncements } = get()
        const activeAnnouncements = get().getActiveAnnouncements(userPlan)
        
        return activeAnnouncements.filter(announcement => 
          !dismissedAnnouncements.includes(announcement.id)
        )
      },

      hasUnreadAnnouncements: (userPlan = 'free') => {
        const visibleAnnouncements = get().getVisibleAnnouncements(userPlan)
        return visibleAnnouncements.length > 0
      }
    }),
    {
      name: 'nekostack-announcements-storage',
      partialize: (state) => ({
        dismissedAnnouncements: state.dismissedAnnouncements
      })
    }
  )
)
