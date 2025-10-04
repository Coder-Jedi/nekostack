'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUserStore } from '@/stores/user-store'
import { analytics } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isAuthenticated } = useUserStore()

  // Track page views
  useEffect(() => {
    analytics.pageViewed(pathname, {
      isAuthenticated,
      userPlan: user?.subscription.plan
    })
  }, [pathname, isAuthenticated, user?.subscription.plan])

  // Set user ID when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      analytics.setUserId(user.id)
    }
  }, [isAuthenticated, user])

  // Track performance metrics
  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined') {
      // First Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            analytics.performanceMetric('first_contentful_paint', entry.startTime)
          }
        }
      })
      
      try {
        observer.observe({ entryTypes: ['paint'] })
      } catch (e) {
        // Performance Observer not supported
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        analytics.performanceMetric('largest_contentful_paint', lastEntry.startTime)
      })
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        // LCP not supported
      }

      // Cumulative Layout Shift
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        analytics.performanceMetric('cumulative_layout_shift', clsValue)
      })
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // CLS not supported
      }

      return () => {
        observer.disconnect()
        lcpObserver.disconnect()
        clsObserver.disconnect()
      }
    }
  }, [])

  return <>{children}</>
}
