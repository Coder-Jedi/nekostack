'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { mockTools } from '@/lib/mock-data'
import { ToolCategory } from '@nekostack/types'
import * as LucideIcons from 'lucide-react'

// Icon mapping
const iconMap: Record<string, any> = {
  Image: LucideIcons.Image,
  QrCode: LucideIcons.QrCode,
  FileText: LucideIcons.FileText,
  ArrowLeftRight: LucideIcons.ArrowLeftRight,
  PenTool: LucideIcons.PenTool,
  FileCheck: LucideIcons.FileCheck,
  Target: LucideIcons.Target,
}

// Category colors
const categoryColors: Record<string, string> = {
  [ToolCategory.IMAGE]: 'text-purple-600 dark:text-purple-400',
  [ToolCategory.UTILITY]: 'text-blue-600 dark:text-blue-400',
  [ToolCategory.DOCUMENT]: 'text-green-600 dark:text-green-400',
  [ToolCategory.CONVERTER]: 'text-orange-600 dark:text-orange-400',
  [ToolCategory.DESIGN]: 'text-pink-600 dark:text-pink-400',
  [ToolCategory.PRODUCTIVITY]: 'text-indigo-600 dark:text-indigo-400',
}

// Category names
const categoryNames: Record<string, string> = {
  [ToolCategory.IMAGE]: 'Image & Media',
  [ToolCategory.UTILITY]: 'Utilities',
  [ToolCategory.DOCUMENT]: 'Documents',
  [ToolCategory.CONVERTER]: 'Converters',
  [ToolCategory.DESIGN]: 'Design',
  [ToolCategory.PRODUCTIVITY]: 'Productivity',
}

export function ToolsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  // Group tools by category
  const toolsByCategory = mockTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, typeof mockTools>)

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsOpen(false)
    }, 200) // 200ms delay before closing
    setTimeoutId(id)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary">
        <span>Tools</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 rounded-lg border bg-card shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 max-h-[480px] overflow-y-auto">
            {/* Tools by Category */}
            <div className="space-y-4">
              {Object.entries(toolsByCategory).map(([category, tools]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {categoryNames[category] || category}
                  </h3>
                  <div className="space-y-1">
                    {tools.slice(0, 3).map((tool) => {
                      const IconComponent = iconMap[tool.icon]
                      return (
                        <Link
                          key={tool.id}
                          href={tool.url}
                          className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-colors group"
                          onClick={() => setIsOpen(false)}
                        >
                          {IconComponent && (
                            <div className={`flex-shrink-0 ${categoryColors[category] || 'text-primary'}`}>
                              <IconComponent className="h-5 w-5" strokeWidth={1.5} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                              {tool.name}
                            </p>
                          </div>
                          {tool.isPremium && (
                            <span className="flex-shrink-0 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-1.5 py-0.5 rounded">
                              Pro
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Link */}
            <div className="mt-4 pt-4 border-t">
              <Link
                href="/tools"
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-sm font-medium text-primary">View All Tools</span>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
