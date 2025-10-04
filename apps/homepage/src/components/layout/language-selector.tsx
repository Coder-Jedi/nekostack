'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { useAnalytics } from '@/lib/analytics'

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale
  const { buttonClicked } = useAnalytics()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    buttonClicked('language_changed', 'language_selector', { 
      from: locale, 
      to: newLocale 
    })
    
    setIsOpen(false)
    
    // Replace the locale in the current pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    router.push(newPath)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent transition-colors"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-lg" role="img" aria-label={localeNames[locale]}>
          {localeFlags[locale]}
        </span>
        <span className="hidden sm:inline text-sm font-medium">
          {localeNames[locale]}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-lg shadow-lg z-50 animate-slide-down">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b">
              Select Language
            </div>
            
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`
                  flex items-center w-full px-3 py-2 text-sm hover:bg-accent transition-colors
                  ${locale === loc ? 'bg-accent/50' : ''}
                `}
              >
                <span className="text-lg mr-3" role="img" aria-label={localeNames[loc]}>
                  {localeFlags[loc]}
                </span>
                <span className="flex-1 text-left">
                  {localeNames[loc]}
                </span>
                {locale === loc && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="border-t px-3 py-2">
            <p className="text-xs text-muted-foreground">
              Help us improve translations
            </p>
            <button className="text-xs text-primary hover:underline mt-1">
              Contribute translations
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
