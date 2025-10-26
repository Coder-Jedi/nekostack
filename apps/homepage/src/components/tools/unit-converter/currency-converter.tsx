'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeftRight, Copy, RotateCcw, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'
import { CustomSelect } from './custom-select'
import { currencyService } from '@/lib/api/services/currency'
import { Currency, ConversionHistoryItem } from '@/lib/api/types'

// Fallback currencies for client-side conversion
const fallbackCurrencies: Currency[] = [
  // Major Fiat Currencies
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
  { code: 'EUR', name: 'European Euro', symbol: '€' },
  { code: 'GBP', name: 'Pound Sterling', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan Renminbi', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  
  // Additional Major Currencies
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب' },
  { code: 'BND', name: 'Brunei Dollar', symbol: '$' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs' },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: '$' },
  { code: 'BWP', name: 'Botswanan Pula', symbol: 'P' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
  { code: 'BZD', name: 'Belize Dollar', symbol: '$' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$' },
  { code: 'CRC', name: 'Costa Rican Colon', symbol: '₡' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'DOP', name: 'Dominican Peso', symbol: '$' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
  { code: 'FJD', name: 'Fijian Dollar', symbol: '$' },
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: '£' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'GIP', name: 'Gibraltar Pound', symbol: '£' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: '$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'د.ع' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
  { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: '$' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: '$' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: '$' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$' },
  { code: 'MRO', name: 'Mauritanian Ouguiya', symbol: 'UM' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: '$' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'NIO', name: 'Nicaraguan Cordoba', symbol: 'C$' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'дин' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF' },
  { code: 'SAR', name: 'Saudi Arabian Riyal', symbol: '﷼' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { code: 'SHP', name: 'Saint Helena Pound', symbol: '£' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'S' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$' },
  { code: 'STN', name: 'Sao Tome And Principe Dobra', symbol: 'Db' },
  { code: 'SYP', name: 'Syrian Pound', symbol: '£' },
  { code: 'SVC', name: 'Salvadoran Colón', symbol: '₡' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM' },
  { code: 'TMT', name: 'Turkmen Manat', symbol: 'T' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
  { code: 'TOP', name: 'Tongan Pa†anga', symbol: 'T$' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'TTD', name: 'Trinidad And Tobago Dollar', symbol: '$' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: '$' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'лв' },
  { code: 'VES', name: 'Venezuelan Bolivar', symbol: 'Bs.S' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'Vt' },
  { code: 'WST', name: 'Samoan Tala', symbol: 'WS$' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA' },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: '$' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA' },
  { code: 'XPF', name: 'CFP Franc', symbol: '₣' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
  
  // Cryptocurrencies
  { code: 'ADA', name: 'Cardano', symbol: '₳' },
  { code: 'BNB', name: 'Binance Coin', symbol: 'BNB' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
  { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð' },
  { code: 'DOT', name: 'Polkadot', symbol: 'DOT' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
  { code: 'LINK', name: 'Chainlink', symbol: 'LINK' },
  { code: 'LTC', name: 'Litecoin', symbol: 'Ł' },
  { code: 'SOL', name: 'Solana', symbol: '◎' },
  { code: 'TRX', name: 'Tron', symbol: 'TRX' },
  { code: 'USDC', name: 'USD Coin', symbol: 'USDC' },
  { code: 'USDT', name: 'Tether', symbol: 'USDT' },
  { code: 'XRP', name: 'Ripple', symbol: 'XRP' }
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
        
        // Show warning if using expired cache
        if (response.isExpired) {
          setApiError('Using cached rates from previous day')
          setLastUpdated(new Date(response.lastUpdated))
        } else {
          setApiError(null)
          setLastUpdated(new Date(response.lastUpdated))
        }
        
      } catch (error) {
        console.error('API conversion failed:', error)
        setApiError('Currency conversion service unavailable. Please try again later.')
        throw error // Re-throw to be caught by outer catch
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
