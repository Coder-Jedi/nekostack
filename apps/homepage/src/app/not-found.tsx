'use client'

import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg h-12 px-6 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link
            href="/tools"
            className="group inline-flex items-center justify-center rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-primary/20 bg-background hover:bg-primary/5 hover:border-primary/40 hover:scale-105 hover:shadow-md h-12 px-6 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Explore Tools
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
        
        <div className="mt-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
