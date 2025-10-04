import { ToolCard, ToolCategory } from '@nekostack/types'

export const mockTools: ToolCard[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor & Converter',
    description: 'Compress and convert images while maintaining quality. Supports JPEG, PNG, WebP, and more formats.',
    icon: '🖼️',
    category: ToolCategory.IMAGE,
    url: '/tools/image-compressor',
    isPremium: false,
    isNew: false,
    isFavorite: false,
    usageCount: 1250,
    rating: 4.8
  },
  {
    id: 'qr-generator',
    name: 'QR Code & Barcode Generator',
    description: 'Create custom QR codes and barcodes instantly. Support for URLs, text, WiFi, and contact information.',
    icon: '📱',
    category: ToolCategory.UTILITY,
    url: '/tools/qr-generator',
    isPremium: false,
    isNew: false,
    isFavorite: true,
    usageCount: 890,
    rating: 4.9
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor & Converter',
    description: 'Write and convert markdown with live preview. Export to HTML, PDF, and other formats.',
    icon: '📝',
    category: ToolCategory.DOCUMENT,
    url: '/tools/markdown-editor',
    isPremium: false,
    isNew: true,
    isFavorite: false,
    usageCount: 567,
    rating: 4.7
  },
  {
    id: 'unit-converter',
    name: 'Unit & Currency Converter',
    description: 'Convert between units of measurement and currencies with real-time exchange rates.',
    icon: '🔄',
    category: ToolCategory.CONVERTER,
    url: '/tools/unit-converter',
    isPremium: false,
    isNew: false,
    isFavorite: false,
    usageCount: 2100,
    rating: 4.6
  },
  {
    id: 'signature-creator',
    name: 'Digital Signature Creator',
    description: 'Create professional digital signatures for documents and emails with customizable styles.',
    icon: '✍️',
    category: ToolCategory.DESIGN,
    url: '/tools/signature-creator',
    isPremium: true,
    isNew: false,
    isFavorite: true,
    usageCount: 445,
    rating: 4.9
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    description: 'Build professional resumes with modern templates and ATS-friendly formats.',
    icon: '📄',
    category: ToolCategory.PRODUCTIVITY,
    url: '/tools/resume-builder',
    isPremium: true,
    isNew: true,
    isFavorite: false,
    usageCount: 780,
    rating: 4.8
  },
  {
    id: 'ats-checker',
    name: 'ATS Resume Checker',
    description: 'Check your resume compatibility with Applicant Tracking Systems and get optimization tips.',
    icon: '🎯',
    category: ToolCategory.PRODUCTIVITY,
    url: '/tools/ats-checker',
    isPremium: true,
    isNew: false,
    isFavorite: false,
    usageCount: 320,
    rating: 4.7
  }
]

export const toolCategories = [
  { id: ToolCategory.IMAGE, name: 'Image & Media', count: 1 },
  { id: ToolCategory.DOCUMENT, name: 'Documents', count: 1 },
  { id: ToolCategory.PRODUCTIVITY, name: 'Productivity', count: 2 },
  { id: ToolCategory.DEVELOPMENT, name: 'Development', count: 0 },
  { id: ToolCategory.DESIGN, name: 'Design', count: 1 },
  { id: ToolCategory.UTILITY, name: 'Utilities', count: 1 },
  { id: ToolCategory.CONVERTER, name: 'Converters', count: 1 }
]
