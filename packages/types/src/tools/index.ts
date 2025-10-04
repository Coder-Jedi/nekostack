// Tool type definitions

export interface Tool {
  id: string
  name: string
  description: string
  shortDescription: string
  icon: string
  category: ToolCategory
  status: ToolStatus
  features: string[]
  tags: string[]
  url: string
  isPremium: boolean
  isNew: boolean
  isFeatured: boolean
  usageCount?: number
  rating?: number
  lastUsed?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ToolCard {
  id: string
  name: string
  description: string
  icon: string
  category: ToolCategory
  url: string
  isPremium: boolean
  isNew: boolean
  isFavorite: boolean
  usageCount?: number
  rating?: number
}

export enum ToolCategory {
  IMAGE = 'image',
  DOCUMENT = 'document', 
  PRODUCTIVITY = 'productivity',
  DEVELOPMENT = 'development',
  DESIGN = 'design',
  UTILITY = 'utility',
  CONVERTER = 'converter'
}

export enum ToolStatus {
  ACTIVE = 'active',
  BETA = 'beta',
  COMING_SOON = 'coming_soon',
  MAINTENANCE = 'maintenance',
  DEPRECATED = 'deprecated'
}

export interface ToolUsage {
  toolId: string
  userId: string
  usedAt: Date
  sessionId?: string
  metadata?: Record<string, any>
}

export interface ToolFavorite {
  toolId: string
  userId: string
  addedAt: Date
}

export interface ToolRating {
  toolId: string
  userId: string
  rating: number
  review?: string
  createdAt: Date
}

export interface ToolSearchFilters {
  query?: string
  categories?: ToolCategory[]
  isPremium?: boolean
  isNew?: boolean
  isFeatured?: boolean
  minRating?: number
}

export interface ToolSearchResult {
  tools: ToolCard[]
  total: number
  hasMore: boolean
  filters: ToolSearchFilters
}
