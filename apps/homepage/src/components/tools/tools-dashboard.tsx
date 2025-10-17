'use client'

import { useEffect, useState } from 'react'
import { useToolsStore } from '@/stores/tools-store'
import { mockTools, toolCategories } from '@/lib/mock-data'
import { SearchInput } from './search-input'
import { CategoryFilter, FilterChips } from './category-filter'
import { ToolGrid } from './tool-grid'
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react'

export function ToolsDashboard() {
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const {
    filteredTools,
    searchQuery,
    selectedCategories,
    showPremiumOnly,
    showNewOnly,
    isLoading,
    error,
    setTools,
    setSearchQuery,
    setSelectedCategories,
    toggleFavorite,
    setShowPremiumOnly,
    setShowNewOnly,
    clearFilters,
    getFilteredTools
  } = useToolsStore()

  // Initialize tools data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTools(mockTools)
    }, 500)
  }, [setTools])

  // Update filtered tools when dependencies change
  useEffect(() => {
    getFilteredTools()
  }, [searchQuery, selectedCategories, showPremiumOnly, showNewOnly, getFilteredTools])

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || showPremiumOnly || showNewOnly

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Productivity Tools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover and use our comprehensive suite of productivity tools designed to boost your efficiency
            </p>
          </div>

        {/* Search and Controls */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search tools by name, description, or category..."
              />
            </div>
            
            {/* View Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-4 sm:px-6 shadow-sm hover:shadow-lg ${
                  showFilters ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'hover:border-primary/50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {(selectedCategories.length + (showPremiumOnly ? 1 : 0) + (showNewOnly ? 1 : 0))}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="flex border-2 border-input rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground hover:bg-primary/10'
                  }`}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground hover:bg-primary/10'
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-4">
            <FilterChips
              selectedCategories={selectedCategories}
              categories={toolCategories}
              onRemoveCategory={(category) => {
                setSelectedCategories(selectedCategories.filter(c => c !== category))
              }}
              onClearAll={() => setSelectedCategories([])}
            />
            
            {/* Premium/New filters */}
            <div className="flex gap-2">
              {showPremiumOnly && (
                <button
                  onClick={() => setShowPremiumOnly(false)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full hover:bg-yellow-200 transition-colors dark:bg-yellow-900/30 dark:text-yellow-400"
                >
                  Premium Only
                  <X className="h-3 w-3" />
                </button>
              )}
              
              {showNewOnly && (
                <button
                  onClick={() => setShowNewOnly(false)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400"
                >
                  New Only
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="lg:w-80 space-y-6">
              <div className="bg-card rounded-xl border border-border/50 p-6 space-y-6 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-foreground">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors lg:hidden p-1 hover:bg-muted rounded-md"
                    title="Close filters"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Category Filter */}
                <CategoryFilter
                  categories={toolCategories}
                  selectedCategories={selectedCategories}
                  onChange={setSelectedCategories}
                />

                {/* Additional Filters */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-foreground">Options</h4>
                  
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showPremiumOnly}
                      onChange={(e) => setShowPremiumOnly(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm group-hover:text-foreground transition-colors">Premium tools only</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={showNewOnly}
                      onChange={(e) => setShowNewOnly(e.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm group-hover:text-foreground transition-colors">New tools only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          <div className="flex-1">
          {/* Results Count */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <span className="text-base font-medium text-muted-foreground">Loading tools...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-base font-semibold text-foreground">
                      {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
                    </span>
                  </div>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 transition-colors underline hover:no-underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">⚠️</div>
                <h3 className="text-xl font-semibold mb-3">Something went wrong</h3>
                <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Tools Grid */}
            {!error && (
            <ToolGrid
              tools={filteredTools}
              isLoading={isLoading}
              onFavoriteToggle={toggleFavorite}
              viewMode={viewMode}
            />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
