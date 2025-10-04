// File management type definitions

export interface UserFile {
  id: string
  userId: string
  name: string
  originalName: string
  size: number
  type: string
  mimeType: string
  url: string
  thumbnailUrl?: string
  toolId: string
  toolName: string
  status: FileStatus
  isPublic: boolean
  tags: string[]
  metadata: FileMetadata
  createdAt: Date
  updatedAt: Date
  lastAccessedAt?: Date
  expiresAt?: Date
}

export enum FileStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
  EXPIRED = 'expired',
  DELETED = 'deleted'
}

export interface FileMetadata {
  width?: number
  height?: number
  duration?: number
  pages?: number
  compression?: number
  format?: string
  quality?: number
  [key: string]: any
}

export interface FileUpload {
  file: File
  toolId: string
  options?: FileUploadOptions
}

export interface FileUploadOptions {
  quality?: number
  format?: string
  maxSize?: number
  compress?: boolean
  generateThumbnail?: boolean
  isPublic?: boolean
  tags?: string[]
}

export interface FileUploadProgress {
  fileId: string
  progress: number
  status: FileStatus
  error?: string
}

export interface RecentFile {
  id: string
  name: string
  type: string
  size: number
  toolName: string
  toolId: string
  url: string
  thumbnailUrl?: string
  lastAccessedAt: Date
  isStarred: boolean
}

export interface FileAction {
  id: string
  label: string
  icon: string
  action: (file: UserFile) => void
  requiresAuth?: boolean
  requiresPro?: boolean
}

export interface FileFilter {
  toolId?: string
  type?: string
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  isStarred?: boolean
}

export interface FileStats {
  totalFiles: number
  totalSize: number
  filesByTool: Record<string, number>
  filesByType: Record<string, number>
  storageUsed: number
  storageLimit: number
}
