import { 
  OnboardingTour, 
  OnboardingStep, 
  OnboardingPosition, 
  OnboardingAudience, 
  OnboardingTriggerType,
  OnboardingActionType 
} from '@nekostack/types'

export const welcomeTour: OnboardingTour = {
  id: 'welcome-tour',
  name: 'Welcome to NekoStack',
  description: 'Get started with NekoStack and discover all the amazing tools available',
  isActive: true,
  targetAudience: OnboardingAudience.NEW_USERS,
  triggers: [
    {
      type: OnboardingTriggerType.FIRST_VISIT,
      delay: 2000 // 2 seconds after page load
    }
  ],
  steps: [
    {
      id: 'welcome',
      title: '👋 Welcome to NekoStack!',
      content: 'We\'re excited to have you here! NekoStack is your all-in-one productivity suite with 7 powerful tools to help you get things done.',
      target: 'body',
      position: OnboardingPosition.CENTER,
      showSkip: true
    },
    {
      id: 'navigation',
      title: '🧭 Navigation',
      content: 'Use the main navigation to explore different sections. You can access your dashboard, browse tools, and manage your profile.',
      target: '[data-tour="main-nav"]',
      position: OnboardingPosition.BOTTOM,
      showSkip: true
    },
    {
      id: 'tools-grid',
      title: '🔧 Discover Tools',
      content: 'Browse our collection of productivity tools. Each tool is designed to solve specific problems and boost your productivity.',
      target: '[data-tour="tools-section"]',
      position: OnboardingPosition.TOP,
      action: {
        type: OnboardingActionType.NAVIGATE,
        label: 'Browse Tools',
        url: '/tools'
      },
      showSkip: true
    },
    {
      id: 'search',
      title: '🔍 Search & Filter',
      content: 'Use the search bar to quickly find tools by name or description. You can also filter by categories to narrow down your options.',
      target: '[data-tour="search-input"]',
      position: OnboardingPosition.BOTTOM,
      showSkip: true
    },
    {
      id: 'favorites',
      title: '⭐ Favorites',
      content: 'Click the star icon on any tool to add it to your favorites. This makes it easy to access your most-used tools quickly.',
      target: '[data-tour="favorite-button"]',
      position: OnboardingPosition.LEFT,
      showSkip: true
    },
    {
      id: 'profile',
      title: '👤 Your Profile',
      content: 'Access your profile to view usage statistics, manage favorites, and upgrade your subscription for unlimited access.',
      target: '[data-tour="profile-dropdown"]',
      position: OnboardingPosition.BOTTOM,
      showSkip: true
    },
    {
      id: 'theme-toggle',
      title: '🌙 Dark Mode',
      content: 'Toggle between light and dark themes to match your preference. Your choice will be remembered across sessions.',
      target: '[data-tour="theme-toggle"]',
      position: OnboardingPosition.BOTTOM,
      isOptional: true,
      showSkip: true
    },
    {
      id: 'complete',
      title: '🎉 You\'re All Set!',
      content: 'You\'ve completed the tour! Start exploring NekoStack and discover how our tools can boost your productivity. You can replay this tour anytime from your profile settings.',
      target: 'body',
      position: OnboardingPosition.CENTER,
      action: {
        type: OnboardingActionType.NAVIGATE,
        label: 'Start Exploring',
        url: '/tools'
      }
    }
  ]
}

export const toolsTour: OnboardingTour = {
  id: 'tools-tour',
  name: 'Tools Overview',
  description: 'Learn how to use the tools page effectively',
  isActive: true,
  targetAudience: OnboardingAudience.ALL_USERS,
  triggers: [
    {
      type: OnboardingTriggerType.PAGE_LOAD,
      condition: '/tools',
      delay: 1000
    }
  ],
  steps: [
    {
      id: 'tools-grid',
      title: '🔧 Tools Grid',
      content: 'Here you can see all available tools. Each card shows the tool name, description, usage statistics, and rating.',
      target: '[data-tour="tools-grid"]',
      position: OnboardingPosition.TOP,
      showSkip: true
    },
    {
      id: 'filters',
      title: '🎛️ Filters',
      content: 'Use filters to find exactly what you need. Filter by category, premium status, or new tools.',
      target: '[data-tour="filters-sidebar"]',
      position: OnboardingPosition.RIGHT,
      showSkip: true
    },
    {
      id: 'tool-card',
      title: '📋 Tool Cards',
      content: 'Click on any tool card to start using it. You can also favorite tools for quick access later.',
      target: '[data-tour="tool-card"]:first-child',
      position: OnboardingPosition.TOP,
      showSkip: true
    }
  ]
}

export const dashboardTour: OnboardingTour = {
  id: 'dashboard-tour',
  name: 'Dashboard Features',
  description: 'Explore your personal dashboard',
  isActive: true,
  targetAudience: OnboardingAudience.ALL_USERS,
  triggers: [
    {
      type: OnboardingTriggerType.PAGE_LOAD,
      condition: '/profile',
      delay: 1000
    }
  ],
  steps: [
    {
      id: 'usage-stats',
      title: '📊 Usage Statistics',
      content: 'Track your monthly usage and see how close you are to your quota limits.',
      target: '[data-tour="usage-dashboard"]',
      position: OnboardingPosition.TOP,
      showSkip: true
    },
    {
      id: 'recent-activity',
      title: '🕒 Recent Activity',
      content: 'See your recent tool usage and activity history.',
      target: '[data-tour="recent-activity"]',
      position: OnboardingPosition.LEFT,
      showSkip: true
    },
    {
      id: 'favorites-section',
      title: '⭐ Quick Favorites',
      content: 'Access your favorite tools quickly from your dashboard.',
      target: '[data-tour="favorites-section"]',
      position: OnboardingPosition.LEFT,
      showSkip: true
    }
  ]
}

export const allTours = [welcomeTour, toolsTour, dashboardTour]

export const getTourForPage = (pathname: string): OnboardingTour | null => {
  if (pathname === '/tools') return toolsTour
  if (pathname === '/profile') return dashboardTour
  if (pathname === '/') return welcomeTour
  return null
}
