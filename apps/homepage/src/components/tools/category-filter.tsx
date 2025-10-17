'use client'

import { ToolCategory } from '@nekostack/types'
import { Check } from 'lucide-react'

interface CategoryOption {
  id: ToolCategory
  name: string
  count: number
}

interface CategoryFilterProps {
  categories: CategoryOption[]
  selectedCategories: ToolCategory[]
  onChange: (categories: ToolCategory[]) => void
}

export function CategoryFilter({ categories, selectedCategories, onChange }: CategoryFilterProps) {
  const handleCategoryToggle = (categoryId: ToolCategory) => {
    const isSelected = selectedCategories.includes(categoryId)
    
    if (isSelected) {
      onChange(selectedCategories.filter(id => id !== categoryId))
    } else {
      onChange([...selectedCategories, categoryId])
    }
  }

  const handleClearAll = () => {
    onChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Categories</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id)
          
          return (
            <label
              key={category.id}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="sr-only"
                />
                <div className={`
                  w-4 h-4 border-2 rounded transition-all duration-200
                  ${isSelected 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground group-hover:border-primary'
                  }
                `}>
                  {isSelected && (
                    <Check className="w-3 h-3 text-primary-foreground absolute top-0.5 left-0.5 transform -translate-x-0.5 -translate-y-0.5" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-between">
                <span className={`text-sm transition-colors ${
                  isSelected ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'
                }`}>
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}

// Filter chips component to show active filters
interface FilterChipsProps {
  selectedCategories: ToolCategory[]
  categories: CategoryOption[]
  onRemoveCategory: (category: ToolCategory) => void
  onClearAll: () => void
}

export function FilterChips({ selectedCategories, categories, onRemoveCategory, onClearAll }: FilterChipsProps) {
  if (selectedCategories.length === 0) return null

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-foreground">Active filters:</span>
      {selectedCategories.map((categoryId) => {
        const category = categories.find(c => c.id === categoryId)
        if (!category) return null
        
        return (
          <button
            key={categoryId}
            onClick={() => onRemoveCategory(categoryId)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 text-primary text-sm font-medium rounded-full hover:bg-primary/25 transition-all duration-200 hover:scale-105 border border-primary/20"
            title={`Remove ${category.name} filter`}
          >
            {category.name}
            <X className="h-3 w-3 hover:scale-110 transition-transform" />
          </button>
        )
      })}
      {selectedCategories.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline hover:no-underline font-medium"
        >
          Clear all filters
        </button>
      )}
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
