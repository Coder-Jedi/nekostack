'use client'

import { useEffect, useState } from 'react'
import { 
  mockExports, 
  mockBackupSchedules, 
  mockBackupHistory,
  mockExportTemplates,
  mockExportQuota,
  getExportStatusColor,
  getExportStatusBgColor,
  getExportTypeIcon,
  getFormatIcon,
  formatFileSize,
  getExportTypeDescription,
  getFrequencyDescription
} from '@/lib/mock-export'
import { 
  DataExport, 
  ExportType, 
  ExportFormat, 
  ExportStatus,
  BackupSchedule,
  BackupHistory,
  ExportTemplate,
  ExportQuota
} from '@nekostack/types'
import { 
  Download, 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  Plus,
  Play,
  Pause,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Archive,
  Shield,
  Zap
} from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

export default function ExportPage() {
  const [exports, setExports] = useState<DataExport[]>([])
  const [backupSchedules, setBackupSchedules] = useState<BackupSchedule[]>([])
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([])
  const [templates, setTemplates] = useState<ExportTemplate[]>([])
  const [quota, setQuota] = useState<ExportQuota | null>(null)
  const [activeTab, setActiveTab] = useState<'exports' | 'schedules' | 'templates'>('exports')
  const [showNewExportModal, setShowNewExportModal] = useState(false)
  const { buttonClicked } = useAnalytics()

  useEffect(() => {
    // Initialize mock data
    setExports(mockExports)
    setBackupSchedules(mockBackupSchedules)
    setBackupHistory(mockBackupHistory)
    setTemplates(mockExportTemplates)
    setQuota(mockExportQuota)
  }, [])

  const handleDownload = (exportId: string, fileName: string) => {
    buttonClicked('export_download', 'export_page', { exportId })
    // In a real app, this would trigger the download
    console.log(`Downloading export ${exportId}`)
  }

  const handleCreateExport = (type: ExportType, format: ExportFormat) => {
    buttonClicked('export_create', 'export_page', { type, format })
    setShowNewExportModal(false)
    // In a real app, this would create a new export
    console.log(`Creating export: ${type} in ${format} format`)
  }

  const handleToggleSchedule = (scheduleId: string, isActive: boolean) => {
    buttonClicked('backup_schedule_toggle', 'export_page', { scheduleId, isActive })
    setBackupSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, isActive: !isActive }
          : schedule
      )
    )
  }

  const handleDeleteSchedule = (scheduleId: string) => {
    buttonClicked('backup_schedule_delete', 'export_page', { scheduleId })
    setBackupSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId))
  }

  const handleUseTemplate = (template: ExportTemplate) => {
    buttonClicked('export_template_use', 'export_page', { templateId: template.id })
    handleCreateExport(template.type, template.format)
  }

  if (!quota) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Data Export & Backup</h1>
          <p className="text-muted-foreground">
            Export your data and manage automated backups
          </p>
        </div>
        
        <button
          onClick={() => setShowNewExportModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Export
        </button>
      </div>

      {/* Usage Quota */}
      <div className="bg-card rounded-lg border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Export Usage</h2>
          <div className="text-sm text-muted-foreground">
            Resets on {quota.resetDate.toLocaleDateString()}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Exports this month</span>
              <span className="font-medium">
                {quota.usage.exportsThisMonth} / {quota.limits.maxExportsPerMonth}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ 
                  width: `${Math.min((quota.usage.exportsThisMonth / quota.limits.maxExportsPerMonth) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Data exported</span>
              <span className="font-medium">
                {formatFileSize(quota.usage.totalDataExported)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Max per export: {formatFileSize(quota.limits.maxFileSizePerExport)}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Retention period</span>
              <span className="font-medium">{quota.limits.maxRetentionDays} days</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {quota.usage.lastExportDate 
                ? `Last export: ${quota.usage.lastExportDate.toLocaleDateString()}`
                : 'No exports yet'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab('exports')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'exports' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Recent Exports
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'schedules' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Backup Schedules
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'templates' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Templates
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'exports' && (
        <div className="space-y-6">
          {/* Recent Exports */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-6">Recent Exports</h3>
            
            {exports.length === 0 ? (
              <div className="text-center py-8">
                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No exports yet</h4>
                <p className="text-muted-foreground mb-4">
                  Create your first data export to get started
                </p>
                <button
                  onClick={() => setShowNewExportModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Export
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {exports.map((exportItem) => (
                  <div
                    key={exportItem.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getExportStatusBgColor(exportItem.status)}`}>
                        <span className="text-lg">
                          {getExportTypeIcon(exportItem.type)}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">
                            {exportItem.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <span className="text-sm">
                            {getFormatIcon(exportItem.format)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExportStatusBgColor(exportItem.status)} ${getExportStatusColor(exportItem.status)}`}>
                            {exportItem.status.charAt(0).toUpperCase() + exportItem.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {exportItem.createdAt.toLocaleString()}
                          </span>
                          {exportItem.fileSize && (
                            <span>{formatFileSize(exportItem.fileSize)}</span>
                          )}
                          {exportItem.expiresAt && (
                            <span>Expires: {exportItem.expiresAt.toLocaleDateString()}</span>
                          )}
                        </div>
                        
                        {exportItem.status === ExportStatus.PROCESSING && (
                          <div className="mt-2">
                            <div className="w-48 bg-muted rounded-full h-2">
                              <div 
                                className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                                style={{ width: `${exportItem.progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {exportItem.progress}% complete
                            </div>
                          </div>
                        )}
                        
                        {exportItem.error && (
                          <div className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {exportItem.error}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {exportItem.status === ExportStatus.COMPLETED && exportItem.downloadUrl && (
                        <button
                          onClick={() => handleDownload(exportItem.id, `export-${exportItem.id}`)}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title="Download export"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      
                      {exportItem.status === ExportStatus.PROCESSING && (
                        <button
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                          title="Cancel export"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'schedules' && (
        <div className="space-y-6">
          {/* Backup Schedules */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Backup Schedules</h3>
              <button className="inline-flex items-center px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                New Schedule
              </button>
            </div>
            
            <div className="space-y-4">
              {backupSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      schedule.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        schedule.isActive ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{schedule.name}</h4>
                        {schedule.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Pause className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-1">
                        {schedule.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{getFrequencyDescription(schedule.frequency)}</span>
                        <span>
                          {getFormatIcon(schedule.format)} {schedule.format.toUpperCase()}
                        </span>
                        <span>Retention: {schedule.retentionDays} days</span>
                        {schedule.nextRun && (
                          <span>Next: {schedule.nextRun.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleSchedule(schedule.id, schedule.isActive)}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      title={schedule.isActive ? 'Pause schedule' : 'Resume schedule'}
                    >
                      {schedule.isActive ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                    
                    <button
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      title="Edit schedule"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      className="p-2 hover:bg-muted rounded-md transition-colors text-red-600 dark:text-red-400"
                      title="Delete schedule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backup History */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-6">Recent Backups</h3>
            
            <div className="space-y-3">
              {backupHistory.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium">
                        Backup completed
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {backup.createdAt.toLocaleString()} • {formatFileSize(backup.fileSize)}
                      </div>
                    </div>
                  </div>
                  
                  {backup.downloadUrl && (
                    <button
                      onClick={() => handleDownload(backup.id, `backup-${backup.id}`)}
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      title="Download backup"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Export Templates */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-6">Export Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {getExportTypeIcon(template.type)}
                      </span>
                      <h4 className="font-medium">{template.name}</h4>
                    </div>
                    
                    {template.isDefault && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Default
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{getFormatIcon(template.format)} {template.format.toUpperCase()}</span>
                    <span>{template.usageCount.toLocaleString()} uses</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Use Template
                    </button>
                    
                    <button
                      className="p-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                      title="Copy template"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Export Modal Placeholder */}
      {showNewExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg border max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Export</h3>
            <p className="text-muted-foreground mb-6">
              Choose what data you'd like to export and in which format.
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Export Type</label>
                <select className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value={ExportType.FULL_ACCOUNT}>Complete Account</option>
                  <option value={ExportType.FILES_ONLY}>Files Only</option>
                  <option value={ExportType.ANALYTICS_DATA}>Analytics Data</option>
                  <option value={ExportType.BILLING_DATA}>Billing Data</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Format</label>
                <select className="w-full px-3 py-2 border rounded-md bg-background">
                  <option value={ExportFormat.ZIP}>ZIP Archive</option>
                  <option value={ExportFormat.JSON}>JSON</option>
                  <option value={ExportFormat.CSV}>CSV</option>
                  <option value={ExportFormat.XLSX}>Excel</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleCreateExport(ExportType.FULL_ACCOUNT, ExportFormat.ZIP)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Create Export
              </button>
              <button
                onClick={() => setShowNewExportModal(false)}
                className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
