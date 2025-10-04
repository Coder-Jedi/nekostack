'use client'

import { ToolCard } from '@nekostack/types'
import { 
  Star, 
  Crown, 
  Sparkles, 
  Users, 
  TrendingUp,
  Image,
  QrCode,
  FileText,
  ArrowLeftRight,
  PenTool,
  FileCheck,
  Target,
  LucideIcon
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAnalytics } from '@/lib/analytics'

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Image,
  QrCode,
  FileText,
  ArrowLeftRight,
  PenTool,
  FileCheck,
  Target,
}

// Category-based color schemes
const getCategoryColors = (category: string) => {
  const colorMap: Record<string, { bg: string, hover: string, icon: string }> = {
    image: {
      bg: 'from-purple-500/10 to-purple-500/5',
      hover: 'group-hover:from-purple-500/20 group-hover:to-purple-500/10',
      icon: 'text-purple-600 dark:text-purple-400'
    },
    utility: {
      bg: 'from-blue-500/10 to-blue-500/5',
      hover: 'group-hover:from-blue-500/20 group-hover:to-blue-500/10',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    document: {
      bg: 'from-green-500/10 to-green-500/5',
      hover: 'group-hover:from-green-500/20 group-hover:to-green-500/10',
      icon: 'text-green-600 dark:text-green-400'
    },
    converter: {
      bg: 'from-orange-500/10 to-orange-500/5',
      hover: 'group-hover:from-orange-500/20 group-hover:to-orange-500/10',
      icon: 'text-orange-600 dark:text-orange-400'
    },
    design: {
      bg: 'from-pink-500/10 to-pink-500/5',
      hover: 'group-hover:from-pink-500/20 group-hover:to-pink-500/10',
      icon: 'text-pink-600 dark:text-pink-400'
    },
    productivity: {
      bg: 'from-indigo-500/10 to-indigo-500/5',
      hover: 'group-hover:from-indigo-500/20 group-hover:to-indigo-500/10',
      icon: 'text-indigo-600 dark:text-indigo-400'
    },
  }
  
  return colorMap[category.toLowerCase()] || {
    bg: 'from-primary/10 to-primary/5',
    hover: 'group-hover:from-primary/20 group-hover:to-primary/10',
    icon: 'text-primary'
  }
}

interface ToolCardProps {
  tool: ToolCard
  onFavoriteToggle?: (toolId: string) => void
}

export function ToolCardComponent({ tool, onFavoriteToggle }: ToolCardProps) {
  const [isFavorite, setIsFavorite] = useState(tool.isFavorite)
  const { toolFavorited, buttonClicked } = useAnalytics()
  const categoryColors = getCategoryColors(tool.category)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    onFavoriteToggle?.(tool.id)
    
    // Track analytics
    toolFavorited(tool.id, tool.name, newFavoriteState ? 'added' : 'removed')
  }

  const handleToolClick = () => {
    buttonClicked('tool_card', 'tool_grid', {
      toolId: tool.id,
      toolName: tool.name,
      toolCategory: tool.category
    })
  }

  const formatUsageCount = (count?: number) => {
    if (!count) return '0'
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  return (
    <Link href={tool.url} className="group" onClick={handleToolClick}>
      <div className="tool-card p-6 h-full relative overflow-hidden group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-primary/10" data-tour="tool-card">
        {/* Premium Badge */}
        {tool.isPremium && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              <Crown className="h-3 w-3" />
              Pro
            </div>
          </div>
        )}

        {/* New Badge */}
        {tool.isNew && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              New
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 left-4 z-10 p-2 rounded-full transition-colors ${
            isFavorite
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          data-tour="favorite-button"
        >
          <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Tool Icon */}
        <div className={`flex items-center justify-center h-20 w-20 bg-gradient-to-br ${categoryColors.bg} ${categoryColors.hover} rounded-2xl mb-4 mx-auto transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
          {(() => {
            const IconComponent = iconMap[tool.icon]
            return IconComponent ? (
              <IconComponent className={`h-10 w-10 ${categoryColors.icon} transition-colors`} strokeWidth={1.5} />
            ) : (
              <span className="text-3xl" role="img" aria-label={tool.name}>
                {tool.icon}
              </span>
            )
          })()}
        </div>

        {/* Tool Info */}
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {tool.description}
          </p>

          {/* Category Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {tool.category}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 pt-2">
            {tool.usageCount && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{formatUsageCount(tool.usageCount)}</span>
              </div>
            )}
            
            {tool.rating && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{tool.rating}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <div className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
              Try it now
              <TrendingUp className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Hover Effect Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </Link>
  )
}

// Loading skeleton component
export function ToolCardSkeleton() {
  return (
    <div className="tool-card p-6 h-full">
      <div className="animate-pulse space-y-4">
        {/* Icon skeleton */}
        <div className="h-16 w-16 bg-muted rounded-xl mx-auto" />
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3 mx-auto" />
        </div>
        
        {/* Category badge skeleton */}
        <div className="h-6 bg-muted rounded-full w-20 mx-auto" />
        
        {/* Stats skeleton */}
        <div className="flex justify-center gap-4">
          <div className="h-3 bg-muted rounded w-8" />
          <div className="h-3 bg-muted rounded w-8" />
        </div>
      </div>
    </div>
  )
}
