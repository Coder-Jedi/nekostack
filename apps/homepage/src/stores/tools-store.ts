import { create } from 'zustand'
import { ToolCard, ToolCategory, ToolSearchFilters } from '@nekostack/types'

interface ToolsState {
  // Data
  tools: ToolCard[]
  filteredTools: ToolCard[]
  favorites: string[]
  
  // Search & Filters
  searchQuery: string
  selectedCategories: ToolCategory[]
  showPremiumOnly: boolean
  showNewOnly: boolean
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Actions
  setTools: (tools: ToolCard[]) => void
  setSearchQuery: (query: string) => void
  setSelectedCategories: (categories: ToolCategory[]) => void
  toggleCategory: (category: ToolCategory) => void
  setShowPremiumOnly: (show: boolean) => void
  setShowNewOnly: (show: boolean) => void
  toggleFavorite: (toolId: string) => void
  clearFilters: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  getFilteredTools: () => ToolCard[]
}

export const useToolsStore = create<ToolsState>((set, get) => ({
  // Initial state
  tools: [],
  filteredTools: [],
  favorites: [],
  searchQuery: '',
  selectedCategories: [],
  showPremiumOnly: false,
  showNewOnly: false,
  isLoading: false,
  error: null,

  // Actions
  setTools: (tools) => {
    set({ tools })
    // Trigger filtering when tools are set
    get().getFilteredTools()
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().getFilteredTools()
  },

  setSelectedCategories: (categories) => {
    set({ selectedCategories: categories })
    get().getFilteredTools()
  },

  toggleCategory: (category) => {
    const { selectedCategories } = get()
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    
    set({ selectedCategories: newCategories })
    get().getFilteredTools()
  },

  setShowPremiumOnly: (show) => {
    set({ showPremiumOnly: show })
    get().getFilteredTools()
  },

  setShowNewOnly: (show) => {
    set({ showNewOnly: show })
    get().getFilteredTools()
  },

  toggleFavorite: (toolId) => {
    const { favorites, tools } = get()
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId]
    
    // Update the tool's favorite status
    const updatedTools = tools.map(tool => 
      tool.id === toolId 
        ? { ...tool, isFavorite: !tool.isFavorite }
        : tool
    )
    
    set({ 
      favorites: newFavorites,
      tools: updatedTools
    })
    get().getFilteredTools()
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedCategories: [],
      showPremiumOnly: false,
      showNewOnly: false
    })
    get().getFilteredTools()
  },

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  // Computed function to filter tools
  getFilteredTools: () => {
    const { 
      tools, 
      searchQuery, 
      selectedCategories, 
      showPremiumOnly, 
      showNewOnly 
    } = get()

    let filtered = [...tools]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(tool => 
        selectedCategories.includes(tool.category)
      )
    }

    // Apply premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter(tool => tool.isPremium)
    }

    // Apply new filter
    if (showNewOnly) {
      filtered = filtered.filter(tool => tool.isNew)
    }

    // Sort by usage count (most used first) and then by rating
    filtered.sort((a, b) => {
      const usageA = a.usageCount || 0
      const usageB = b.usageCount || 0
      const ratingA = a.rating || 0
      const ratingB = b.rating || 0
      
      if (usageB !== usageA) {
        return usageB - usageA
      }
      return ratingB - ratingA
    })

    set({ filteredTools: filtered })
    return filtered
  },
}))
