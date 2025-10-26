// Unit Converter API routes

import { RequestContext } from '../../../shared/src/types';
import { 
  createSuccessResponse, 
  createBadRequestResponse,
  createErrorResponse 
} from '../../../shared/src/utils/response';
import { validateBody, requestSchemas } from '../../../shared/src/utils/validation';
import { getExchangeRate, getForexMetadata } from '../services/forex-service';

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

    const { amount, fromCurrency, toCurrency } = validation.data;
    
    // Get exchange rate using forex service
    const rateData = await getExchangeRate(fromCurrency, toCurrency, context);
    
    const convertedAmount = amount * rateData.rate;
    
    return createSuccessResponse({
      original: {
        amount,
        currency: fromCurrency
      },
      converted: {
        amount: Math.round(convertedAmount * 100) / 100,
        currency: toCurrency
      },
      exchangeRate: rateData.rate,
      source: rateData.source,
      isExpired: rateData.isExpired,
      lastUpdated: rateData.lastUpdated,
      timestamp: new Date().toISOString()
    }, context.request_id);
  } catch (error) {
    console.error('Currency converter error:', error);
    
    // If no cache available, return 503
    if (error instanceof Error && error.message.includes('No forex rates available')) {
      return new Response(JSON.stringify({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Currency conversion service temporarily unavailable. Please try again later.'
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: context.request_id
        }
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '3600'
        }
      });
    }
    
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

// GET /api/tools/unit-converter/currency/list
export async function getCurrencyList(context: RequestContext): Promise<Response> {
  const currencies = [
    // Fiat Currencies (Alphabetical Order)
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
    { code: 'ALL', name: 'Albanian Lek', symbol: 'L' },
    { code: 'AMD', name: 'Armenian Dram', symbol: '֏' },
    { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'AZN', name: 'Azerbaijan Manat', symbol: '₼' },
    { code: 'BAM', name: 'Bosnia And Herzegovina Convertible Mark', symbol: 'КМ' },
    { code: 'BBD', name: 'Barbadian Dollar', symbol: '$' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب' },
    { code: 'BIF', name: 'Burundi Franc', symbol: 'FBu' },
    { code: 'BND', name: 'Brunei Dollar', symbol: '$' },
    { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'BSD', name: 'Bahamian Dollar', symbol: '$' },
    { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.' },
    { code: 'BWP', name: 'Botswanan Pula', symbol: 'P' },
    { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br' },
    { code: 'BZD', name: 'Belize Dollar', symbol: '$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CDF', name: 'Congolese Franc', symbol: 'FC' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CLF', name: 'Chilean Unit Of Account', symbol: 'UF' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    { code: 'CNY', name: 'Chinese Yuan Renminbi', symbol: '¥' },
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
    { code: 'EUR', name: 'European Euro', symbol: '€' },
    { code: 'FJD', name: 'Fijian Dollar', symbol: '$' },
    { code: 'FKP', name: 'Falkland Islands Pound', symbol: '£' },
    { code: 'GBP', name: 'Pound Sterling', symbol: '£' },
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
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'IQD', name: 'Iraqi Dinar', symbol: 'د.ع' },
    { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
    { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr' },
    { code: 'JMD', name: 'Jamaican Dollar', symbol: '$' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'CF' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
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
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
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
    { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'TTD', name: 'Trinidad And Tobago Dollar', symbol: '$' },
    { code: 'TWD', name: 'New Taiwan Dollar', symbol: '$' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'USD', name: 'United States Dollar', symbol: '$' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$' },
    { code: 'UZS', name: 'Uzbekistani Som', symbol: 'soʻm' },
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
    
    // Cryptocurrencies (Alphabetical Order)
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
  ];
  
  return createSuccessResponse({ currencies }, context.request_id);
}

// GET /api/tools/unit-converter/currency/rates
export async function getCurrencyRates(context: RequestContext): Promise<Response> {
  try {
    const metadata = await getForexMetadata(context);
    
    return createSuccessResponse({
      lastUpdated: metadata.lastUpdated,
      source: metadata.source,
      isExpired: metadata.isExpired,
      nextUpdate: metadata.nextUpdate,
      ratesCount: metadata.ratesCount,
      apiQuotaUsed: metadata.apiQuotaUsed,
      apiQuotaTotal: metadata.apiQuotaTotal
    }, context.request_id);
  } catch (error) {
    console.error('Failed to get currency rates metadata:', error);
    return createErrorResponse('Failed to retrieve rate metadata', 'METADATA_ERROR', 500, context.request_id);
  }
}
