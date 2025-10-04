// Accessibility utilities and helpers

export const ARIA_LABELS = {
  // Navigation
  MAIN_NAVIGATION: 'Main navigation',
  USER_MENU: 'User account menu',
  MOBILE_MENU: 'Mobile navigation menu',
  SEARCH: 'Search tools',
  THEME_TOGGLE: 'Toggle dark/light mode',
  
  // Tools
  TOOL_CARD: 'Tool card',
  FAVORITE_TOGGLE: 'Toggle favorite',
  TOOL_GRID: 'Available tools',
  
  // Announcements
  ANNOUNCEMENT: 'Announcement',
  DISMISS_ANNOUNCEMENT: 'Dismiss announcement',
  NOTIFICATIONS: 'Notifications',
  
  // Dashboard
  USAGE_CHART: 'Usage statistics chart',
  PROFILE_PICTURE: 'Profile picture',
  
  // Forms
  REQUIRED_FIELD: 'Required field',
  OPTIONAL_FIELD: 'Optional field',
} as const

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
} as const

// Focus management utilities
export class FocusManager {
  private static focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableSelectors))
  }

  static trapFocus(container: HTMLElement, event: KeyboardEvent) {
    if (event.key !== KEYBOARD_KEYS.TAB) return

    const focusableElements = this.getFocusableElements(container)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }
  }

  static restoreFocus(previousElement: HTMLElement | null) {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus()
    }
  }
}

// Screen reader utilities
export class ScreenReaderUtils {
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.setAttribute('class', 'sr-only')
    announcer.textContent = message

    document.body.appendChild(announcer)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  static describedBy(elementId: string, description: string) {
    let descriptionElement = document.getElementById(`${elementId}-description`)
    
    if (!descriptionElement) {
      descriptionElement = document.createElement('div')
      descriptionElement.id = `${elementId}-description`
      descriptionElement.className = 'sr-only'
      document.body.appendChild(descriptionElement)
    }
    
    descriptionElement.textContent = description
    return `${elementId}-description`
  }
}

// Color contrast utilities
export class ColorContrastUtils {
  static getContrastRatio(color1: string, color2: string): number {
    const getLuminance = (color: string): number => {
      // Simplified luminance calculation
      // In a real implementation, you'd parse the color properly
      return 0.5 // Placeholder
    }

    const lum1 = getLuminance(color1)
    const lum2 = getLuminance(color2)
    
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    
    return (brightest + 0.05) / (darkest + 0.05)
  }

  static meetsWCAGAA(color1: string, color2: string): boolean {
    return this.getContrastRatio(color1, color2) >= 4.5
  }

  static meetsWCAGAAA(color1: string, color2: string): boolean {
    return this.getContrastRatio(color1, color2) >= 7
  }
}

// Keyboard navigation helpers
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  options: {
    onEnter?: () => void
    onSpace?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
  }
) => {
  switch (event.key) {
    case KEYBOARD_KEYS.ENTER:
      event.preventDefault()
      options.onEnter?.()
      break
    case KEYBOARD_KEYS.SPACE:
      event.preventDefault()
      options.onSpace?.()
      break
    case KEYBOARD_KEYS.ESCAPE:
      event.preventDefault()
      options.onEscape?.()
      break
    case KEYBOARD_KEYS.ARROW_UP:
      event.preventDefault()
      options.onArrowUp?.()
      break
    case KEYBOARD_KEYS.ARROW_DOWN:
      event.preventDefault()
      options.onArrowDown?.()
      break
    case KEYBOARD_KEYS.ARROW_LEFT:
      event.preventDefault()
      options.onArrowLeft?.()
      break
    case KEYBOARD_KEYS.ARROW_RIGHT:
      event.preventDefault()
      options.onArrowRight?.()
      break
  }
}

// Reduced motion utilities
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// High contrast mode detection
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}
