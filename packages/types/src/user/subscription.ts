// Enhanced subscription type definitions

export interface SubscriptionPlan {
  id: string
  name: string
  displayName: string
  description: string
  price: PlanPrice
  features: PlanFeature[]
  limits: PlanLimits
  isPopular?: boolean
  isRecommended?: boolean
  billingCycles: BillingCycle[]
}

export interface PlanPrice {
  monthly: number
  yearly: number
  currency: string
  yearlyDiscount?: number
}

export interface PlanFeature {
  id: string
  name: string
  description: string
  included: boolean
  limit?: number
  unit?: string
}

export interface PlanLimits {
  toolsPerMonth: number
  storageLimit: number // in bytes
  apiRequestsPerMonth: number
  maxFileSize: number // in bytes
  concurrentProcessing: number
  prioritySupport: boolean
  customBranding: boolean
  apiAccess: boolean
}

export interface BillingCycle {
  interval: 'monthly' | 'yearly'
  price: number
  discount?: number
}

export interface BillingHistory {
  id: string
  userId: string
  subscriptionId: string
  amount: number
  currency: string
  status: PaymentStatus
  description: string
  invoiceUrl?: string
  paidAt?: Date
  dueDate: Date
  createdAt: Date
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export interface PaymentMethod {
  id: string
  userId: string
  type: PaymentMethodType
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: Date
}

export enum PaymentMethodType {
  CARD = 'card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto'
}

export interface SubscriptionUsage {
  subscriptionId: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  usage: UsageMetrics
  quotas: PlanLimits
  overages: OverageInfo[]
}

export interface UsageMetrics {
  toolsUsed: number
  storageUsed: number
  apiRequestsMade: number
  largestFileProcessed: number
  averageProcessingTime: number
}

export interface OverageInfo {
  metric: string
  limit: number
  used: number
  overage: number
  cost?: number
}

export interface SubscriptionChange {
  id: string
  subscriptionId: string
  fromPlan: string
  toPlan: string
  changeType: ChangeType
  effectiveDate: Date
  prorationAmount?: number
  reason?: string
  createdAt: Date
}

export enum ChangeType {
  UPGRADE = 'upgrade',
  DOWNGRADE = 'downgrade',
  CANCEL = 'cancel',
  REACTIVATE = 'reactivate',
  PAUSE = 'pause'
}
