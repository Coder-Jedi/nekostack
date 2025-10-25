'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeftRight, Copy, RotateCcw, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'
import { CustomSelect } from './custom-select'
import { currencyService } from '@/lib/api/services/currency'
import { Currency, ConversionHistoryItem } from '@/lib/api/types'

// Fallback currencies for client-side conversion
const fallbackCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
]

// Module-level variables to track currency loading state globally
// This persists across component unmounts/remounts
let globalCurrenciesLoaded = false
let globalCurrenciesPromise: Promise<Currency[]> | null = null

interface CurrencyConverterProps {
  onConversion: (conversion: ConversionHistoryItem) => void
}

export function CurrencyConverter({ onConversion }: CurrencyConverterProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(fallbackCurrencies)
  const [fromCurrency, setFromCurrency] = useState(0)
  const [toCurrency, setToCurrency] = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [exchangeRate, setExchangeRate] = useState(1)

  // Client-side fallback conversion (simplified)
  const convertCurrencyClientSide = (amount: number, fromCode: string, toCode: string) => {
    // Mock rates for fallback
    const mockRates: Record<string, number> = {
      'USD': 1,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110,
      'CAD': 1.25,
      'AUD': 1.35,
      'CHF': 0.92,
      'CNY': 6.45,
      'INR': 74.5,
      'BRL': 5.2,
      'MXN': 20.1,
      'KRW': 1180
    }
    
    const fromRate = mockRates[fromCode] || 1
    const toRate = mockRates[toCode] || 1
    return (amount / fromRate) * toRate
  }

  const handleConvert = useCallback(async () => {
    if (!inputValue || isNaN(Number(inputValue))) return

    setIsConverting(true)
    setApiError(null)
    
    try {
      const amount = Number(inputValue)
      const fromCode = currencies[fromCurrency].code
      const toCode = currencies[toCurrency].code
      
      let convertedAmount: number
      let rate: number
      
      try {
        // Try API conversion first
        const response = await currencyService.convert({
          amount,
          fromCurrency: fromCode,
          toCurrency: toCode
        })
        
        convertedAmount = response.converted.amount
        rate = response.exchangeRate
        setExchangeRate(rate)
        
      } catch (error) {
        console.warn('API conversion failed, using client-side fallback:', error)
        setApiError('Using offline rates - may not be current')
        
        // Fallback to client-side conversion
        convertedAmount = convertCurrencyClientSide(amount, fromCode, toCode)
        rate = convertCurrencyClientSide(1, fromCode, toCode)
        setExchangeRate(rate)
      }
      
      setResult(convertedAmount.toFixed(2))
      
      // Add to history
      onConversion({
        type: 'currency',
        from: `${currencies[fromCurrency].symbol}${amount} ${currencies[fromCurrency].code}`,
        to: `${currencies[toCurrency].symbol}${convertedAmount.toFixed(2)} ${currencies[toCurrency].code}`,
        rate,
        timestamp: new Date().toISOString()
      })
      
    } catch (error) {
      console.error('Conversion error:', error)
      setApiError('Conversion failed. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }, [inputValue, fromCurrency, toCurrency, currencies, onConversion])

  const handleSwap = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setInputValue(result)
    setResult('')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleReset = () => {
    setInputValue('')
    setResult('')
  }

  const handleRefreshRates = async () => {
    setIsRefreshing(true)
    setApiError(null)
    
    try {
      // Only refresh rates, not currency list (list is already loaded on mount)
      const ratesResponse = await currencyService.refreshRates()
      setLastUpdated(new Date(ratesResponse.lastUpdated))
      
    } catch (error) {
      console.warn('Failed to refresh rates:', error)
      setApiError('Failed to refresh rates - using cached data')
      setLastUpdated(new Date())
    } finally {
      setIsRefreshing(false)
    }
  }

  // Load currencies on component mount
  useEffect(() => {
    const loadCurrencies = async () => {
      // If already loaded, use cached data
      if (globalCurrenciesLoaded) {
        return
      }
      
      // If there's already a pending request, wait for it
      if (globalCurrenciesPromise) {
        try {
          const apiCurrencies = await globalCurrenciesPromise
          setCurrencies(apiCurrencies)
        } catch (error) {
          console.warn('Failed to load currencies from existing API call, using fallback:', error)
          setCurrencies(fallbackCurrencies)
        }
        return
      }
      
      // Start new API call
      globalCurrenciesPromise = currencyService.getCurrencies()
      
      try {
        const apiCurrencies = await globalCurrenciesPromise
        setCurrencies(apiCurrencies)
        globalCurrenciesLoaded = true
      } catch (error) {
        console.warn('Failed to load currencies from API, using fallback:', error)
        setCurrencies(fallbackCurrencies)
        globalCurrenciesLoaded = true
      } finally {
        // Clear the promise so future calls can start fresh
        globalCurrenciesPromise = null
      }
    }
    
    loadCurrencies()
  }, []) // Empty dependency array - only run on mount

  // Auto-convert when input changes
  useEffect(() => {
    if (inputValue && !isNaN(Number(inputValue))) {
      handleConvert()
    }
  }, [inputValue, fromCurrency, toCurrency, handleConvert])

  // Calculate exchange rate for display
  const displayExchangeRate = exchangeRate || 1

  return (
    <div className="bg-card rounded-2xl border-2 border-primary/20 shadow-xl p-8 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Currency Converter</h2>
          <button
            onClick={handleRefreshRates}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 bg-muted/50 hover:bg-muted rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Rates
          </button>
        </div>
        <p className="text-lg text-muted-foreground mb-2">
          Convert between currencies with real-time exchange rates
        </p>
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
        {apiError && (
          <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2 text-sm text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            {apiError}
          </div>
        )}
      </div>

      {/* Exchange Rate Display */}
      <div className="relative z-10 mb-6 p-4 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-lg border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-medium">
              1 {currencies[fromCurrency].code} = {displayExchangeRate.toFixed(4)} {currencies[toCurrency].code}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Live Rate
          </div>
        </div>
      </div>

      {/* Conversion Input */}
      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From Currency */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">From</label>
            <div className="space-y-3">
              <CustomSelect
                options={currencies.map((currency, index) => ({
                  value: index,
                  label: `${currency.code} - ${currency.name}`,
                  symbol: currency.symbol
                }))}
                value={fromCurrency}
                onChange={setFromCurrency}
                placeholder="Select currency"
              />
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-4 pr-12 border-2 border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base"
                />
                {inputValue && (
                  <button
                    onClick={() => handleCopy(inputValue)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy amount"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center">
            <button
              onClick={handleSwap}
              className="p-4 rounded-xl bg-primary/10 hover:bg-primary/20 border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 group"
              title="Swap currencies"
            >
              <ArrowLeftRight className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* To Currency */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">To</label>
            <div className="space-y-3">
              <CustomSelect
                options={currencies.map((currency, index) => ({
                  value: index,
                  label: `${currency.code} - ${currency.name}`,
                  symbol: currency.symbol
                }))}
                value={toCurrency}
                onChange={setToCurrency}
                placeholder="Select currency"
              />
              <div className="relative">
                <input
                  type="text"
                  value={result}
                  readOnly
                  placeholder="Result will appear here"
                  className="w-full p-4 pr-12 border-2 border-primary/20 rounded-xl bg-primary/5 text-base font-medium"
                />
                {result && (
                  <button
                    onClick={() => handleCopy(result)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy result"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleConvert}
            disabled={!inputValue || isNaN(Number(inputValue)) || isConverting}
            className="flex-1 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            {isConverting ? 'Converting...' : 'Convert'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-4 border-2 border-input rounded-xl hover:bg-muted transition-all duration-200 flex items-center gap-2 font-medium hover:scale-105"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Popular Currencies */}
      <div className="relative z-0 mt-8">
        <h3 className="text-base font-semibold mb-4 text-foreground">Popular Currencies</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {currencies.slice(0, 8).map((currency, index) => (
            <button
              key={currency.code}
              onClick={() => {
                if (fromCurrency === index) {
                  setToCurrency(index)
                } else {
                  setFromCurrency(index)
                }
              }}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                fromCurrency === index || toCurrency === index
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80 border border-border/50 hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{currency.symbol}</span>
                <span>{currency.code}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
