'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/user-store'
import { CTABanner, CTAAudience, CTATriggerType } from '@nekostack/types'
import { CTABannerComponent } from './cta-banner'
import { mockCTABanners } from '@/lib/mock-cta'
import { useAnalytics } from '@/lib/analytics'

interface CTAManagerProps {
  maxCTAs?: number
  position?: 'top' | 'bottom' | 'inline'
}

export function CTAManager({ maxCTAs = 2, position = 'inline' }: CTAManagerProps) {
  const { user, isAuthenticated } = useUserStore()
  const [activeCTAs, setActiveCTAs] = useState<CTABanner[]>([])
  const [dismissedCTAs, setDismissedCTAs] = useState<string[]>([])
  const { featureUsed } = useAnalytics()

  useEffect(() => {
    // Filter CTAs based on user and conditions
    const filterCTAs = () => {
      const now = new Date()
      const userPlan = user?.subscription.plan || 'free'
      const usagePercentage = user?.usage.percentageUsed || 0

      const eligibleCTAs = mockCTABanners.filter(cta => {
        // Check if CTA is active
        if (!cta.isActive) return false
        
        // Check date range
        if (cta.startDate > now) return false
        if (cta.endDate && cta.endDate < now) return false
        
        // Check if already dismissed
        if (dismissedCTAs.includes(cta.id)) return false
        
        // Check target audience
        if (!isAudienceMatch(cta.targetAudience, userPlan, isAuthenticated)) return false
        
        // Check triggers
        return cta.triggers.some(trigger => {
          switch (trigger.type) {
            case CTATriggerType.PAGE_LOAD:
              return true // Always show page load CTAs
            case CTATriggerType.USAGE_LIMIT:
              return usagePercentage >= (trigger.value || 80)
            case CTATriggerType.TIME_BASED:
              return true // For simplicity, always trigger time-based
            case CTATriggerType.SUBSCRIPTION_STATUS:
              return userPlan === 'free' // Show upgrade CTAs to free users
            default:
              return false
          }
        })
      })

      // Sort by priority and take only the max number
      const sortedCTAs = eligibleCTAs
        .sort((a, b) => {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        })
        .slice(0, maxCTAs)

      setActiveCTAs(sortedCTAs)

      // Track CTA impressions
      sortedCTAs.forEach(cta => {
        featureUsed('cta_impression', {
          ctaId: cta.id,
          ctaType: cta.type,
          position
        })
      })
    }

    // Initial filter
    filterCTAs()

    // Set up intervals for time-based triggers
    const interval = setInterval(filterCTAs, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [user, isAuthenticated, dismissedCTAs, maxCTAs, position, featureUsed])

  const handleDismiss = (ctaId: string) => {
    setDismissedCTAs(prev => [...prev, ctaId])
    setActiveCTAs(prev => prev.filter(cta => cta.id !== ctaId))
    
    featureUsed('cta_dismissed', {
      ctaId,
      position
    })
  }

  const handleAction = (ctaId: string, actionId: string) => {
    featureUsed('cta_action_taken', {
      ctaId,
      actionId,
      position
    })
  }

  if (activeCTAs.length === 0) return null

  return (
    <div className={`space-y-4 ${position === 'top' ? 'mb-6' : position === 'bottom' ? 'mt-6' : ''}`}>
      {activeCTAs.map(cta => (
        <CTABannerComponent
          key={cta.id}
          cta={cta}
          onDismiss={handleDismiss}
          onAction={handleAction}
        />
      ))}
    </div>
  )
}

// Helper function to check audience match
function isAudienceMatch(
  audience: CTAAudience, 
  userPlan: string, 
  isAuthenticated: boolean
): boolean {
  if (!isAuthenticated && audience !== CTAAudience.ALL) {
    return false
  }

  switch (audience) {
    case CTAAudience.ALL:
      return true
    case CTAAudience.FREE_USERS:
      return userPlan === 'free'
    case CTAAudience.PRO_USERS:
      return userPlan === 'pro'
    case CTAAudience.ENTERPRISE_USERS:
      return userPlan === 'enterprise'
    case CTAAudience.NEW_USERS:
      // Consider users who joined in the last 7 days as new
      return true // Simplified for demo
    case CTAAudience.POWER_USERS:
      // Users with high usage
      return true // Simplified for demo
    default:
      return false
  }
}
