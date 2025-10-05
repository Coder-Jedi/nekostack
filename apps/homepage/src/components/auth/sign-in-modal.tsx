'use client'

import { X, LogIn, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { useUserStore } from '@/stores/user-store'
import { mockUserProfile, mockRecentActivity } from '@/lib/mock-user-data'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'premium_tool' | 'favorite' | 'save_history' | 'manual'
  toolName?: string
}

export function SignInModal({ isOpen, onClose, trigger, toolName }: SignInModalProps) {
  const { setUser, setRecentActivity } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'premium_tool':
        return `Sign in to access ${toolName || 'this premium tool'}`
      case 'favorite':
        return 'Sign in to save your favorite tools'
      case 'save_history':
        return 'Sign in to save your work history'
      default:
        return 'Sign in to unlock all features'
    }
  }

  const handleMockSignIn = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser(mockUserProfile)
      setRecentActivity(mockRecentActivity)
      setIsLoading(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome to NekoStack
        </h2>
        
        {/* Trigger Message */}
        <p className="text-center text-muted-foreground mb-8">
          {getTriggerMessage()}
        </p>

        {/* Mock Sign In Button */}
        <button
          onClick={handleMockSignIn}
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Sign In (Demo)</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Future Auth Options (Disabled) */}
        <div className="space-y-3 opacity-50">
          <button
            disabled
            className="w-full py-3 px-6 rounded-lg border-2 border-input font-medium transition-colors cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Mail className="h-5 w-5" />
            <span>Continue with Email</span>
          </button>
          
          <button
            disabled
            className="w-full py-3 px-6 rounded-lg border-2 border-input font-medium transition-colors cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Currently using demo authentication. Real authentication coming soon.
        </p>
      </div>
    </div>
  )
}
