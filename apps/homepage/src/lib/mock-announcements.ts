import { 
  Announcement, 
  AnnouncementType, 
  AnnouncementPriority, 
  TargetAudience,
  SystemStatus,
  ServiceStatus 
} from '@nekostack/types'

export const mockAnnouncements: Announcement[] = [
  {
    id: 'announcement-1',
    title: '🎉 New Tool: Resume Builder Now Available!',
    message: 'Create professional resumes with our new Resume Builder tool. Choose from modern templates and export to PDF.',
    type: AnnouncementType.FEATURE,
    priority: AnnouncementPriority.MEDIUM,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    isActive: true,
    isDismissible: true,
    targetAudience: TargetAudience.ALL,
    actionButton: {
      label: 'Try Resume Builder',
      url: '/tools/resume-builder',
      type: 'internal'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 'announcement-2',
    title: '⚡ Performance Improvements',
    message: 'We\'ve made significant performance improvements across all tools. Experience faster loading times and smoother interactions.',
    type: AnnouncementType.UPDATE,
    priority: AnnouncementPriority.LOW,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    isActive: true,
    isDismissible: true,
    targetAudience: TargetAudience.ALL,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
  },
  {
    id: 'announcement-3',
    title: '🔧 Scheduled Maintenance',
    message: 'We\'ll be performing scheduled maintenance on Sunday, Dec 8th from 2:00 AM - 4:00 AM UTC. Some services may be temporarily unavailable.',
    type: AnnouncementType.MAINTENANCE,
    priority: AnnouncementPriority.HIGH,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    isActive: true,
    isDismissible: true,
    targetAudience: TargetAudience.ALL,
    actionButton: {
      label: 'View Status Page',
      url: '/status',
      type: 'internal'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
  },
  {
    id: 'announcement-4',
    title: '🎁 Black Friday Sale - 50% Off Pro Plans!',
    message: 'Limited time offer: Get 50% off all Pro plans. Upgrade now and unlock unlimited usage and premium features.',
    type: AnnouncementType.PROMOTION,
    priority: AnnouncementPriority.HIGH,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    isActive: true,
    isDismissible: true,
    targetAudience: TargetAudience.FREE_USERS,
    actionButton: {
      label: 'Upgrade Now',
      url: '/billing?promo=blackfriday50',
      type: 'internal'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
  }
]

export const getAnnouncementIcon = (type: AnnouncementType): string => {
  switch (type) {
    case AnnouncementType.INFO:
      return 'ℹ️'
    case AnnouncementType.SUCCESS:
      return '✅'
    case AnnouncementType.WARNING:
      return '⚠️'
    case AnnouncementType.ERROR:
      return '❌'
    case AnnouncementType.UPDATE:
      return '🔄'
    case AnnouncementType.MAINTENANCE:
      return '🔧'
    case AnnouncementType.FEATURE:
      return '🎉'
    case AnnouncementType.PROMOTION:
      return '🎁'
    default:
      return 'ℹ️'
  }
}

export const getAnnouncementColor = (type: AnnouncementType): string => {
  switch (type) {
    case AnnouncementType.INFO:
      return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
    case AnnouncementType.SUCCESS:
      return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
    case AnnouncementType.WARNING:
      return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
    case AnnouncementType.ERROR:
      return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
    case AnnouncementType.UPDATE:
      return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200'
    case AnnouncementType.MAINTENANCE:
      return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-200'
    case AnnouncementType.FEATURE:
      return 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-200'
    case AnnouncementType.PROMOTION:
      return 'bg-pink-50 border-pink-200 text-pink-800 dark:bg-pink-900/20 dark:border-pink-800 dark:text-pink-200'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200'
  }
}

export const getStatusColor = (status: ServiceStatus): string => {
  switch (status) {
    case ServiceStatus.OPERATIONAL:
      return 'text-green-600 dark:text-green-400'
    case ServiceStatus.DEGRADED:
      return 'text-yellow-600 dark:text-yellow-400'
    case ServiceStatus.PARTIAL_OUTAGE:
      return 'text-orange-600 dark:text-orange-400'
    case ServiceStatus.MAJOR_OUTAGE:
      return 'text-red-600 dark:text-red-400'
    case ServiceStatus.MAINTENANCE:
      return 'text-blue-600 dark:text-blue-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}
