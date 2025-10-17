'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftRight, Copy, RotateCcw } from 'lucide-react'
import { CustomSelect } from './custom-select'

interface UnitCategory {
  name: string
  units: {
    name: string
    symbol: string
    factor: number
  }[]
}

const unitCategories: UnitCategory[] = [
  {
    name: 'Length',
    units: [
      { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { name: 'Meter', symbol: 'm', factor: 1 },
      { name: 'Kilometer', symbol: 'km', factor: 1000 },
      { name: 'Inch', symbol: 'in', factor: 0.0254 },
      { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { name: 'Mile', symbol: 'mi', factor: 1609.344 }
    ]
  },
  {
    name: 'Weight',
    units: [
      { name: 'Milligram', symbol: 'mg', factor: 0.001 },
      { name: 'Gram', symbol: 'g', factor: 1 },
      { name: 'Kilogram', symbol: 'kg', factor: 1000 },
      { name: 'Ounce', symbol: 'oz', factor: 28.3495 },
      { name: 'Pound', symbol: 'lb', factor: 453.592 },
      { name: 'Ton', symbol: 't', factor: 1000000 }
    ]
  },
  {
    name: 'Temperature',
    units: [
      { name: 'Celsius', symbol: '°C', factor: 1 },
      { name: 'Fahrenheit', symbol: '°F', factor: 1 },
      { name: 'Kelvin', symbol: 'K', factor: 1 }
    ]
  },
  {
    name: 'Area',
    units: [
      { name: 'Square Meter', symbol: 'm²', factor: 1 },
      { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
      { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 },
      { name: 'Acre', symbol: 'ac', factor: 4046.86 },
      { name: 'Hectare', symbol: 'ha', factor: 10000 }
    ]
  },
  {
    name: 'Volume',
    units: [
      { name: 'Milliliter', symbol: 'ml', factor: 0.001 },
      { name: 'Liter', symbol: 'l', factor: 1 },
      { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { name: 'Fluid Ounce', symbol: 'fl oz', factor: 0.0295735 },
      { name: 'Cup', symbol: 'cup', factor: 0.236588 },
      { name: 'Pint', symbol: 'pt', factor: 0.473176 },
      { name: 'Quart', symbol: 'qt', factor: 0.946353 },
      { name: 'Gallon', symbol: 'gal', factor: 3.78541 }
    ]
  }
]

interface UnitConverterProps {
  onConversion: (conversion: any) => void
}

export function UnitConverter({ onConversion }: UnitConverterProps) {
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [fromUnit, setFromUnit] = useState(0)
  const [toUnit, setToUnit] = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  const currentCategory = unitCategories[selectedCategory]
  const currentUnits = currentCategory.units

  const convertValue = (value: number, from: number, to: number, category: string) => {
    if (category === 'Temperature') {
      // Special handling for temperature conversions
      const celsius = from === 0 ? value : from === 1 ? (value - 32) * 5/9 : value - 273.15
      if (to === 0) return celsius
      if (to === 1) return celsius * 9/5 + 32
      return celsius + 273.15
    }
    
    // Standard conversion for other units
    const baseValue = value * currentUnits[from].factor
    return baseValue / currentUnits[to].factor
  }

  const handleConvert = () => {
    if (!inputValue || isNaN(Number(inputValue))) return

    setIsConverting(true)
    
    // Simulate conversion delay for better UX
    setTimeout(() => {
      const value = Number(inputValue)
      const convertedValue = convertValue(value, fromUnit, toUnit, currentCategory.name)
      
      setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''))
      
      // Add to history
      onConversion({
        type: 'unit',
        category: currentCategory.name,
        from: `${value} ${currentUnits[fromUnit].symbol}`,
        to: `${convertedValue.toFixed(6).replace(/\.?0+$/, '')} ${currentUnits[toUnit].symbol}`,
        timestamp: new Date().toISOString()
      })
      
      setIsConverting(false)
    }, 300)
  }

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
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

  // Auto-convert when input changes
  useEffect(() => {
    if (inputValue && !isNaN(Number(inputValue))) {
      handleConvert()
    }
  }, [inputValue, fromUnit, toUnit, selectedCategory])

  return (
    <div className="bg-card rounded-2xl border-2 border-primary/20 shadow-xl p-8 pb-24 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
      <div className="relative z-10 mb-8">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Unit Converter</h2>
        <p className="text-lg text-muted-foreground">
          Convert between different units of measurement
        </p>
      </div>

      {/* Category Selection */}
      <div className="relative z-10 mb-6">
        <label className="block text-sm font-medium mb-3">Category</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {unitCategories.map((category, index) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(index)
                setFromUnit(0)
                setToUnit(1)
                setInputValue('')
                setResult('')
              }}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Input */}
      <div className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* From Unit */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">From</label>
            <div className="space-y-3">
              <CustomSelect
                options={currentUnits.map((unit, index) => ({
                  value: index,
                  label: unit.name,
                  symbol: unit.symbol
                }))}
                value={fromUnit}
                onChange={setFromUnit}
                placeholder="Select unit"
              />
              <div className="relative">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full p-4 pr-12 border-2 border-input rounded-xl bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base"
                />
                {inputValue && (
                  <button
                    onClick={() => handleCopy(inputValue)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy value"
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
              title="Swap units"
            >
              <ArrowLeftRight className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>

          {/* To Unit */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">To</label>
            <div className="space-y-3">
              <CustomSelect
                options={currentUnits.map((unit, index) => ({
                  value: index,
                  label: unit.name,
                  symbol: unit.symbol
                }))}
                value={toUnit}
                onChange={setToUnit}
                placeholder="Select unit"
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
    </div>
  )
}
