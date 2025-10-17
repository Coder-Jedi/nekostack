'use client'

// @ts-nocheck - Lucide React type compatibility issue
import { useEffect } from 'react'
import { Search, Star, Zap, Shield, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { ToolGrid } from '@/components/tools/tool-grid'
import { UserProfileComponent } from '@/components/dashboard/user-profile'
import { FavoritesSection } from '@/components/dashboard/favorites-section'
import { useUserStore } from '@/stores/user-store'
import { useToolsStore } from '@/stores/tools-store'
import { mockTools } from '@/lib/mock-data'

export default function Home() {
  const { user, isAuthenticated } = useUserStore()
  const { tools, setTools, toggleFavorite } = useToolsStore()

  useEffect(() => {
    // Initialize mock data
    if (tools.length === 0) {
      setTools(mockTools)
    }
  }, [tools, setTools])


  // Show only the first 6 tools on homepage
  const featuredTools = mockTools.slice(0, 6)
  const favoriteTools = tools.filter(tool => tool.isFavorite)
  // Show personalized dashboard for authenticated users
  if (isAuthenticated && user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your NekoStack account
              </p>
            </div>
            <Link 
              href="/profile"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              View full dashboard
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tools Used</p>
                  <p className="text-2xl font-bold text-foreground">
                    {user.usage.toolsUsed}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Favorites</p>
                  <p className="text-2xl font-bold text-foreground">
                    {favoriteTools.length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usage</p>
                  <p className="text-2xl font-bold text-foreground">
                    {user.usage.percentageUsed}%
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="text-primary font-bold text-sm">
                    {Math.round(user.usage.percentageUsed / 10)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-lg font-bold text-foreground capitalize">
                    {user.subscription.plan}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Favorites Section */}
        {favoriteTools.length > 0 && (
          <section className="py-8">
            <FavoritesSection 
              favoriteTools={favoriteTools}
              onFavoriteToggle={toggleFavorite}
            />
          </section>
        )}

        {/* All Tools Section */}
        <section className="py-8" data-tour="tools-section">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">All Tools</h2>
            <p className="text-muted-foreground">
              Explore our complete suite of productivity tools
            </p>
          </div>
          
          <ToolGrid tools={featuredTools} onFavoriteToggle={toggleFavorite} />
          
          <div className="text-center mt-8">
            <Link 
              href="/tools"
              className="group inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 hover:scale-105 hover:shadow-md h-12 px-8 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                View All Tools
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </section>
      </div>
    )
  }

  // Show marketing homepage for non-authenticated users
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              NekoStack
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive SaaS suite providing essential tools for productivity and creativity. 
            Everything you need in one place.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/tools" 
              className="group inline-flex items-center justify-center rounded-lg text-base font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg h-14 px-10 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Explore Tools
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Preview Section - Moved up to showcase tools first */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Tools</h2>
          <p className="text-muted-foreground">
            Explore our most popular productivity tools
          </p>
        </div>
        
        <ToolGrid tools={featuredTools} />
        
        <div className="text-center mt-8">
          <Link 
            href="/tools"
            className="group inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 hover:scale-105 hover:shadow-md h-12 px-8 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose NekoStack?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for modern workflows with performance, security, and ease of use in mind.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group tool-card p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/20 bg-card/50 hover:bg-card backdrop-blur-sm rounded-xl">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4 group-hover:text-primary/80" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              Optimized for speed with edge computing and smart caching.
            </p>
          </div>
          
          <div className="group tool-card p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/20 bg-card/50 hover:bg-card backdrop-blur-sm rounded-xl">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4 group-hover:text-primary/80" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Secure & Private</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              Your data is protected with enterprise-grade security.
            </p>
          </div>
          
          <div className="group tool-card p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/20 bg-card/50 hover:bg-card backdrop-blur-sm rounded-xl">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <Star className="h-12 w-12 text-primary mx-auto mb-4 group-hover:text-primary/80" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Premium Quality</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              Professional-grade tools with attention to detail.
            </p>
          </div>
          
          <div className="group tool-card p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg border border-border/50 hover:border-primary/20 bg-card/50 hover:bg-card backdrop-blur-sm rounded-xl">
            <div className="group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4 group-hover:text-primary/80" />
            </div>
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Always Available</h3>
            <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              99.9% uptime with global CDN and redundancy.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="group bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm rounded-2xl p-12 border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
              Ready to boost your productivity?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto group-hover:text-foreground/80 transition-colors duration-300">
              Join thousands of users who trust NekoStack for their daily workflows.
            </p>
            <Link 
              href="/tools"
              className="group/btn inline-flex items-center justify-center rounded-lg text-base font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg h-14 px-10 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Explore Tools
                <ArrowRight className="ml-3 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
