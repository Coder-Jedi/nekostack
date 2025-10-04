'use client'

import { ToolCard } from '@nekostack/types'
import { ToolCardComponent, ToolCardSkeleton } from './tool-card'

interface ToolGridProps {
  tools: ToolCard[]
  isLoading?: boolean
  onFavoriteToggle?: (toolId: string) => void
}

export function ToolGrid({ tools, isLoading = false, onFavoriteToggle }: ToolGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ToolCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">No tools found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <ToolCardComponent
          key={tool.id}
          tool={tool}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  )
}
