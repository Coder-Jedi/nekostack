'use client'

import { useState } from 'react'
import { Announcement, AnnouncementPriority } from '@nekostack/types'
import { X, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getAnnouncementIcon, getAnnouncementColor } from '@/lib/mock-announcements'

interface AnnouncementBannerProps {
  announcement: Announcement
  onDismiss?: (announcementId: string) => void
}

export function AnnouncementBanner({ announcement, onDismiss }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.(announcement.id)
  }

  if (!isVisible) return null

  const isPriority = announcement.priority === AnnouncementPriority.HIGH || 
                   announcement.priority === AnnouncementPriority.CRITICAL

  return (
    <div className={`
      border rounded-lg p-4 mb-4 relative overflow-hidden
      ${getAnnouncementColor(announcement.type)}
      ${isPriority ? 'ring-2 ring-current ring-opacity-20' : ''}
      animate-slide-down
    `}>
      {/* Priority indicator */}
      {isPriority && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-current opacity-30" />
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <span className="text-lg" role="img" aria-label="Announcement">
            {getAnnouncementIcon(announcement.type)}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                {announcement.title}
              </h4>
              <p className="text-sm opacity-90 leading-relaxed">
                {announcement.message}
              </p>
              
              {/* Action Button */}
              {announcement.actionButton && (
                <div className="mt-3">
                  {announcement.actionButton.type === 'internal' ? (
                    <Link
                      href={announcement.actionButton.url}
                      className="inline-flex items-center text-sm font-medium hover:underline"
                    >
                      {announcement.actionButton.label}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  ) : (
                    <a
                      href={announcement.actionButton.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium hover:underline"
                    >
                      {announcement.actionButton.label}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            {announcement.isDismissible && (
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 ml-4 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for header
export function CompactAnnouncementBanner({ announcement, onDismiss }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.(announcement.id)
  }

  if (!isVisible) return null

  return (
    <div className={`
      border-b px-4 py-2 text-center text-sm
      ${getAnnouncementColor(announcement.type)}
      animate-slide-down
    `}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <span role="img" aria-label="Announcement">
            {getAnnouncementIcon(announcement.type)}
          </span>
          <span className="font-medium truncate">
            {announcement.title}
          </span>
          {announcement.actionButton && (
            <>
              <span className="hidden sm:inline">-</span>
              {announcement.actionButton.type === 'internal' ? (
                <Link
                  href={announcement.actionButton.url}
                  className="font-medium hover:underline hidden sm:inline"
                >
                  {announcement.actionButton.label}
                </Link>
              ) : (
                <a
                  href={announcement.actionButton.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline hidden sm:inline"
                >
                  {announcement.actionButton.label}
                </a>
              )}
            </>
          )}
        </div>

        {announcement.isDismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 ml-2 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}
