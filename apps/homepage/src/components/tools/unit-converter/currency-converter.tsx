'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, Copy, RotateCcw, RefreshCw, TrendingUp } from 'lucide-react'
import { CustomSelect } from './custom-select'

interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 74.5 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 20.1 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1180 }
]

interface CurrencyConverterProps {
  onConversion: (conversion: any) => void
}

export function CurrencyConverter({ onConversion }: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState(0)
  const [toCurrency, setToCurrency] = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const convertCurrency = (amount: number, from: number, to: number) => {
    // Convert to USD first, then to target currency
    const usdAmount = amount / currencies[from].rate
    return usdAmount * currencies[to].rate
  }

  const handleConvert = () => {
    if (!inputValue || isNaN(Number(inputValue))) return

    setIsConverting(true)
    
    setTimeout(() => {
      const amount = Number(inputValue)
      const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency)
      
      setResult(convertedAmount.toFixed(2))
      
      // Add to history
      onConversion({
        type: 'currency',
        from: `${currencies[fromCurrency].symbol}${amount} ${currencies[fromCurrency].code}`,
        to: `${currencies[toCurrency].symbol}${convertedAmount.toFixed(2)} ${currencies[toCurrency].code}`,
        rate: currencies[toCurrency].rate / currencies[fromCurrency].rate,
        timestamp: new Date().toISOString()
      })
      
      setIsConverting(false)
    }, 300)
  }

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
    
    // Simulate API call to refresh rates
    setTimeout(() => {
      // In a real app, this would fetch from an API
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  // Auto-convert when input changes
  useEffect(() => {
    if (inputValue && !isNaN(Number(inputValue))) {
      handleConvert()
    }
  }, [inputValue, fromCurrency, toCurrency])

  const exchangeRate = currencies[toCurrency].rate / currencies[fromCurrency].rate

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
      </div>

      {/* Exchange Rate Display */}
      <div className="relative z-10 mb-6 p-4 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-lg border border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="font-medium">
              1 {currencies[fromCurrency].code} = {exchangeRate.toFixed(4)} {currencies[toCurrency].code}
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
