'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/user-store'
import { 
  subscriptionPlans, 
  mockBillingHistory, 
  mockPaymentMethods, 
  mockSubscriptionUsage,
  formatCurrency,
  formatFileSize,
  formatNumber,
  getUsagePercentage,
  getUsageColor,
  getUsageBgColor
} from '@/lib/mock-subscription'
import { 
  SubscriptionPlan as SubscriptionPlanType, 
  BillingHistory, 
  PaymentMethod, 
  SubscriptionUsage,
  PaymentStatus 
} from '@nekostack/types'
import { 
  CreditCard, 
  Download, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Shield, 
  Crown,
  Check,
  X,
  ExternalLink,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useAnalytics } from '@/lib/analytics'

export default function BillingPage() {
  const { user } = useUserStore()
  const { buttonClicked } = useAnalytics()
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null)
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    // Initialize mock data
    setBillingHistory(mockBillingHistory)
    setPaymentMethods(mockPaymentMethods)
    setUsage(mockSubscriptionUsage)
  }, [])

  const currentPlan = subscriptionPlans.find(plan => plan.id === user?.subscription.plan) || subscriptionPlans[0]
  const isFreePlan = currentPlan.name === 'free'

  const handlePlanUpgrade = (planId: string) => {
    buttonClicked('plan_upgrade_clicked', 'billing_page', { 
      fromPlan: currentPlan.name, 
      toPlan: planId 
    })
    // In a real app, this would redirect to payment flow
    console.log(`Upgrading to ${planId}`)
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    buttonClicked('invoice_download', 'billing_page', { invoiceId })
    // In a real app, this would download the invoice
    console.log(`Downloading invoice ${invoiceId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view usage, and billing history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Plan */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Current Plan</h2>
              {!isFreePlan && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Next billing: {new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                {currentPlan.name === 'free' && <Zap className="h-6 w-6 text-primary" />}
                {currentPlan.name === 'pro' && <Crown className="h-6 w-6 text-primary" />}
                {currentPlan.name === 'enterprise' && <Shield className="h-6 w-6 text-primary" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{currentPlan.displayName}</h3>
                <p className="text-muted-foreground">{currentPlan.description}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold">
                  {formatCurrency(currentPlan.price[selectedBillingCycle])}
                </div>
                <div className="text-sm text-muted-foreground">
                  per {selectedBillingCycle === 'yearly' ? 'year' : 'month'}
                </div>
              </div>
            </div>

            {isFreePlan && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">Ready to upgrade?</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Unlock unlimited usage and premium features with Pro
                    </p>
                  </div>
                  <button
                    onClick={() => handlePlanUpgrade('pro')}
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}

            {/* Usage Overview */}
            {usage && (
              <div className="space-y-4">
                <h4 className="font-medium">Current Usage</h4>
                
                {/* Tools Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tools Used</span>
                    <span className={getUsageColor(getUsagePercentage(usage.usage.toolsUsed, usage.quotas.toolsPerMonth))}>
                      {formatNumber(usage.usage.toolsUsed)} / {formatNumber(usage.quotas.toolsPerMonth)}
                    </span>
                  </div>
                  {usage.quotas.toolsPerMonth !== -1 && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageBgColor(getUsagePercentage(usage.usage.toolsUsed, usage.quotas.toolsPerMonth))}`}
                        style={{ width: `${getUsagePercentage(usage.usage.toolsUsed, usage.quotas.toolsPerMonth)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Storage Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Storage Used</span>
                    <span className={getUsageColor(getUsagePercentage(usage.usage.storageUsed, usage.quotas.storageLimit))}>
                      {formatFileSize(usage.usage.storageUsed)} / {formatFileSize(usage.quotas.storageLimit)}
                    </span>
                  </div>
                  {usage.quotas.storageLimit !== -1 && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageBgColor(getUsagePercentage(usage.usage.storageUsed, usage.quotas.storageLimit))}`}
                        style={{ width: `${getUsagePercentage(usage.usage.storageUsed, usage.quotas.storageLimit)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* API Usage */}
                {usage.quotas.apiRequestsPerMonth > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>API Requests</span>
                      <span className={getUsageColor(getUsagePercentage(usage.usage.apiRequestsMade, usage.quotas.apiRequestsPerMonth))}>
                        {formatNumber(usage.usage.apiRequestsMade)} / {formatNumber(usage.quotas.apiRequestsPerMonth)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageBgColor(getUsagePercentage(usage.usage.apiRequestsMade, usage.quotas.apiRequestsPerMonth))}`}
                        style={{ width: `${getUsagePercentage(usage.usage.apiRequestsMade, usage.quotas.apiRequestsPerMonth)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Plan Comparison */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Available Plans</h2>
              <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setSelectedBillingCycle('monthly')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedBillingCycle === 'monthly' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedBillingCycle('yearly')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedBillingCycle === 'yearly' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Yearly
                  <span className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1 rounded">
                    Save 17%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 relative ${
                    plan.name === currentPlan.name 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 transition-colors'
                  } ${plan.isPopular ? 'ring-2 ring-primary ring-opacity-20' : ''}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg">{plan.displayName}</h3>
                    <div className="text-2xl font-bold mt-2">
                      {formatCurrency(plan.price[selectedBillingCycle])}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per {selectedBillingCycle === 'yearly' ? 'year' : 'month'}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.slice(0, 4).map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2 text-sm">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                          {feature.limit && ` (${formatNumber(feature.limit)} ${feature.unit})`}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlanUpgrade(plan.id)}
                    disabled={plan.name === currentPlan.name}
                    className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      plan.name === currentPlan.name
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {plan.name === currentPlan.name ? 'Current Plan' : `Upgrade to ${plan.displayName}`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-6">Billing History</h2>
            
            {billingHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No billing history</h3>
                <p className="text-muted-foreground">
                  Your billing history will appear here once you upgrade to a paid plan
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        invoice.status === PaymentStatus.PAID 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : invoice.status === PaymentStatus.PENDING
                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {invoice.status === PaymentStatus.PAID && <CheckCircle className="h-5 w-5" />}
                        {invoice.status === PaymentStatus.PENDING && <Clock className="h-5 w-5" />}
                        {invoice.status === PaymentStatus.FAILED && <AlertTriangle className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-medium">{invoice.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.paidAt ? `Paid on ${invoice.paidAt.toLocaleDateString()}` : `Due ${invoice.dueDate.toLocaleDateString()}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(invoice.amount)}</div>
                        <div className={`text-sm capitalize ${
                          invoice.status === PaymentStatus.PAID 
                            ? 'text-green-600 dark:text-green-400'
                            : invoice.status === PaymentStatus.PENDING
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}>
                          {invoice.status}
                        </div>
                      </div>
                      
                      {invoice.invoiceUrl && (
                        <button
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title="Download invoice"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Payment Methods</h3>
            
            {paymentMethods.length === 0 ? (
              <div className="text-center py-4">
                <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No payment methods</p>
                <button className="mt-2 text-sm text-primary hover:underline">
                  Add payment method
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 p-3 border rounded-lg ${
                      method.isDefault ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {method.brand} •••• {method.last4}
                      </div>
                      {method.expiryMonth && method.expiryYear && (
                        <div className="text-xs text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </div>
                      )}
                    </div>
                    {method.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                ))}
                
                <button className="w-full py-2 text-sm text-primary hover:underline">
                  Add new payment method
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/settings"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Account Settings</span>
              </Link>
              <Link
                href="/support"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Contact Support</span>
              </Link>
              <Link
                href="/api-docs"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>API Documentation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
