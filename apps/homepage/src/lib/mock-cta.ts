import { 
  CTABanner, 
  CTAType, 
  CTAPriority, 
  CTAAudience, 
  CTATriggerType,
  CTAActionType,
  CTAActionStyle,
  CTALayout,
  CTATheme,
  CTAAnimation,
  CTAPosition 
} from '@nekostack/types'

export const mockCTABanners: CTABanner[] = [
  {
    id: 'upgrade-pro-cta',
    title: '🚀 Upgrade to Pro',
    subtitle: 'Unlock unlimited access',
    description: 'Get unlimited tool usage, premium features, and priority support. Perfect for power users and professionals.',
    type: CTAType.UPGRADE,
    priority: CTAPriority.HIGH,
    targetAudience: CTAAudience.FREE_USERS,
    triggers: [
      {
        type: CTATriggerType.USAGE_LIMIT,
        value: 80 // Show when 80% of quota is used
      }
    ],
    actions: [
      {
        id: 'upgrade-action',
        label: 'Upgrade Now',
        type: CTAActionType.NAVIGATE,
        url: '/billing?plan=pro',
        isPrimary: true,
        style: CTAActionStyle.PRIMARY
      },
      {
        id: 'learn-more-action',
        label: 'Learn More',
        type: CTAActionType.NAVIGATE,
        url: '/pricing',
        isPrimary: false,
        style: CTAActionStyle.OUTLINE
      }
    ],
    design: {
      layout: CTALayout.BANNER,
      theme: CTATheme.PREMIUM,
      showIcon: true,
      icon: '👑',
      gradient: true,
      animation: CTAAnimation.SLIDE_IN,
      position: CTAPosition.TOP
    },
    isActive: true,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 'new-feature-cta',
    title: '✨ New Feature: Resume Builder',
    description: 'Create professional resumes with our new Resume Builder tool. Try it now and land your dream job!',
    type: CTAType.FEATURE_PROMOTION,
    priority: CTAPriority.MEDIUM,
    targetAudience: CTAAudience.ALL,
    triggers: [
      {
        type: CTATriggerType.PAGE_LOAD,
        delay: 3000 // Show after 3 seconds
      }
    ],
    actions: [
      {
        id: 'try-feature-action',
        label: 'Try Resume Builder',
        type: CTAActionType.NAVIGATE,
        url: '/tools/resume-builder',
        isPrimary: true,
        style: CTAActionStyle.PRIMARY
      },
      {
        id: 'dismiss-action',
        label: 'Maybe Later',
        type: CTAActionType.DISMISS,
        isPrimary: false,
        style: CTAActionStyle.GHOST
      }
    ],
    design: {
      layout: CTALayout.CARD,
      theme: CTATheme.SUCCESS,
      showIcon: true,
      icon: '🎉',
      animation: CTAAnimation.FADE_IN,
      position: CTAPosition.CENTER
    },
    isActive: true,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
  },
  {
    id: 'feedback-cta',
    title: '💬 Help Us Improve',
    description: 'Share your feedback and help us make NekoStack even better. Your input matters!',
    type: CTAType.FEEDBACK,
    priority: CTAPriority.LOW,
    targetAudience: CTAAudience.POWER_USERS,
    triggers: [
      {
        type: CTATriggerType.FEATURE_USAGE,
        value: 10 // Show after using 10 different tools
      }
    ],
    actions: [
      {
        id: 'feedback-action',
        label: 'Give Feedback',
        type: CTAActionType.EXTERNAL_LINK,
        url: 'https://forms.gle/feedback',
        isPrimary: true,
        style: CTAActionStyle.PRIMARY
      }
    ],
    design: {
      layout: CTALayout.TOAST,
      theme: CTATheme.INFO,
      showIcon: true,
      icon: '💡',
      animation: CTAAnimation.SLIDE_IN,
      position: CTAPosition.BOTTOM
    },
    isActive: true,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
  },
  {
    id: 'holiday-promo-cta',
    title: '🎁 Holiday Special: 50% Off Pro',
    subtitle: 'Limited time offer',
    description: 'Celebrate the holidays with 50% off all Pro plans. Offer ends soon!',
    type: CTAType.SEASONAL,
    priority: CTAPriority.CRITICAL,
    targetAudience: CTAAudience.FREE_USERS,
    triggers: [
      {
        type: CTATriggerType.TIME_BASED,
        delay: 2000
      }
    ],
    actions: [
      {
        id: 'holiday-upgrade-action',
        label: 'Claim Offer',
        type: CTAActionType.NAVIGATE,
        url: '/billing?promo=holiday50',
        isPrimary: true,
        style: CTAActionStyle.PRIMARY
      }
    ],
    design: {
      layout: CTALayout.BANNER,
      theme: CTATheme.GRADIENT,
      showIcon: true,
      icon: '🎄',
      gradient: true,
      animation: CTAAnimation.BOUNCE,
      position: CTAPosition.TOP
    },
    isActive: true,
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
    impressionLimit: 1000,
    clickLimit: 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
]

export const getCTAThemeClasses = (theme: CTATheme): string => {
  switch (theme) {
    case CTATheme.SUCCESS:
      return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
    case CTATheme.WARNING:
      return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
    case CTATheme.ERROR:
      return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
    case CTATheme.INFO:
      return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
    case CTATheme.PREMIUM:
      return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-800 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800 dark:text-purple-200'
    case CTATheme.GRADIENT:
      return 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200 text-blue-800 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 dark:border-blue-800 dark:text-blue-200'
    default:
      return 'bg-card border text-card-foreground'
  }
}

export const getCTAActionClasses = (style: CTAActionStyle): string => {
  switch (style) {
    case CTAActionStyle.PRIMARY:
      return 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4'
    case CTAActionStyle.SECONDARY:
      return 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4'
    case CTAActionStyle.OUTLINE:
      return 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4'
    case CTAActionStyle.GHOST:
      return 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4'
    case CTAActionStyle.LINK:
      return 'text-sm font-medium text-primary hover:underline'
    default:
      return 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4'
  }
}
