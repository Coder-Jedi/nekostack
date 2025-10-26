'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { LanguageSelector } from './language-selector'
import { ToolsDropdown } from './tools-dropdown'
import { SignInModal } from '@/components/auth/sign-in-modal'
import { Search, Menu, User, Bell, LogOut, Settings, BarChart3 } from 'lucide-react'

export function HeaderAuth() {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div>
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)}
        trigger="manual"
      />
      
      <header className="dashboard-header sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">N</span>
                </div>
                <span className="hidden font-bold sm:inline-block">NekoStack</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                // Authenticated Navigation
                <>
                  <Link
                    href="/"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/tools"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Tools
                  </Link>
                  <Link
                    href="/analytics"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/billing"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Billing
                  </Link>
                </>
              ) : (
                // Public Navigation
                <>
                  <Link
                    href="/"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Home
                  </Link>
                  <ToolsDropdown />
                  <Link
                    href="/pricing"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search */}
              {isAuthenticated && (
                <button className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                  <Search className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Search</span>
                </button>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Language Selector */}
              <LanguageSelector />

              {/* Auth Section */}
              {isLoading ? (
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated && session?.user ? (
                // Profile Dropdown
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 rounded-lg p-2 hover:bg-accent transition-colors"
                  >
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-medium">
                          {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <Link
                          href="/analytics"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <BarChart3 className="h-4 w-4" />
                          Analytics
                        </Link>
                        <div className="border-t my-2" />
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors w-full text-left text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Sign In Button
                <button
                  onClick={() => setShowSignInModal(true)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
                >
                  <User className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Sign in</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex md:hidden items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
              >
                <Menu className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/tools"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link
                    href="/analytics"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/billing"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Billing
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/tools"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tools
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  )
}