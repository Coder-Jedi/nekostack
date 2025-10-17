'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, Star, History, Calculator, DollarSign } from 'lucide-react'
import { UnitConverter } from '@/components/tools/unit-converter/unit-converter'
import { CurrencyConverter } from '@/components/tools/unit-converter/currency-converter'
import { ConversionHistory } from '@/components/tools/unit-converter/conversion-history'
import { useAnalytics } from '@/lib/analytics'

export default function UnitConverterPage() {
  const [activeTab, setActiveTab] = useState<'units' | 'currency'>('units')
  const [conversionHistory, setConversionHistory] = useState<any[]>([])
  const { toolUsed } = useAnalytics()

  useEffect(() => {
    // Track tool usage
    toolUsed('unit-converter', 'unit_converter_page', {
      toolName: 'Unit & Currency Converter',
      toolCategory: 'converter'
    })

    // Load conversion history from localStorage
    const savedHistory = localStorage.getItem('unit-converter-history')
    if (savedHistory) {
      try {
        setConversionHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Failed to load conversion history:', error)
      }
    }
  }, [toolUsed])

  const addToHistory = (conversion: any) => {
    const newHistory = [conversion, ...conversionHistory.slice(0, 49)] // Keep last 50 conversions
    setConversionHistory(newHistory)
    localStorage.setItem('unit-converter-history', JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setConversionHistory([])
    localStorage.removeItem('unit-converter-history')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <ArrowLeftRight className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Unit & Currency Converter
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Convert between units of measurement and currencies with real-time exchange rates
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>1.2k conversions</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Real-time rates</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('units')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'units'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Unit Converter
            </button>
            <button
              onClick={() => setActiveTab('currency')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'currency'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Currency Converter
            </button>
          </div>
        </div>

        {/* Main Converter Card - Centered */}
        <div className="max-w-4xl mx-auto mb-12">
          {activeTab === 'units' ? (
            <UnitConverter onConversion={addToHistory} />
          ) : (
            <CurrencyConverter onConversion={addToHistory} />
          )}
        </div>

        {/* Conversion History - Below Main Card */}
        <div className="max-w-4xl mx-auto">
          <ConversionHistory 
            history={conversionHistory}
            onClear={clearHistory}
          />
        </div>
      </div>
    </div>
  )
}
