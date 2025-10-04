'use client'

import { useEffect, useState, useRef } from 'react'
import { OnboardingTour, OnboardingStep, OnboardingPosition } from '@nekostack/types'
import { X, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

interface TourOverlayProps {
  tour: OnboardingTour
  isVisible: boolean
  onComplete: () => void
  onSkip: () => void
  onClose: () => void
}

export function TourOverlay({ tour, isVisible, onComplete, onSkip, onClose }: TourOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const overlayRef = useRef<HTMLDivElement>(null)
  const { featureUsed } = useAnalytics()

  const currentStepData = tour.steps[currentStep]
  const isLastStep = currentStep === tour.steps.length - 1
  const isFirstStep = currentStep === 0

  // Find and highlight target element
  useEffect(() => {
    if (!isVisible || !currentStepData) return

    const findTarget = () => {
      const element = document.querySelector(currentStepData.target) as HTMLElement
      if (element) {
        setTargetElement(element)
        
        // Calculate tooltip position
        const rect = element.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
        
        let top = 0
        let left = 0
        
        switch (currentStepData.position) {
          case OnboardingPosition.TOP:
            top = rect.top + scrollTop - 20
            left = rect.left + scrollLeft + rect.width / 2
            break
          case OnboardingPosition.BOTTOM:
            top = rect.bottom + scrollTop + 20
            left = rect.left + scrollLeft + rect.width / 2
            break
          case OnboardingPosition.LEFT:
            top = rect.top + scrollTop + rect.height / 2
            left = rect.left + scrollLeft - 20
            break
          case OnboardingPosition.RIGHT:
            top = rect.top + scrollTop + rect.height / 2
            left = rect.right + scrollLeft + 20
            break
          case OnboardingPosition.CENTER:
            top = window.innerHeight / 2 + scrollTop
            left = window.innerWidth / 2 + scrollLeft
            break
        }
        
        setTooltipPosition({ top, left })
        
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        })
      }
    }

    // Try to find target immediately, then retry after a short delay
    findTarget()
    const timeout = setTimeout(findTarget, 100)
    
    return () => clearTimeout(timeout)
  }, [currentStep, currentStepData, isVisible])

  // Track tour interactions
  useEffect(() => {
    if (isVisible && currentStepData) {
      featureUsed('onboarding_step_viewed', {
        tourId: tour.id,
        stepId: currentStepData.id,
        stepNumber: currentStep + 1,
        totalSteps: tour.steps.length
      })
    }
  }, [currentStep, currentStepData, isVisible, tour.id, tour.steps.length, featureUsed])

  const handleNext = () => {
    if (isLastStep) {
      handleComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    featureUsed('onboarding_tour_skipped', {
      tourId: tour.id,
      stepId: currentStepData?.id,
      stepNumber: currentStep + 1,
      totalSteps: tour.steps.length
    })
    onSkip()
  }

  const handleComplete = () => {
    featureUsed('onboarding_tour_completed', {
      tourId: tour.id,
      totalSteps: tour.steps.length
    })
    onComplete()
  }

  const handleClose = () => {
    featureUsed('onboarding_tour_closed', {
      tourId: tour.id,
      stepId: currentStepData?.id,
      stepNumber: currentStep + 1,
      totalSteps: tour.steps.length
    })
    onClose()
  }

  const handleAction = () => {
    if (currentStepData.action) {
      featureUsed('onboarding_action_clicked', {
        tourId: tour.id,
        stepId: currentStepData.id,
        actionType: currentStepData.action.type
      })
      
      if (currentStepData.action.url) {
        window.location.href = currentStepData.action.url
      } else if (currentStepData.action.callback) {
        currentStepData.action.callback()
      }
    }
  }

  if (!isVisible || !currentStepData) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Highlight for target element */}
      {targetElement && currentStepData.target !== 'body' && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - 4,
            left: targetElement.getBoundingClientRect().left + window.pageXOffset - 4,
            width: targetElement.getBoundingClientRect().width + 8,
            height: targetElement.getBoundingClientRect().height + 8,
            border: '2px solid hsl(var(--primary))',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            animation: 'pulse 2s infinite'
          }}
        />
      )}
      
      {/* Tooltip */}
      <div
        className={`
          fixed z-[10000] bg-popover border rounded-lg shadow-lg p-6 max-w-sm animate-slide-down
          ${currentStepData.position === OnboardingPosition.CENTER ? 'transform -translate-x-1/2 -translate-y-1/2' : ''}
          ${currentStepData.position === OnboardingPosition.TOP ? 'transform -translate-x-1/2 -translate-y-full' : ''}
          ${currentStepData.position === OnboardingPosition.BOTTOM ? 'transform -translate-x-1/2' : ''}
          ${currentStepData.position === OnboardingPosition.LEFT ? 'transform -translate-x-full -translate-y-1/2' : ''}
          ${currentStepData.position === OnboardingPosition.RIGHT ? 'transform -translate-y-1/2' : ''}
        `}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        {/* Content */}
        <div className="pr-6">
          <h3 className="font-semibold text-lg mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {currentStepData.content}
          </p>
          
          {/* Action button */}
          {currentStepData.action && (
            <button
              onClick={handleAction}
              className="w-full mb-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
            >
              {currentStepData.action.label}
            </button>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {/* Step indicator */}
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {tour.steps.length}
            </span>
            
            {/* Progress dots */}
            <div className="flex space-x-1">
              {tour.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-primary' 
                      : index < currentStep 
                        ? 'bg-primary/60' 
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Skip button */}
            {currentStepData.showSkip && (
              <button
                onClick={handleSkip}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <SkipForward className="h-4 w-4 mr-1" />
                Skip tour
              </button>
            )}
            
            {/* Navigation buttons */}
            <div className="flex space-x-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
