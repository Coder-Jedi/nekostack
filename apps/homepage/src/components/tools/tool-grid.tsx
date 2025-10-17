'use client'

import { ToolCard } from '@nekostack/types'
import { ToolCardComponent, ToolCardSkeleton } from './tool-card'

interface ToolGridProps {
  tools: ToolCard[]
  isLoading?: boolean
  onFavoriteToggle?: (toolId: string) => void
  viewMode?: 'grid' | 'list'
}

export function ToolGrid({ tools, isLoading = false, onFavoriteToggle, viewMode = 'grid' }: ToolGridProps) {
  if (isLoading) {
    return (
      <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
        {Array.from({ length: 8 }).map((_, index) => (
          <ToolCardSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-8xl mb-6">🔍</div>
        <h3 className="text-2xl font-semibold mb-4">No tools found</h3>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Try adjusting your search or filter criteria to find what you're looking for
        </p>
      </div>
    )
  }

  return (
    <div className={viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}>
      {tools.map((tool, index) => (
        <div key={tool.id} className="stagger-item">
          <ToolCardComponent
            tool={tool}
            onFavoriteToggle={onFavoriteToggle}
            viewMode={viewMode}
          />
        </div>
      ))}
    </div>
  )
}
