'use client'

import { useEffect } from 'react'
import { useToolsStore } from '@/stores/tools-store'
import { useUserStore } from '@/stores/user-store'
import { ToolGrid } from '@/components/tools/tool-grid'
import { mockTools } from '@/lib/mock-data'
import { mockUserProfile } from '@/lib/mock-user-data'
import { Star, Heart } from 'lucide-react'
import Link from 'next/link'

export default function FavoritesPage() {
  const { tools, setTools, toggleFavorite } = useToolsStore()
  const { user, setUser } = useUserStore()

  useEffect(() => {
    // Initialize mock data for development
    if (tools.length === 0) {
      setTools(mockTools)
    }
    if (!user) {
      setUser(mockUserProfile)
    }
  }, [tools, user, setTools, setUser])

  const favoriteTools = tools.filter(tool => tool.isFavorite)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-3xl font-bold">Favorite Tools</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quick access to your most-used and favorite productivity tools. 
            Click the star on any tool to add it to your favorites.
          </p>
        </div>

        {/* Stats */}
        {user && (
          <div className="bg-card rounded-lg border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {favoriteTools.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Favorite Tools
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {user.stats.totalToolsUsed}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Tools Used
                </div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {user.usage.toolsUsed}
                </div>
                <div className="text-sm text-muted-foreground">
                  This Month
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Grid */}
        {favoriteTools.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Your Favorites ({favoriteTools.length})
              </h2>
              <Link 
                href="/tools"
                className="text-sm text-primary hover:underline"
              >
                Browse all tools →
              </Link>
            </div>
            
            <ToolGrid 
              tools={favoriteTools}
              onFavoriteToggle={toggleFavorite}
            />
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring our tools and click the star icon to add them to your favorites. 
              This will make them easily accessible from this page.
            </p>
            <div className="space-y-4">
              <Link 
                href="/tools"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
              >
                Browse All Tools
              </Link>
              <div className="text-sm text-muted-foreground">
                or go back to your{' '}
                <Link href="/profile" className="text-primary hover:underline">
                  dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        {favoriteTools.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Pro Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Click the star icon on any tool card to add or remove it from favorites</li>
              <li>• Favorites are synced across all your devices when you're signed in</li>
              <li>• Use favorites to quickly access your most-used tools from the dashboard</li>
              <li>• You can organize favorites by dragging and dropping (coming soon)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Favorite Tools - NekoStack',
  description: 'Access your favorite productivity tools in one place. Manage and organize your most-used NekoStack tools.',
}
