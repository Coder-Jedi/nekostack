'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Shield, 
  Globe, 
  Zap,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  Download,
  Trash2,
  Save,
  Check
} from 'lucide-react'
import { LanguageSelector } from '@/components/layout/language-selector'
import { useAnalytics } from '@/lib/analytics'

interface SettingsState {
  // General
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  
  // Appearance
  compactMode: boolean
  animations: boolean
  
  // Notifications
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  productUpdates: boolean
  maintenanceNotices: boolean
  
  // Privacy
  usageAnalytics: boolean
  crashReports: boolean
  twoFactorAuth: boolean
}

const defaultSettings: SettingsState = {
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  compactMode: false,
  animations: true,
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  securityAlerts: true,
  productUpdates: true,
  maintenanceNotices: true,
  usageAnalytics: true,
  crashReports: true,
  twoFactorAuth: false
}

export default function SettingsPage() {
  const t = useTranslations('settings')
  const tCommon = useTranslations('common')
  const tSuccess = useTranslations('success')
  const { theme, setTheme } = useTheme()
  const { buttonClicked } = useAnalytics()
  
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [activeSection, setActiveSection] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('nekostack-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const handleSettingChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    buttonClicked('settings_save', 'settings_page', { section: activeSection })
    
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('nekostack-settings', JSON.stringify(settings))
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setHasChanges(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    buttonClicked('export_data', 'settings_page')
    // In a real app, this would trigger data export
    console.log('Exporting user data...')
  }

  const handleDeleteAccount = () => {
    buttonClicked('delete_account_request', 'settings_page')
    // In a real app, this would show a confirmation modal
    console.log('Delete account requested...')
  }

  const sections = [
    { id: 'general', label: t('sections.general'), icon: SettingsIcon },
    { id: 'appearance', label: t('sections.appearance'), icon: Palette },
    { id: 'notifications', label: t('sections.notifications'), icon: Bell },
    { id: 'privacy', label: t('sections.privacy'), icon: Shield },
    { id: 'language', label: t('sections.language'), icon: Globe },
    { id: 'advanced', label: t('sections.advanced'), icon: Zap }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors disabled:opacity-50 mt-4 sm:mt-0"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {tCommon('save')}
              </>
            )}
          </button>
        )}
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-green-800 dark:text-green-200">{tSuccess('saved')}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center w-full px-3 py-2 text-left rounded-lg transition-colors
                  ${activeSection === section.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <section.icon className="h-4 w-4 mr-3" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg border p-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{t('general.title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('general.timezone')}
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('general.dateFormat')}
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('general.timeFormat')}
                    </label>
                    <select
                      value={settings.timeFormat}
                      onChange={(e) => handleSettingChange('timeFormat', e.target.value as '12h' | '24h')}
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                      <option value="12h">12-hour</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{t('appearance.title')}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      {t('appearance.theme')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: t('appearance.themes.light'), icon: Sun },
                        { value: 'dark', label: t('appearance.themes.dark'), icon: Moon },
                        { value: 'system', label: t('appearance.themes.system'), icon: Monitor }
                      ].map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => setTheme(themeOption.value)}
                          className={`
                            flex flex-col items-center p-4 border rounded-lg transition-colors
                            ${theme === themeOption.value 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:bg-muted'
                            }
                          `}
                        >
                          <themeOption.icon className="h-6 w-6 mb-2" />
                          <span className="text-sm font-medium">{themeOption.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('appearance.compactMode')}</label>
                      <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.compactMode}
                        onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('appearance.animations')}</label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.animations}
                        onChange={(e) => handleSettingChange('animations', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{t('notifications.title')}</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: t('notifications.email'), icon: Mail },
                    { key: 'pushNotifications', label: t('notifications.push'), icon: Smartphone },
                    { key: 'marketingEmails', label: t('notifications.marketing'), icon: MessageSquare },
                    { key: 'securityAlerts', label: t('notifications.security'), icon: Shield },
                    { key: 'productUpdates', label: t('notifications.updates'), icon: Zap },
                    { key: 'maintenanceNotices', label: t('notifications.maintenance'), icon: SettingsIcon }
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <notification.icon className="h-5 w-5 text-muted-foreground mr-3" />
                        <label className="text-sm font-medium">{notification.label}</label>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings[notification.key as keyof SettingsState] as boolean}
                          onChange={(e) => handleSettingChange(notification.key as keyof SettingsState, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{t('privacy.title')}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('privacy.analytics')}</label>
                      <p className="text-sm text-muted-foreground">Help us improve by sharing anonymous usage data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.usageAnalytics}
                        onChange={(e) => handleSettingChange('usageAnalytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('privacy.crashReports')}</label>
                      <p className="text-sm text-muted-foreground">Automatically send crash reports to help us fix issues</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.crashReports}
                        onChange={(e) => handleSettingChange('crashReports', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">{t('privacy.twoFactor')}</label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <hr />
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleExportData}
                      className="flex items-center w-full px-4 py-3 text-left border rounded-lg hover:bg-muted transition-colors"
                    >
                      <Download className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{t('privacy.dataDownload')}</div>
                        <div className="text-sm text-muted-foreground">Download a copy of all your data</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center w-full px-4 py-3 text-left border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-5 w-5 mr-3" />
                      <div>
                        <div className="font-medium">{t('privacy.deleteAccount')}</div>
                        <div className="text-sm text-red-500">Permanently delete your account and all data</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Language Settings */}
            {activeSection === 'language' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{t('language.title')}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      {t('language.language')}
                    </label>
                    <LanguageSelector />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('language.region')}
                    </label>
                    <select className="w-full px-3 py-2 border rounded-md bg-background">
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="ES">Spain</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('language.currency')}
                    </label>
                    <select className="w-full px-3 py-2 border rounded-md bg-background">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                      <option value="CNY">CNY - Chinese Yuan</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeSection === 'advanced' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">{t('sections.advanced')}</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Eye className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                      <span className="font-medium text-yellow-800 dark:text-yellow-200">Advanced Settings</span>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      These settings are for advanced users only. Changing these settings may affect the performance and functionality of the application.
                    </p>
                  </div>
                  
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4" />
                    <p>Advanced settings will be available in a future update.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
