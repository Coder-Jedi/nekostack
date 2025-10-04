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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Productivity Tools</h1>
        <p className="text-muted-foreground">
          Discover and use our comprehensive suite of productivity tools
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
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
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 ${
                showFilters ? 'bg-accent' : ''
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {(selectedCategories.length + (showPremiumOnly ? 1 : 0) + (showNewOnly ? 1 : 0))}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'} transition-colors`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'} transition-colors`}
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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="lg:w-64 space-y-6">
            <div className="bg-card rounded-lg border p-4 space-y-6">
              {/* Category Filter */}
              <CategoryFilter
                categories={toolCategories}
                selectedCategories={selectedCategories}
                onChange={setSelectedCategories}
              />

              {/* Additional Filters */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Options</h3>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPremiumOnly}
                    onChange={(e) => setShowPremiumOnly(e.target.checked)}
                    className="rounded border-muted-foreground"
                  />
                  <span className="text-sm">Premium tools only</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNewOnly}
                    onChange={(e) => setShowNewOnly(e.target.checked)}
                    className="rounded border-muted-foreground"
                  />
                  <span className="text-sm">New tools only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="flex-1">
          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${filteredTools.length} tools found`}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Tools Grid */}
          {!error && (
            <ToolGrid
              tools={filteredTools}
              isLoading={isLoading}
              onFavoriteToggle={toggleFavorite}
            />
          )}
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
