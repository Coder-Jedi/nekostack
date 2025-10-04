'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/lib/analytics'

export function PerformanceMonitor() {
  const { performanceMetric, errorOccurred } = useAnalytics()

  useEffect(() => {
    // Monitor bundle loading performance
    const measureBundleLoad = () => {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0]
        
        // Track key performance metrics
        performanceMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
        performanceMetric('load_complete', navigation.loadEventEnd - navigation.loadEventStart)
        performanceMetric('dns_lookup', navigation.domainLookupEnd - navigation.domainLookupStart)
        performanceMetric('tcp_connect', navigation.connectEnd - navigation.connectStart)
        performanceMetric('request_response', navigation.responseEnd - navigation.requestStart)
      }
    }

    // Monitor resource loading
    const measureResourceLoad = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      // Track large resources
      resources.forEach(resource => {
        if (resource.transferSize > 100000) { // > 100KB
          performanceMetric('large_resource_load', resource.duration, {
            resourceName: resource.name,
            resourceSize: resource.transferSize,
            resourceType: resource.initiatorType
          })
        }
      })
    }

    // Monitor memory usage (if available)
    const measureMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        performanceMetric('memory_used', memory.usedJSHeapSize, {
          totalHeapSize: memory.totalJSHeapSize,
          heapLimit: memory.jsHeapSizeLimit
        })
      }
    }

    // Monitor long tasks (if available)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            performanceMetric('long_task', entry.duration, {
              taskName: entry.name,
              startTime: entry.startTime
            })
          }
        })
        longTaskObserver.observe({ entryTypes: ['longtask'] })

        // Cleanup observer
        return () => longTaskObserver.disconnect()
      } catch (e) {
        // Long task observer not supported
      }
    }

    // Run measurements
    setTimeout(measureBundleLoad, 1000)
    setTimeout(measureResourceLoad, 2000)
    setTimeout(measureMemoryUsage, 3000)

    // Monitor unhandled errors
    const handleError = (event: ErrorEvent) => {
      errorOccurred(event.message, 'global_error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      errorOccurred('Unhandled promise rejection', 'promise_rejection', {
        reason: event.reason
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [performanceMetric, errorOccurred])

  return null // This component doesn't render anything
}
