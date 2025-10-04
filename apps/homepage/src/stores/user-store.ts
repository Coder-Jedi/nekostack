import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, RecentActivity } from '@nekostack/types'

interface UserState {
  // User data
  user: UserProfile | null
  recentActivity: RecentActivity[]
  isAuthenticated: boolean
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: UserProfile | null) => void
  setRecentActivity: (activity: RecentActivity[]) => void
  updateUsage: (toolsUsed: number) => void
  addActivity: (activity: RecentActivity) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  
  // Computed getters
  getUsagePercentage: () => number
  isProUser: () => boolean
  canUseFeature: (requiresPro: boolean) => boolean
  getDaysUntilRenewal: () => number | null
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      recentActivity: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        })
      },

      setRecentActivity: (activity) => {
        set({ recentActivity: activity })
      },

      updateUsage: (toolsUsed) => {
        const { user } = get()
        if (user) {
          const updatedUser = {
            ...user,
            usage: {
              ...user.usage,
              toolsUsed,
              quotaUsed: toolsUsed,
              percentageUsed: Math.round((toolsUsed / user.usage.quotaLimit) * 100)
            }
          }
          set({ user: updatedUser })
        }
      },

      addActivity: (activity) => {
        const { recentActivity } = get()
        const newActivity = [activity, ...recentActivity].slice(0, 10) // Keep only last 10
        set({ recentActivity: newActivity })
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      logout: () => {
        set({
          user: null,
          recentActivity: [],
          isAuthenticated: false,
          error: null
        })
      },

      // Computed getters
      getUsagePercentage: () => {
        const { user } = get()
        return user?.usage.percentageUsed || 0
      },

      isProUser: () => {
        const { user } = get()
        return user?.subscription.plan === 'pro' || user?.subscription.plan === 'enterprise'
      },

      canUseFeature: (requiresPro) => {
        if (!requiresPro) return true
        return get().isProUser()
      },

      getDaysUntilRenewal: () => {
        const { user } = get()
        return user?.subscription.daysRemaining || null
      }
    }),
    {
      name: 'nekostack-user-storage',
      partialize: (state) => ({
        user: state.user,
        recentActivity: state.recentActivity,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
