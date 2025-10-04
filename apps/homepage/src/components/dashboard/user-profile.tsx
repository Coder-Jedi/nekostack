'use client'

import { UserProfile, SubscriptionPlan } from '@nekostack/types'
import { Crown, User, Calendar } from 'lucide-react'
import { getSubscriptionBadgeColor } from '@/lib/mock-user-data'

interface UserProfileProps {
  user: UserProfile
  compact?: boolean
}

export function UserProfileComponent({ user, compact = false }: UserProfileProps) {
  const formatJoinDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

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

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
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

        {/* User info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email}
          </p>
        </div>

        {/* Subscription badge */}
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionBadgeColor(user.subscription.plan)}`}>
          {user.subscription.plan !== SubscriptionPlan.FREE && (
            <Crown className="h-3 w-3 mr-1" />
          )}
          {getSubscriptionLabel(user.subscription.plan)}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
          
          {/* Pro badge indicator */}
          {user.subscription.plan !== SubscriptionPlan.FREE && (
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* User details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {user.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>

          {/* Subscription info */}
          <div className="flex items-center space-x-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadgeColor(user.subscription.plan)}`}>
              {user.subscription.plan !== SubscriptionPlan.FREE && (
                <Crown className="h-4 w-4 mr-1" />
              )}
              {getSubscriptionLabel(user.subscription.plan)} Plan
            </div>
            
            {user.subscription.daysRemaining && (
              <span className="text-sm text-muted-foreground">
                {user.subscription.daysRemaining} days remaining
              </span>
            )}
          </div>

          {/* Member since */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Member since {formatJoinDate(user.stats.joinedDate)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {user.stats.totalToolsUsed}
          </div>
          <div className="text-sm text-muted-foreground">
            Tools Used
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {user.stats.favoriteTools}
          </div>
          <div className="text-sm text-muted-foreground">
            Favorites
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {Math.round((Date.now() - user.stats.joinedDate.getTime()) / (1000 * 60 * 60 * 24))}
          </div>
          <div className="text-sm text-muted-foreground">
            Days Active
          </div>
        </div>
      </div>
    </div>
  )
}
