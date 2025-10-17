'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface SelectOption {
  value: number
  label: string
  symbol: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: number
  onChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option",
  disabled = false,
  className = ""
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const selectRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && listRef.current) {
      const selectedElement = listRef.current.querySelector('[data-selected="true"]')
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [isOpen])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value)
          setIsOpen(false)
        } else {
          setIsOpen(!isOpen)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          )
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          )
        }
        break
    }
  }

  const handleOptionClick = (optionValue: number) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleMouseEnter = (index: number) => {
    setHighlightedIndex(index)
  }

  return (
    <div 
      ref={selectRef}
      className={`relative ${className}`}
    >
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          w-full p-4 border-2 rounded-xl bg-background text-left
          focus:ring-2 focus:ring-primary focus:border-primary
          transition-all duration-200 text-base
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-primary/50 cursor-pointer'
          }
          ${isOpen 
            ? 'border-primary ring-2 ring-primary/20' 
            : 'border-input'
          }
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="select-label"
      >
        <div className="flex items-center justify-between">
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption ? (
              <span className="flex items-center gap-2">
                <span className="font-medium">{selectedOption.symbol}</span>
                <span>{selectedOption.label}</span>
              </span>
            ) : (
              placeholder
            )}
          </span>
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-[99999] w-full mt-1" style={{ zIndex: 99999 }}>
          <ul
            ref={listRef}
            className="
              bg-card border-2 border-primary/20 rounded-xl shadow-xl
              max-h-60 overflow-y-auto py-2
              backdrop-blur-sm
            "
            style={{ zIndex: 99999 }}
            role="listbox"
            aria-label="Select option"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                data-selected={option.value === value}
                onClick={() => handleOptionClick(option.value)}
                onMouseEnter={() => handleMouseEnter(index)}
                className={`
                  px-4 py-3 cursor-pointer transition-all duration-150
                  flex items-center justify-between
                  ${option.value === value
                    ? 'bg-primary text-primary-foreground'
                    : highlightedIndex === index
                    ? 'bg-primary/10 text-foreground'
                    : 'text-foreground hover:bg-muted/50'
                  }
                `}
                role="option"
                aria-selected={option.value === value}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-lg">{option.symbol}</span>
                  <span className="font-medium">{option.label}</span>
                </div>
                {option.value === value && (
                  <Check className="h-4 w-4 text-primary-foreground" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
