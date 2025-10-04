import { 
  SubscriptionPlan, 
  BillingHistory, 
  PaymentMethod, 
  PaymentStatus, 
  PaymentMethodType,
  SubscriptionUsage,
  SubscriptionChange,
  ChangeType 
} from '@nekostack/types'

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'free',
    displayName: 'Free',
    description: 'Perfect for trying out NekoStack',
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'USD'
    },
    features: [
      {
        id: 'tools-limit',
        name: 'Tool Usage',
        description: 'Limited tool usage per month',
        included: true,
        limit: 50,
        unit: 'uses'
      },
      {
        id: 'storage',
        name: 'File Storage',
        description: 'Store your processed files',
        included: true,
        limit: 1,
        unit: 'GB'
      },
      {
        id: 'file-size',
        name: 'Max File Size',
        description: 'Maximum file size for processing',
        included: true,
        limit: 10,
        unit: 'MB'
      },
      {
        id: 'support',
        name: 'Community Support',
        description: 'Access to community forums',
        included: true
      },
      {
        id: 'api-access',
        name: 'API Access',
        description: 'Programmatic access to tools',
        included: false
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: '24/7 priority customer support',
        included: false
      }
    ],
    limits: {
      toolsPerMonth: 50,
      storageLimit: 1073741824, // 1GB
      apiRequestsPerMonth: 0,
      maxFileSize: 10485760, // 10MB
      concurrentProcessing: 1,
      prioritySupport: false,
      customBranding: false,
      apiAccess: false
    },
    billingCycles: [
      { interval: 'monthly', price: 0 },
      { interval: 'yearly', price: 0 }
    ]
  },
  {
    id: 'pro',
    name: 'pro',
    displayName: 'Pro',
    description: 'For professionals and power users',
    price: {
      monthly: 19,
      yearly: 190,
      currency: 'USD',
      yearlyDiscount: 17
    },
    features: [
      {
        id: 'tools-unlimited',
        name: 'Unlimited Tool Usage',
        description: 'Use all tools without limits',
        included: true
      },
      {
        id: 'storage',
        name: 'File Storage',
        description: 'Generous storage for your files',
        included: true,
        limit: 100,
        unit: 'GB'
      },
      {
        id: 'file-size',
        name: 'Max File Size',
        description: 'Process larger files',
        included: true,
        limit: 100,
        unit: 'MB'
      },
      {
        id: 'api-access',
        name: 'API Access',
        description: 'Full API access with 10k requests/month',
        included: true,
        limit: 10000,
        unit: 'requests'
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        description: '24/7 priority customer support',
        included: true
      },
      {
        id: 'advanced-features',
        name: 'Advanced Features',
        description: 'Batch processing, custom templates',
        included: true
      }
    ],
    limits: {
      toolsPerMonth: -1, // unlimited
      storageLimit: 107374182400, // 100GB
      apiRequestsPerMonth: 10000,
      maxFileSize: 104857600, // 100MB
      concurrentProcessing: 5,
      prioritySupport: true,
      customBranding: false,
      apiAccess: true
    },
    isPopular: true,
    billingCycles: [
      { interval: 'monthly', price: 19 },
      { interval: 'yearly', price: 190, discount: 17 }
    ]
  },
  {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'For teams and organizations',
    price: {
      monthly: 99,
      yearly: 990,
      currency: 'USD',
      yearlyDiscount: 17
    },
    features: [
      {
        id: 'everything-pro',
        name: 'Everything in Pro',
        description: 'All Pro features included',
        included: true
      },
      {
        id: 'storage-unlimited',
        name: 'Unlimited Storage',
        description: 'No storage limits',
        included: true
      },
      {
        id: 'file-size-unlimited',
        name: 'Unlimited File Size',
        description: 'Process files of any size',
        included: true
      },
      {
        id: 'api-unlimited',
        name: 'Unlimited API Access',
        description: 'No API request limits',
        included: true
      },
      {
        id: 'custom-branding',
        name: 'Custom Branding',
        description: 'White-label the platform',
        included: true
      },
      {
        id: 'dedicated-support',
        name: 'Dedicated Support',
        description: 'Dedicated account manager',
        included: true
      },
      {
        id: 'sla',
        name: '99.9% SLA',
        description: 'Guaranteed uptime',
        included: true
      }
    ],
    limits: {
      toolsPerMonth: -1, // unlimited
      storageLimit: -1, // unlimited
      apiRequestsPerMonth: -1, // unlimited
      maxFileSize: -1, // unlimited
      concurrentProcessing: 20,
      prioritySupport: true,
      customBranding: true,
      apiAccess: true
    },
    isRecommended: true,
    billingCycles: [
      { interval: 'monthly', price: 99 },
      { interval: 'yearly', price: 990, discount: 17 }
    ]
  }
]

export const mockBillingHistory: BillingHistory[] = [
  {
    id: 'inv-001',
    userId: 'user-1',
    subscriptionId: 'sub-001',
    amount: 19.00,
    currency: 'USD',
    status: PaymentStatus.PAID,
    description: 'Pro Plan - Monthly',
    invoiceUrl: '/invoices/inv-001.pdf',
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35)
  },
  {
    id: 'inv-002',
    userId: 'user-1',
    subscriptionId: 'sub-001',
    amount: 19.00,
    currency: 'USD',
    status: PaymentStatus.PAID,
    description: 'Pro Plan - Monthly',
    invoiceUrl: '/invoices/inv-002.pdf',
    paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 65)
  },
  {
    id: 'inv-003',
    userId: 'user-1',
    subscriptionId: 'sub-001',
    amount: 19.00,
    currency: 'USD',
    status: PaymentStatus.PENDING,
    description: 'Pro Plan - Monthly',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  }
]

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-001',
    userId: 'user-1',
    type: PaymentMethodType.CARD,
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
  },
  {
    id: 'pm-002',
    userId: 'user-1',
    type: PaymentMethodType.PAYPAL,
    isDefault: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60)
  }
]

export const mockSubscriptionUsage: SubscriptionUsage = {
  subscriptionId: 'sub-001',
  currentPeriodStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
  currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
  usage: {
    toolsUsed: 127,
    storageUsed: 15728640, // ~15MB
    apiRequestsMade: 2847,
    largestFileProcessed: 5242880, // 5MB
    averageProcessingTime: 2.3
  },
  quotas: subscriptionPlans[1].limits, // Pro plan limits
  overages: []
}

export const mockSubscriptionChanges: SubscriptionChange[] = [
  {
    id: 'change-001',
    subscriptionId: 'sub-001',
    fromPlan: 'free',
    toPlan: 'pro',
    changeType: ChangeType.UPGRADE,
    effectiveDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    prorationAmount: 0,
    reason: 'User upgrade',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90)
  }
]

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  if (bytes === -1) return 'Unlimited'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const formatNumber = (num: number): string => {
  if (num === -1) return 'Unlimited'
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

export const getUsagePercentage = (used: number, limit: number): number => {
  if (limit === -1) return 0 // unlimited
  if (limit === 0) return 100
  return Math.min((used / limit) * 100, 100)
}

export const getUsageColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-600 dark:text-red-400'
  if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}

export const getUsageBgColor = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 75) return 'bg-yellow-500'
  return 'bg-green-500'
}
