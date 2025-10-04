import { 
  Advertisement, 
  AdType, 
  AdFormat, 
  AdPlacement,
  AdZone,
  UserAdPreferences
} from '@nekostack/types'

export const mockAdvertisements: Advertisement[] = [
  {
    id: 'ad-001',
    title: 'Boost Your Productivity with Premium Tools',
    description: 'Upgrade to Pro and unlock unlimited access to all tools',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&h=250&fit=crop',
    clickUrl: '/billing?plan=pro',
    type: AdType.NATIVE,
    format: AdFormat.RECTANGLE,
    placement: AdPlacement.SIDEBAR_TOP,
    priority: 10,
    targeting: {
      userPlans: ['free'],
      excludeSubscribers: true
    },
    schedule: {
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
    },
    isActive: true,
    impressions: 12547,
    clicks: 389,
    budget: {
      totalBudget: 1000,
      spentBudget: 245.50,
      costPerClick: 0.50,
      costPerImpression: 0.02,
      currency: 'USD'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: 'ad-002',
    title: 'New Image Compressor Features',
    description: 'Compress images up to 90% without quality loss',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=728&h=90&fit=crop',
    clickUrl: '/tools/image-compressor',
    type: AdType.BANNER,
    format: AdFormat.LEADERBOARD,
    placement: AdPlacement.CONTENT_TOP,
    priority: 8,
    targeting: {
      interests: ['image-processing', 'design', 'photography']
    },
    schedule: {
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    },
    isActive: true,
    impressions: 8234,
    clicks: 412,
    budget: {
      totalBudget: 500,
      spentBudget: 164.68,
      costPerClick: 0.40,
      costPerImpression: 0.02,
      currency: 'USD'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
  },
  {
    id: 'ad-003',
    title: 'Try Our Resume Builder',
    description: 'Create professional resumes in minutes',
    type: AdType.TEXT,
    format: AdFormat.RESPONSIVE,
    clickUrl: '/tools/resume-builder',
    placement: AdPlacement.BETWEEN_CONTENT,
    priority: 6,
    targeting: {
      interests: ['career', 'job-search', 'professional']
    },
    schedule: {
      startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    },
    isActive: true,
    impressions: 5621,
    clicks: 234,
    budget: {
      totalBudget: 300,
      spentBudget: 93.60,
      costPerClick: 0.40,
      costPerImpression: 0.02,
      currency: 'USD'
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
  }
]

export const mockAdZones: AdZone[] = [
  {
    id: 'zone-sidebar-top',
    name: 'Sidebar Top',
    placement: AdPlacement.SIDEBAR_TOP,
    format: AdFormat.RECTANGLE,
    isActive: true,
    currentAd: mockAdvertisements[0],
    fallbackContent: 'Upgrade to Pro for an ad-free experience',
    refreshInterval: 30,
    maxAdsPerSession: 10
  },
  {
    id: 'zone-content-top',
    name: 'Content Top Banner',
    placement: AdPlacement.CONTENT_TOP,
    format: AdFormat.LEADERBOARD,
    isActive: true,
    currentAd: mockAdvertisements[1],
    refreshInterval: 0, // No auto-refresh
    maxAdsPerSession: 3
  },
  {
    id: 'zone-between-content',
    name: 'Between Content',
    placement: AdPlacement.BETWEEN_CONTENT,
    format: AdFormat.RESPONSIVE,
    isActive: true,
    currentAd: mockAdvertisements[2],
    fallbackContent: 'Sponsored Content',
    refreshInterval: 0,
    maxAdsPerSession: 5
  }
]

export const mockUserAdPreferences: UserAdPreferences = {
  userId: 'user-1',
  hideAds: false, // Set to true for premium users
  adPersonalization: true,
  viewedAds: ['ad-001', 'ad-002'],
  clickedAds: ['ad-001'],
  dismissedAds: [],
  lastAdView: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
}

export const shouldShowAds = (userPlan: string, userAdPreferences?: UserAdPreferences): boolean => {
  // Don't show ads to premium users
  if (userPlan !== 'free') return false
  
  // Check user preferences
  if (userAdPreferences?.hideAds) return false
  
  return true
}

export const getAdForPlacement = (
  placement: AdPlacement,
  userPlan: string,
  viewedAds: string[] = []
): Advertisement | null => {
  if (!shouldShowAds(userPlan)) return null
  
  // Filter ads by placement and targeting
  const eligibleAds = mockAdvertisements.filter(ad => {
    // Check if active
    if (!ad.isActive) return false
    
    // Check placement
    if (ad.placement !== placement) return false
    
    // Check schedule
    const now = new Date()
    if (ad.schedule.startDate > now) return false
    if (ad.schedule.endDate && ad.schedule.endDate < now) return false
    
    // Check targeting
    if (ad.targeting.userPlans && !ad.targeting.userPlans.includes(userPlan)) {
      return false
    }
    
    // Don't show recently viewed ads
    if (viewedAds.includes(ad.id)) return false
    
    return true
  })
  
  // Sort by priority and return highest
  if (eligibleAds.length === 0) return null
  
  return eligibleAds.sort((a, b) => b.priority - a.priority)[0]
}

export const trackAdImpression = (adId: string, placement: AdPlacement) => {
  // In a real app, this would send tracking data to analytics
  console.log(`Ad impression tracked: ${adId} at ${placement}`)
}

export const trackAdClick = (adId: string, placement: AdPlacement) => {
  // In a real app, this would send tracking data to analytics
  console.log(`Ad click tracked: ${adId} at ${placement}`)
}
