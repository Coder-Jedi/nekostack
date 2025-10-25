// Unit Converter API routes

import { RequestContext } from '../../../shared/src/types';
import { 
  createSuccessResponse, 
  createBadRequestResponse,
  createErrorResponse 
} from '../../../shared/src/utils/response';
import { validateBody, requestSchemas } from '../../../shared/src/utils/validation';

// POST /api/tools/unit-converter - Convert units
export async function convertUnits(context: RequestContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const validation = validateBody(requestSchemas.unitConverter, body);
    
    if (!validation.success) {
      return createBadRequestResponse('Invalid request data');
    }

    const { value, fromUnit, toUnit, category } = validation.data;
    
    // Perform conversion
    const result = await performUnitConversion(value, fromUnit, toUnit, category);
    
    return createSuccessResponse({
      original: {
        value,
        unit: fromUnit
      },
      converted: {
        value: result.value,
        unit: toUnit
      },
      rate: result.rate,
      category,
      timestamp: new Date().toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Unit converter error:', error);
    return createErrorResponse('Unit conversion failed', 'CONVERSION_ERROR', 500, context.request_id);
  }
}

// POST /api/tools/unit-converter/currency - Convert currency
export async function convertCurrency(context: RequestContext): Promise<Response> {
  try {
    const body = await context.request.json();
    const validation = validateBody(requestSchemas.currencyConverter, body);
    
    if (!validation.success) {
      return createBadRequestResponse('Invalid request data');
    }

    const { amount, fromCurrency, toCurrency, date } = validation.data;
    
    // Get exchange rate
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency, date);
    
    const convertedAmount = amount * exchangeRate;
    
    return createSuccessResponse({
      original: {
        amount,
        currency: fromCurrency
      },
      converted: {
        amount: Math.round(convertedAmount * 100) / 100,
        currency: toCurrency
      },
      exchangeRate,
      date: date || new Date().toISOString(),
      timestamp: new Date().toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Currency converter error:', error);
    return createErrorResponse('Currency conversion failed', 'CURRENCY_ERROR', 500, context.request_id);
  }
}

// GET /api/tools/unit-converter/categories - Get conversion categories
export async function getConversionCategories(context: RequestContext): Promise<Response> {
  try {
    const categories = [
      {
        id: 'length',
        name: 'Length',
        units: ['meter', 'kilometer', 'centimeter', 'millimeter', 'inch', 'foot', 'yard', 'mile']
      },
      {
        id: 'weight',
        name: 'Weight',
        units: ['gram', 'kilogram', 'pound', 'ounce', 'ton', 'stone']
      },
      {
        id: 'temperature',
        name: 'Temperature',
        units: ['celsius', 'fahrenheit', 'kelvin']
      },
      {
        id: 'area',
        name: 'Area',
        units: ['square_meter', 'square_kilometer', 'square_foot', 'square_inch', 'acre', 'hectare']
      },
      {
        id: 'volume',
        name: 'Volume',
        units: ['liter', 'milliliter', 'gallon', 'quart', 'pint', 'cup', 'fluid_ounce']
      },
      {
        id: 'time',
        name: 'Time',
        units: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']
      }
    ];

    return createSuccessResponse(categories, context.request_id);
  } catch (error) {
    console.error('Get categories error:', error);
    return createErrorResponse('Failed to fetch categories', 'CATEGORIES_ERROR', 500, context.request_id);
  }
}

// Helper function to perform unit conversion
async function performUnitConversion(
  value: number, 
  fromUnit: string, 
  toUnit: string, 
  category: string
): Promise<{ value: number; rate: number }> {
  // Conversion rates (simplified - in production, use a proper conversion library)
  const conversionRates: Record<string, Record<string, number>> = {
    length: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34
    },
    weight: {
      gram: 1,
      kilogram: 1000,
      pound: 453.592,
      ounce: 28.3495,
      ton: 1000000,
      stone: 6350.29
    },
    temperature: {
      celsius: 1,
      fahrenheit: 1, // Special handling needed
      kelvin: 1 // Special handling needed
    },
    area: {
      square_meter: 1,
      square_kilometer: 1000000,
      square_foot: 0.092903,
      square_inch: 0.00064516,
      acre: 4046.86,
      hectare: 10000
    },
    volume: {
      liter: 1,
      milliliter: 0.001,
      gallon: 3.78541,
      quart: 0.946353,
      pint: 0.473176,
      cup: 0.236588,
      fluid_ounce: 0.0295735
    },
    time: {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629746, // Approximate
      year: 31556952 // Approximate
    }
  };

  const rates = conversionRates[category];
  if (!rates || !rates[fromUnit] || !rates[toUnit]) {
    throw new Error(`Unsupported conversion: ${fromUnit} to ${toUnit} in ${category}`);
  }

  // Handle temperature conversions specially
  if (category === 'temperature') {
    return convertTemperature(value, fromUnit, toUnit);
  }

  // Convert to base unit, then to target unit
  const baseValue = value * rates[fromUnit];
  const convertedValue = baseValue / rates[toUnit];
  const rate = rates[fromUnit] / rates[toUnit];

  return {
    value: Math.round(convertedValue * 1000000) / 1000000, // Round to 6 decimal places
    rate
  };
}

// Helper function to convert temperature
function convertTemperature(value: number, fromUnit: string, toUnit: string): { value: number; rate: number } {
  let celsius: number;

  // Convert to Celsius
  switch (fromUnit) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
    default:
      throw new Error(`Unsupported temperature unit: ${fromUnit}`);
  }

  // Convert from Celsius
  let result: number;
  switch (toUnit) {
    case 'celsius':
      result = celsius;
      break;
    case 'fahrenheit':
      result = celsius * 9 / 5 + 32;
      break;
    case 'kelvin':
      result = celsius + 273.15;
      break;
    default:
      throw new Error(`Unsupported temperature unit: ${toUnit}`);
  }

  return {
    value: Math.round(result * 100) / 100,
    rate: 1 // Temperature conversion doesn't have a simple rate
  };
}

// Helper function to get exchange rate (mock implementation)
async function getExchangeRate(fromCurrency: string, toCurrency: string, date?: string): Promise<number> {
  // In production, this would call a real currency API
  // For now, return mock rates
  const mockRates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35
    },
    EUR: {
      USD: 1.18,
      GBP: 0.86,
      JPY: 129.0,
      CAD: 1.47,
      AUD: 1.59
    }
  };

  if (fromCurrency === toCurrency) {
    return 1;
  }

  const rate = mockRates[fromCurrency]?.[toCurrency];
  if (rate) {
    return rate;
  }

  // If direct rate not available, try reverse rate
  const reverseRate = mockRates[toCurrency]?.[fromCurrency];
  if (reverseRate) {
    return 1 / reverseRate;
  }

  throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
}

// GET /api/tools/unit-converter/currency/list
export async function getCurrencyList(context: RequestContext): Promise<Response> {
  const currencies = [
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
  ];
  return createSuccessResponse({ currencies }, context.request_id);
}

// GET /api/tools/unit-converter/currency/rates
export async function getCurrencyRates(context: RequestContext): Promise<Response> {
  return createSuccessResponse({
    lastUpdated: new Date().toISOString(),
    source: 'mock-exchange-api',
    nextUpdate: new Date(Date.now() + 3600000).toISOString()
  }, context.request_id);
}
