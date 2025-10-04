'use client'

import { ToolCard } from '@nekostack/types'
import { Star, Heart, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { ToolGrid } from '@/components/tools/tool-grid'

interface FavoritesSectionProps {
  favoriteTools: ToolCard[]
  onFavoriteToggle?: (toolId: string) => void
  isLoading?: boolean
}

export function FavoritesSection({ favoriteTools, onFavoriteToggle, isLoading = false }: FavoritesSectionProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Favorite Tools
        </h3>
        <Link 
          href="/favorites"
          className="text-sm text-primary hover:underline flex items-center"
        >
          View all favorites
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="tool-card p-4 h-32">
                <div className="space-y-3">
                  <div className="h-8 w-8 bg-muted rounded-lg mx-auto" />
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : favoriteTools.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {favoriteTools.slice(0, 6).map((tool) => (
              <Link key={tool.id} href={tool.url} className="group">
                <div className="tool-card p-4 h-full hover:scale-[1.02] transition-all duration-200">
                  {/* Quick favorite card layout */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <span className="text-lg" role="img" aria-label={tool.name}>
                          {tool.icon}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {tool.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center space-x-3 mt-1">
                        {tool.usageCount && (
                          <span className="text-xs text-muted-foreground">
                            {tool.usageCount} uses
                          </span>
                        )}
                        {tool.rating && (
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-xs text-muted-foreground">
                              {tool.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Favorite indicator */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onFavoriteToggle?.(tool.id)
                      }}
                      className="flex-shrink-0 p-1 text-yellow-500 hover:text-yellow-600 transition-colors"
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {favoriteTools.length > 6 && (
            <div className="text-center">
              <Link 
                href="/favorites"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
              >
                View {favoriteTools.length - 6} more favorites
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-sm font-medium text-foreground mb-2">No favorites yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Start adding tools to your favorites to see them here
          </p>
          <Link 
            href="/tools"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
          >
            Browse Tools
          </Link>
        </div>
      )}
    </div>
  )
}
