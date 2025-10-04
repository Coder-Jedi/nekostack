'use client'

import { useEffect, useState } from 'react'
import { Advertisement, AdPlacement, AdFormat } from '@nekostack/types'
import { getAdForPlacement, trackAdImpression, trackAdClick } from '@/lib/mock-ads'
import { useUserStore } from '@/stores/user-store'
import { X, ExternalLink, Info } from 'lucide-react'
import Link from 'next/link'

interface AdZoneProps {
  placement: AdPlacement
  format?: AdFormat
  className?: string
}

export function AdZone({ placement, format, className = '' }: AdZoneProps) {
  const { user } = useUserStore()
  const [ad, setAd] = useState<Advertisement | null>(null)
  const [viewedAds, setViewedAds] = useState<string[]>([])
  const [isDismissed, setIsDismissed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const userPlan = user?.subscription.plan || 'free'

  useEffect(() => {
    // Don't show ads to premium users
    if (userPlan !== 'free') return

    // Get appropriate ad for this placement
    const selectedAd = getAdForPlacement(placement, userPlan, viewedAds)
    
    if (selectedAd) {
      setAd(selectedAd)
      
      // Track impression
      setTimeout(() => {
        trackAdImpression(selectedAd.id, placement)
        setViewedAds(prev => [...prev, selectedAd.id])
      }, 1000) // Track after 1 second of visibility
    }
  }, [placement, userPlan, viewedAds])

  const handleAdClick = () => {
    if (ad) {
      trackAdClick(ad.id, placement)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    if (ad) {
      setViewedAds(prev => [...prev, ad.id])
    }
  }

  // Don't render for premium users
  if (userPlan !== 'free') return null

  // Don't render if dismissed
  if (isDismissed) return null

  // Don't render if no ad
  if (!ad) return null

  // Different rendering based on ad type
  if (ad.type === 'text') {
    return (
      <div className={`relative bg-muted/30 border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Info className="h-3 w-3 mr-1" />
            <span>Sponsored</span>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Dismiss ad"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        
        <Link
          href={ad.clickUrl}
          onClick={handleAdClick}
          className="block hover:opacity-80 transition-opacity"
        >
          <h4 className="font-medium text-foreground mb-1">{ad.title}</h4>
          {ad.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {ad.description}
            </p>
          )}
          <div className="flex items-center mt-2 text-xs text-primary">
            <span>Learn more</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </div>
        </Link>
      </div>
    )
  }

  if (ad.type === 'native' || ad.type === 'display') {
    return (
      <div 
        className={`relative group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-2 left-2 z-10 flex items-center space-x-2">
          <div className="flex items-center bg-black/60 text-white text-xs px-2 py-1 rounded">
            <Info className="h-3 w-3 mr-1" />
            <span>Sponsored</span>
          </div>
          {isHovered && (
            <button
              onClick={handleDismiss}
              className="bg-black/60 text-white p-1 rounded hover:bg-black/80 transition-colors"
              aria-label="Dismiss ad"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        <Link
          href={ad.clickUrl}
          onClick={handleAdClick}
          className="block relative overflow-hidden rounded-lg border border-border hover:opacity-90 transition-opacity"
        >
          {ad.imageUrl && (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-4 bg-card">
            <h4 className="font-medium text-foreground mb-1">{ad.title}</h4>
            {ad.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ad.description}
              </p>
            )}
          </div>
        </Link>
      </div>
    )
  }

  if (ad.type === 'banner') {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute top-1 right-1 z-10 flex items-center space-x-1">
          <div className="flex items-center bg-black/60 text-white text-xs px-2 py-0.5 rounded">
            <span>Ad</span>
          </div>
          <button
            onClick={handleDismiss}
            className="bg-black/60 text-white p-0.5 rounded hover:bg-black/80 transition-colors"
            aria-label="Dismiss ad"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        
        <Link
          href={ad.clickUrl}
          onClick={handleAdClick}
          className="block relative overflow-hidden rounded-lg border border-border hover:opacity-90 transition-opacity"
        >
          {ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-auto"
            />
          ) : (
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 text-center">
              <h4 className="font-medium text-foreground mb-1">{ad.title}</h4>
              {ad.description && (
                <p className="text-sm text-muted-foreground">
                  {ad.description}
                </p>
              )}
            </div>
          )}
        </Link>
      </div>
    )
  }

  return null
}

// Ad-free promotion component for premium users
export function AdFreePromotion({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 text-center ${className}`}>
      <div className="text-3xl mb-3">✨</div>
      <h3 className="font-semibold text-lg mb-2">Enjoying Ad-Free Experience</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Thank you for being a premium subscriber! Your support helps us keep NekoStack running.
      </p>
      <Link
        href="/billing"
        className="inline-flex items-center text-sm text-primary hover:underline"
      >
        Manage subscription
        <ExternalLink className="h-3 w-3 ml-1" />
      </Link>
    </div>
  )
}
