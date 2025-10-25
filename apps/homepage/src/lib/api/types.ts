// API Types for NekoStack services

export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string;
}

export interface CurrencyConversionResponse {
  original: {
    amount: number;
    currency: string;
  };
  converted: {
    amount: number;
    currency: string;
  };
  exchangeRate: number;
  date: string;
  timestamp: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface CurrencyRatesResponse {
  lastUpdated: string;
  source: string;
  nextUpdate: string;
}

export interface UnitConversionRequest {
  value: number;
  fromUnit: string;
  toUnit: string;
  category: string;
}

export interface UnitConversionResponse {
  original: {
    value: number;
    unit: string;
  };
  converted: {
    value: number;
    unit: string;
  };
  rate: number;
  category: string;
  timestamp: string;
}

export interface ConversionHistoryItem {
  id?: string;
  type: 'unit' | 'currency';
  from: string;
  to: string;
  category?: string;
  rate?: number;
  timestamp: string;
}

export interface ConversionHistoryResponse {
  history: ConversionHistoryItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

export interface AnalyticsEvent {
  event_type: string;
  tool_id: string;
  metadata: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
}
