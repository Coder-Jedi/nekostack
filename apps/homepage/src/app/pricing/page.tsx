'use client'

import { useState } from 'react'
import { Check, X, Zap, Crown, Building2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SignInModal } from '@/components/auth/sign-in-modal'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out NekoStack',
    icon: Zap,
    iconColor: 'text-blue-600',
    bgColor: 'from-blue-500/10 to-blue-500/5',
    features: [
      { text: '50 tool uses per month', included: true },
      { text: 'Access to basic tools', included: true },
      { text: 'Community support', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Premium tools', included: false },
      { text: 'Priority support', included: false },
      { text: 'No ads', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Best for professionals and power users',
    icon: Crown,
    iconColor: 'text-yellow-600',
    bgColor: 'from-yellow-500/10 to-orange-500/5',
    features: [
      { text: 'Unlimited tool uses', included: true },
      { text: 'Access to all tools', included: true },
      { text: 'Priority support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'All premium tools', included: true },
      { text: 'No advertisements', included: true },
      { text: 'Export history', included: true },
      { text: 'API access (coming soon)', included: false },
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For teams and organizations',
    icon: Building2,
    iconColor: 'text-purple-600',
    bgColor: 'from-purple-500/10 to-purple-500/5',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Custom usage limits', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Full API access', included: true },
      { text: 'SSO integration', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Team management', included: true },
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Pro plan comes with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What happens when I reach my usage limit?',
    answer: 'On the Free plan, you\'ll need to wait until next month or upgrade to Pro for unlimited access.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely! Cancel anytime with no questions asked. You\'ll retain access until the end of your billing period.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your payment.',
  },
]

export default function PricingPage() {
  const [showSignInModal, setShowSignInModal] = useState(false)

  return (
    <>
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)}
        trigger="manual"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include access to our core tools.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.highlighted
                  ? 'border-primary shadow-xl scale-105'
                  : 'border-border hover:border-primary/50'
              } transition-all duration-300`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              {/* Icon */}
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${plan.bgColor} mb-6`}>
                <Icon className={`h-8 w-8 ${plan.iconColor}`} strokeWidth={1.5} />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              
              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-6">{plan.description}</p>

              {/* CTA Button */}
              <button
                onClick={() => setShowSignInModal(true)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors mb-8 ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-2 border-input hover:bg-accent'
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4">Feature</th>
                <th className="text-center py-4 px-4">Free</th>
                <th className="text-center py-4 px-4 bg-primary/5">Pro</th>
                <th className="text-center py-4 px-4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 px-4">Tool uses per month</td>
                <td className="text-center py-4 px-4">50</td>
                <td className="text-center py-4 px-4 bg-primary/5">Unlimited</td>
                <td className="text-center py-4 px-4">Custom</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">Premium tools access</td>
                <td className="text-center py-4 px-4"><X className="h-5 w-5 mx-auto text-muted-foreground" /></td>
                <td className="text-center py-4 px-4 bg-primary/5"><Check className="h-5 w-5 mx-auto text-green-600" /></td>
                <td className="text-center py-4 px-4"><Check className="h-5 w-5 mx-auto text-green-600" /></td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">Support</td>
                <td className="text-center py-4 px-4">Community</td>
                <td className="text-center py-4 px-4 bg-primary/5">Priority</td>
                <td className="text-center py-4 px-4">Dedicated</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">API Access</td>
                <td className="text-center py-4 px-4"><X className="h-5 w-5 mx-auto text-muted-foreground" /></td>
                <td className="text-center py-4 px-4 bg-primary/5">Coming Soon</td>
                <td className="text-center py-4 px-4"><Check className="h-5 w-5 mx-auto text-green-600" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-16 text-center bg-muted rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust NekoStack for their productivity needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setShowSignInModal(true)}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-input font-medium hover:bg-accent transition-colors"
          >
            Explore Tools
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
