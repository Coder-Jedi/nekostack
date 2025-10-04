import { RecentFile, FileStats, FileStatus } from '@nekostack/types'

export const mockRecentFiles: RecentFile[] = [
  {
    id: 'file-1',
    name: 'product-hero-compressed.jpg',
    type: 'image/jpeg',
    size: 245760, // 240KB
    toolName: 'Image Compressor',
    toolId: 'image-compressor',
    url: '/api/files/file-1/download',
    thumbnailUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    lastAccessedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isStarred: true
  },
  {
    id: 'file-2',
    name: 'website-qr-code.png',
    type: 'image/png',
    size: 15360, // 15KB
    toolName: 'QR Generator',
    toolId: 'qr-generator',
    url: '/api/files/file-2/download',
    thumbnailUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://nekostack.com',
    lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isStarred: false
  },
  {
    id: 'file-3',
    name: 'project-documentation.pdf',
    type: 'application/pdf',
    size: 1048576, // 1MB
    toolName: 'Markdown Editor',
    toolId: 'markdown-editor',
    url: '/api/files/file-3/download',
    lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    isStarred: true
  },
  {
    id: 'file-4',
    name: 'signature-john-doe.png',
    type: 'image/png',
    size: 8192, // 8KB
    toolName: 'Signature Creator',
    toolId: 'signature-creator',
    url: '/api/files/file-4/download',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop',
    lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isStarred: false
  },
  {
    id: 'file-5',
    name: 'resume-alex-johnson.pdf',
    type: 'application/pdf',
    size: 524288, // 512KB
    toolName: 'Resume Builder',
    toolId: 'resume-builder',
    url: '/api/files/file-5/download',
    lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isStarred: true
  },
  {
    id: 'file-6',
    name: 'ats-analysis-report.pdf',
    type: 'application/pdf',
    size: 204800, // 200KB
    toolName: 'ATS Checker',
    toolId: 'ats-checker',
    url: '/api/files/file-6/download',
    lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isStarred: false
  }
]

export const mockFileStats: FileStats = {
  totalFiles: 24,
  totalSize: 15728640, // ~15MB
  filesByTool: {
    'image-compressor': 8,
    'qr-generator': 5,
    'markdown-editor': 4,
    'signature-creator': 3,
    'resume-builder': 2,
    'ats-checker': 2
  },
  filesByType: {
    'image/jpeg': 6,
    'image/png': 8,
    'application/pdf': 7,
    'text/plain': 2,
    'application/zip': 1
  },
  storageUsed: 15728640, // ~15MB
  storageLimit: 1073741824 // 1GB
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.startsWith('text/')) return '📝'
  if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦'
  if (mimeType.startsWith('video/')) return '🎥'
  if (mimeType.startsWith('audio/')) return '🎵'
  return '📎'
}

export const getToolIcon = (toolId: string): string => {
  switch (toolId) {
    case 'image-compressor': return '🖼️'
    case 'qr-generator': return '📱'
    case 'markdown-editor': return '📝'
    case 'unit-converter': return '🔄'
    case 'signature-creator': return '✍️'
    case 'resume-builder': return '📄'
    case 'ats-checker': return '🎯'
    default: return '🔧'
  }
}

export const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}
