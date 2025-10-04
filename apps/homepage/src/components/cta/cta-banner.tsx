'use client'

import { useState } from 'react'
import { CTABanner, CTAActionType, CTALayout } from '@nekostack/types'
import { X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { getCTAThemeClasses, getCTAActionClasses } from '@/lib/mock-cta'
import { useAnalytics } from '@/lib/analytics'

interface CTABannerProps {
  cta: CTABanner
  onDismiss?: (ctaId: string) => void
  onAction?: (ctaId: string, actionId: string) => void
}

export function CTABannerComponent({ cta, onDismiss, onAction }: CTABannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { buttonClicked } = useAnalytics()

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.(cta.id)
    buttonClicked('cta_dismissed', 'cta_banner', { ctaId: cta.id })
  }

  const handleAction = (actionId: string, actionType: CTAActionType, url?: string) => {
    onAction?.(cta.id, actionId)
    buttonClicked('cta_action_clicked', 'cta_banner', { 
      ctaId: cta.id, 
      actionId, 
      actionType 
    })

    if (actionType === CTAActionType.DISMISS) {
      handleDismiss()
    } else if (actionType === CTAActionType.EXTERNAL_LINK && url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (!isVisible) return null

  const themeClasses = getCTAThemeClasses(cta.design.theme)
  const animationClass = cta.design.animation ? `animate-${cta.design.animation.replace('_', '-')}` : ''

  // Render based on layout
  switch (cta.design.layout) {
    case CTALayout.BANNER:
      return (
        <div className={`
          border rounded-lg p-4 mb-4 relative overflow-hidden
          ${themeClasses}
          ${animationClass}
          ${cta.design.gradient ? 'bg-gradient-to-r' : ''}
        `}>
          <div className="flex items-center space-x-4">
            {/* Icon */}
            {cta.design.showIcon && cta.design.icon && (
              <div className="flex-shrink-0">
                <span className="text-2xl" role="img" aria-label="CTA Icon">
                  {cta.design.icon}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">
                    {cta.title}
                  </h4>
                  {cta.subtitle && (
                    <p className="text-sm opacity-80 mb-1">
                      {cta.subtitle}
                    </p>
                  )}
                  <p className="text-sm opacity-90 leading-relaxed">
                    {cta.description}
                  </p>
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 ml-4 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4">
                {cta.actions.map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    onAction={handleAction}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case CTALayout.CARD:
      return (
        <div className={`
          rounded-lg border p-6 relative overflow-hidden max-w-md mx-auto
          ${themeClasses}
          ${animationClass}
        `}>
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="text-center">
            {cta.design.showIcon && cta.design.icon && (
              <div className="text-4xl mb-4">
                {cta.design.icon}
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2">
              {cta.title}
            </h3>
            
            {cta.subtitle && (
              <p className="text-sm opacity-80 mb-2">
                {cta.subtitle}
              </p>
            )}
            
            <p className="text-sm opacity-90 mb-6 leading-relaxed">
              {cta.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {cta.actions.map((action) => (
                <ActionButton
                  key={action.id}
                  action={action}
                  onAction={handleAction}
                  fullWidth
                />
              ))}
            </div>
          </div>
        </div>
      )

    case CTALayout.TOAST:
      return (
        <div className={`
          fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border p-4 shadow-lg
          ${themeClasses}
          ${animationClass}
        `}>
          <div className="flex items-start space-x-3">
            {cta.design.showIcon && cta.design.icon && (
              <span className="text-lg flex-shrink-0">
                {cta.design.icon}
              </span>
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm mb-1">
                {cta.title}
              </h4>
              <p className="text-xs opacity-90 mb-3">
                {cta.description}
              </p>
              
              <div className="flex gap-2">
                {cta.actions.map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    onAction={handleAction}
                    compact
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )

    default:
      return null
  }
}

// Action Button Component
interface ActionButtonProps {
  action: any // CTAAction type
  onAction: (actionId: string, actionType: CTAActionType, url?: string) => void
  fullWidth?: boolean
  compact?: boolean
}

function ActionButton({ action, onAction, fullWidth = false, compact = false }: ActionButtonProps) {
  const baseClasses = getCTAActionClasses(action.style)
  const sizeClasses = compact ? 'h-7 px-2 text-xs' : 'h-9 px-4 text-sm'
  const widthClasses = fullWidth ? 'w-full' : ''

  const handleClick = () => {
    onAction(action.id, action.type, action.url)
  }

  if (action.type === CTAActionType.NAVIGATE && action.url) {
    return (
      <Link
        href={action.url}
        className={`${baseClasses} ${sizeClasses} ${widthClasses}`}
        onClick={() => onAction(action.id, action.type, action.url)}
      >
        {action.label}
      </Link>
    )
  }

  if (action.type === CTAActionType.EXTERNAL_LINK) {
    return (
      <button
        onClick={handleClick}
        className={`${baseClasses} ${sizeClasses} ${widthClasses}`}
      >
        {action.label}
        <ExternalLink className="ml-1 h-3 w-3" />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${sizeClasses} ${widthClasses}`}
    >
      {action.label}
    </button>
  )
}
