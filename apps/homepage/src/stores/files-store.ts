import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RecentFile, FileStats, FileFilter } from '@nekostack/types'

interface FilesState {
  // Data
  recentFiles: RecentFile[]
  fileStats: FileStats | null
  starredFiles: string[]
  
  // UI State
  isLoading: boolean
  error: string | null
  
  // Actions
  setRecentFiles: (files: RecentFile[]) => void
  setFileStats: (stats: FileStats) => void
  toggleFileStar: (fileId: string) => void
  removeFile: (fileId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed
  getFilteredFiles: (filter?: FileFilter) => RecentFile[]
  getStarredFiles: () => RecentFile[]
  getFilesByTool: (toolId: string) => RecentFile[]
}

export const useFilesStore = create<FilesState>()(
  persist(
    (set, get) => ({
      // Initial state
      recentFiles: [],
      fileStats: null,
      starredFiles: [],
      isLoading: false,
      error: null,

      // Actions
      setRecentFiles: (files) => {
        set({ recentFiles: files })
      },

      setFileStats: (stats) => {
        set({ fileStats: stats })
      },

      toggleFileStar: (fileId) => {
        const { starredFiles, recentFiles } = get()
        const isStarred = starredFiles.includes(fileId)
        
        const newStarredFiles = isStarred
          ? starredFiles.filter(id => id !== fileId)
          : [...starredFiles, fileId]
        
        const updatedFiles = recentFiles.map(file =>
          file.id === fileId ? { ...file, isStarred: !isStarred } : file
        )
        
        set({
          starredFiles: newStarredFiles,
          recentFiles: updatedFiles
        })
      },

      removeFile: (fileId) => {
        const { recentFiles, starredFiles } = get()
        set({
          recentFiles: recentFiles.filter(file => file.id !== fileId),
          starredFiles: starredFiles.filter(id => id !== fileId)
        })
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      // Computed functions
      getFilteredFiles: (filter) => {
        const { recentFiles } = get()
        let filtered = [...recentFiles]

        if (!filter) return filtered

        if (filter.toolId) {
          filtered = filtered.filter(file => file.toolId === filter.toolId)
        }

        if (filter.type) {
          filtered = filtered.filter(file => file.type.includes(filter.type!))
        }

        if (filter.isStarred) {
          filtered = filtered.filter(file => file.isStarred)
        }

        if (filter.dateRange) {
          filtered = filtered.filter(file => 
            file.lastAccessedAt >= filter.dateRange!.start &&
            file.lastAccessedAt <= filter.dateRange!.end
          )
        }

        // Sort by last accessed (most recent first)
        filtered.sort((a, b) => b.lastAccessedAt.getTime() - a.lastAccessedAt.getTime())

        return filtered
      },

      getStarredFiles: () => {
        const { recentFiles } = get()
        return recentFiles.filter(file => file.isStarred)
      },

      getFilesByTool: (toolId) => {
        const { recentFiles } = get()
        return recentFiles.filter(file => file.toolId === toolId)
      }
    }),
    {
      name: 'nekostack-files-storage',
      partialize: (state) => ({
        starredFiles: state.starredFiles
      })
    }
  )
)
