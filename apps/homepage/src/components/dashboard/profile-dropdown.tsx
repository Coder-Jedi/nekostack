'use client'

import { useState, useRef, useEffect } from 'react'
import { UserProfile, SubscriptionPlan } from '@nekostack/types'
import { 
  User, 
  Settings, 
  CreditCard, 
  Star, 
  BarChart3, 
  HelpCircle, 
  LogOut, 
  Crown,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { getSubscriptionBadgeColor } from '@/lib/mock-user-data'

interface ProfileDropdownProps {
  user: UserProfile
  onLogout: () => void
}

export function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSubscriptionLabel = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return 'Free'
      case SubscriptionPlan.PRO:
        return 'Pro'
      case SubscriptionPlan.ENTERPRISE:
        return 'Enterprise'
      default:
        return 'Free'
    }
  }

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
      description: 'Manage your account'
    },
    {
      icon: Star,
      label: 'Favorites',
      href: '/favorites',
      description: 'Your favorite tools'
    },
    {
      icon: BarChart3,
      label: 'Usage & Analytics',
      href: '/analytics',
      description: 'View your usage stats'
    },
    {
      icon: CreditCard,
      label: 'Billing',
      href: '/billing',
      description: 'Manage subscription'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      description: 'Preferences & privacy'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      href: '/help',
      description: 'Get help and support'
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          )}
          
          {/* Pro badge indicator */}
          {user.subscription.plan !== SubscriptionPlan.FREE && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="h-2 w-2 text-white" />
            </div>
          )}
        </div>

        {/* User info - hidden on mobile */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {getSubscriptionLabel(user.subscription.plan)}
          </p>
        </div>

        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border rounded-lg shadow-lg z-50 animate-slide-down">
          {/* User Info Header */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                )}
                
                {user.subscription.plan !== SubscriptionPlan.FREE && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
                
                {/* Subscription badge */}
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getSubscriptionBadgeColor(user.subscription.plan)}`}>
                  {user.subscription.plan !== SubscriptionPlan.FREE && (
                    <Crown className="h-3 w-3 mr-1" />
                  )}
                  {getSubscriptionLabel(user.subscription.plan)} Plan
                </div>
              </div>
            </div>

            {/* Usage indicator */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Monthly usage</span>
                <span className="font-medium">
                  {user.usage.toolsUsed}/{user.usage.quotaLimit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min(user.usage.percentageUsed, 100)}%` }}
                />
              </div>
              {user.subscription.daysRemaining && (
                <p className="text-xs text-muted-foreground mt-1">
                  {user.subscription.daysRemaining} days remaining
                </p>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 hover:bg-accent transition-colors group"
              >
                <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t py-2">
            <button
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
              className="flex items-center w-full px-4 py-3 hover:bg-accent transition-colors group text-left"
            >
              <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-foreground mr-3" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Sign out
                </p>
                <p className="text-xs text-muted-foreground">
                  Sign out of your account
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
