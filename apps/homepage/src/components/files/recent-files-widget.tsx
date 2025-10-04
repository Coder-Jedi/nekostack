'use client'

import { useEffect, useState } from 'react'
import { useFilesStore } from '@/stores/files-store'
import { RecentFile } from '@nekostack/types'
import { 
  Clock, 
  Star, 
  Download, 
  ExternalLink, 
  MoreHorizontal,
  Trash2,
  Copy,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import { mockRecentFiles, mockFileStats, formatFileSize, getFileIcon, getToolIcon, getRelativeTime } from '@/lib/mock-files'
import { useAnalytics } from '@/lib/analytics'

interface RecentFilesWidgetProps {
  maxItems?: number
  showHeader?: boolean
}

export function RecentFilesWidget({ maxItems = 6, showHeader = true }: RecentFilesWidgetProps) {
  const {
    recentFiles,
    fileStats,
    setRecentFiles,
    setFileStats,
    toggleFileStar,
    removeFile,
    getFilteredFiles
  } = useFilesStore()
  
  const { buttonClicked, featureUsed } = useAnalytics()
  const [showActions, setShowActions] = useState<string | null>(null)

  useEffect(() => {
    // Initialize mock data
    if (recentFiles.length === 0) {
      setRecentFiles(mockRecentFiles)
    }
    if (!fileStats) {
      setFileStats(mockFileStats)
    }
  }, [recentFiles, fileStats, setRecentFiles, setFileStats])

  const displayedFiles = getFilteredFiles().slice(0, maxItems)

  const handleStarToggle = (fileId: string, fileName: string) => {
    toggleFileStar(fileId)
    featureUsed('file_star_toggle', { fileId, fileName })
  }

  const handleDownload = (file: RecentFile) => {
    buttonClicked('file_download', 'recent_files', {
      fileId: file.id,
      fileName: file.name,
      toolId: file.toolId
    })
    // In a real app, this would trigger the download
    window.open(file.url, '_blank')
  }

  const handleCopyLink = async (file: RecentFile) => {
    try {
      await navigator.clipboard.writeText(file.url)
      featureUsed('file_copy_link', { fileId: file.id })
      // You could show a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleDelete = (file: RecentFile) => {
    removeFile(file.id)
    featureUsed('file_delete', { fileId: file.id, fileName: file.name })
  }

  if (displayedFiles.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-6">
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Files
            </h3>
          </div>
        )}
        
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-sm font-medium text-foreground mb-2">No recent files</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Files you create or process will appear here for quick access
          </p>
          <Link 
            href="/tools"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
          >
            Start Using Tools
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Files
          </h3>
          <Link 
            href="/files"
            className="text-sm text-primary hover:underline flex items-center"
          >
            View all files
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {displayedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors group"
          >
            {/* File Icon */}
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {file.thumbnailUrl ? (
                  <img
                    src={file.thumbnailUrl}
                    alt={file.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <span className="text-lg">
                    {getFileIcon(file.type)}
                  </span>
                )}
              </div>
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-foreground truncate">
                  {file.name}
                </h4>
                {file.isStarred && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span>{getToolIcon(file.toolId)}</span>
                  <span>{file.toolName}</span>
                </div>
                <span>{formatFileSize(file.size)}</span>
                <span>{getRelativeTime(file.lastAccessedAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Star Toggle */}
              <button
                onClick={() => handleStarToggle(file.id, file.name)}
                className={`p-1 rounded hover:bg-muted transition-colors ${
                  file.isStarred ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'
                }`}
                title={file.isStarred ? 'Remove from starred' : 'Add to starred'}
              >
                <Star className={`h-4 w-4 ${file.isStarred ? 'fill-current' : ''}`} />
              </button>

              {/* Download */}
              <button
                onClick={() => handleDownload(file)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </button>

              {/* More Actions */}
              <div className="relative">
                <button
                  onClick={() => setShowActions(showActions === file.id ? null : file.id)}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="More actions"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {showActions === file.id && (
                  <div className="absolute right-0 top-8 bg-popover border rounded-lg shadow-lg z-10 py-1 min-w-[150px] animate-slide-down">
                    <button
                      onClick={() => {
                        handleCopyLink(file)
                        setShowActions(null)
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy link
                    </button>
                    <button
                      onClick={() => {
                        window.open(file.url, '_blank')
                        setShowActions(null)
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in new tab
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        handleDelete(file)
                        setShowActions(null)
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Storage Usage */}
      {fileStats && showHeader && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Storage used</span>
            <span className="font-medium">
              {formatFileSize(fileStats.storageUsed)} / {formatFileSize(fileStats.storageLimit)}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ 
                width: `${Math.min((fileStats.storageUsed / fileStats.storageLimit) * 100, 100)}%` 
              }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
            <span>{fileStats.totalFiles} files</span>
            <span>{Math.round((fileStats.storageUsed / fileStats.storageLimit) * 100)}% used</span>
          </div>
        </div>
      )}
    </div>
  )
}
