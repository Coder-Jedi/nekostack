'use client'

import { X, LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  trigger?: 'premium_tool' | 'favorite' | 'save_history' | 'manual'
  toolName?: string
}

export function SignInModal({ isOpen, onClose, trigger, toolName }: SignInModalProps) {
  const router = useRouter()

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

  const handleSignIn = () => {
    onClose()
    router.push('/auth/signin')
  }

  const handleSignUp = () => {
    onClose()
    router.push('/auth/signup')
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

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={handleSignUp}
            className="w-full py-3 px-6 rounded-lg border-2 border-input font-medium hover:bg-accent transition-colors flex items-center justify-center space-x-2"
          >
            <span>Create Account</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}