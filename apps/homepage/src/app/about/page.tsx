'use client'

import { useState } from 'react'
import { Zap, Shield, Star, Clock, Target, Rocket, Code2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SignInModal } from '@/components/auth/sign-in-modal'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with edge computing and smart caching for instant results.',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'from-yellow-500/10 to-yellow-500/5',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and encryption.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'from-green-500/10 to-green-500/5',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Professional-grade tools built with attention to detail and user experience.',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'from-purple-500/10 to-purple-500/5',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: '99.9% uptime with global CDN and redundancy for reliable access.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'from-blue-500/10 to-blue-500/5',
  },
]

const steps = [
  {
    number: '01',
    title: 'Choose Your Tool',
    description: 'Browse our collection of 7+ productivity tools and select the one you need.',
  },
  {
    number: '02',
    title: 'Upload or Input',
    description: 'Provide your data - upload files, enter text, or paste content.',
  },
  {
    number: '03',
    title: 'Get Results',
    description: 'Process instantly and download your results in your preferred format.',
  },
]

const techStack = [
  { name: 'Next.js 14', description: 'React framework' },
  { name: 'TypeScript', description: 'Type safety' },
  { name: 'Cloudflare', description: 'Edge computing' },
  { name: 'Oracle Cloud', description: 'Infrastructure' },
]

export default function AboutPage() {
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
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          About{' '}
          <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            NekoStack
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          A comprehensive SaaS platform providing essential productivity tools in one place.
          Built for modern workflows with performance, security, and ease of use in mind.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Target className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-6">Our Mission</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              NekoStack was created to solve a simple problem: why should you need dozens of different
              websites and tools to accomplish everyday tasks? We believe productivity tools should be
              fast, accessible, and all in one place.
            </p>
            <p>
              Our mission is to provide a comprehensive suite of high-quality tools that help you work
              faster and smarter. From image compression to resume building, we've got you covered with
              professional-grade tools that are easy to use and always available.
            </p>
            <p>
              We're committed to building tools that respect your privacy, work at lightning speed,
              and provide real value without the bloat. No unnecessary features, no complicated interfaces
              - just powerful tools that get the job done.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose NekoStack?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for modern workflows with performance, security, and ease of use in mind.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="tool-card p-6 text-center group hover:scale-105 transition-transform duration-300">
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-8 w-8 ${feature.color}`} strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps. No registration required for basic features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary font-bold text-2xl mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code2 className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Built with Modern Technology</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We use cutting-edge technology to deliver fast, reliable, and secure tools.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {techStack.map((tech) => (
            <div key={tech.name} className="text-center p-6 border rounded-lg hover:border-primary transition-colors">
              <h3 className="font-semibold mb-1">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Edge Computing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className="h-4 w-4 text-blue-500" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">7+</div>
            <div className="text-muted-foreground">Productivity Tools</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">&lt;2s</div>
            <div className="text-muted-foreground">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Support Available</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-muted rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust NekoStack for their daily workflows.
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
