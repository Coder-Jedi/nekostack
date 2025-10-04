import { 
  UserProfile, 
  SubscriptionPlan, 
  SubscriptionStatus, 
  RecentActivity, 
  ActivityAction 
} from '@nekostack/types'

export const mockUserProfile: UserProfile = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  subscription: {
    plan: SubscriptionPlan.PRO,
    status: SubscriptionStatus.ACTIVE,
    isActive: true,
    daysRemaining: 23
  },
  usage: {
    toolsUsed: 47,
    quotaUsed: 47,
    quotaLimit: 100,
    percentageUsed: 47
  },
  stats: {
    totalToolsUsed: 234,
    favoriteTools: 5,
    joinedDate: new Date('2024-01-15')
  }
}

export const mockRecentActivity: RecentActivity[] = [
  {
    id: 'activity-1',
    userId: 'user-123',
    toolId: 'image-compressor',
    toolName: 'Image Compressor',
    action: ActivityAction.TOOL_USED,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    metadata: { filesProcessed: 3, totalSize: '2.4MB' }
  },
  {
    id: 'activity-2',
    userId: 'user-123',
    toolId: 'qr-generator',
    toolName: 'QR Generator',
    action: ActivityAction.TOOL_USED,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    metadata: { qrCodesGenerated: 5 }
  },
  {
    id: 'activity-3',
    userId: 'user-123',
    toolId: 'signature-creator',
    toolName: 'Signature Creator',
    action: ActivityAction.FAVORITE_ADDED,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
  },
  {
    id: 'activity-4',
    userId: 'user-123',
    toolId: 'markdown-editor',
    toolName: 'Markdown Editor',
    action: ActivityAction.TOOL_USED,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    metadata: { documentsCreated: 2 }
  },
  {
    id: 'activity-5',
    userId: 'user-123',
    toolId: 'unit-converter',
    toolName: 'Unit Converter',
    action: ActivityAction.TOOL_USED,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    metadata: { conversions: 12 }
  }
]

// Mock user for free plan
export const mockFreeUser: UserProfile = {
  id: 'user-456',
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  subscription: {
    plan: SubscriptionPlan.FREE,
    status: SubscriptionStatus.ACTIVE,
    isActive: true
  },
  usage: {
    toolsUsed: 8,
    quotaUsed: 8,
    quotaLimit: 10,
    percentageUsed: 80
  },
  stats: {
    totalToolsUsed: 23,
    favoriteTools: 3,
    joinedDate: new Date('2024-11-01')
  }
}

export const getSubscriptionBadgeColor = (plan: SubscriptionPlan) => {
  switch (plan) {
    case SubscriptionPlan.FREE:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    case SubscriptionPlan.PRO:
      return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    case SubscriptionPlan.ENTERPRISE:
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }
}

export const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

export const getActivityIcon = (action: ActivityAction): string => {
  switch (action) {
    case ActivityAction.TOOL_USED:
      return '🔧'
    case ActivityAction.FILE_UPLOADED:
      return '📤'
    case ActivityAction.FILE_DOWNLOADED:
      return '📥'
    case ActivityAction.FAVORITE_ADDED:
      return '⭐'
    case ActivityAction.FAVORITE_REMOVED:
      return '💔'
    case ActivityAction.SUBSCRIPTION_CHANGED:
      return '💳'
    default:
      return '📝'
  }
}
