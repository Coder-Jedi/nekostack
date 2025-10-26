// Forex Service - Handles ForexRateAPI integration with KV caching
import { RequestContext } from '../../../shared/src/types';
import { createKVClient } from '../../../shared/src/kv/kv-client';
import { trackEvent } from '../../../shared/src/utils/analytics-client';

// 7 days TTL for physical KV expiration
const KV_TTL_SECONDS = 604800;

// Cache expiration time: 5 PM EST (10 PM UTC / 22:00 UTC)
const DAILY_MARKET_CLOSE_HOUR = 22; // 10 PM UTC (5 PM EST)

export interface ForexRateCache {
  rates: Record<string, number>;
  timestamp: string;
  source: 'api' | 'cache';
  isExpired: boolean;
  lastUpdated: string;
}

export interface ForexMetadata {
  lastUpdated: string;
  source: 'api' | 'cache';
  isExpired: boolean;
  nextUpdate: string;
  ratesCount: number;
  apiQuotaUsed?: number | undefined;
  apiQuotaTotal?: number | undefined;
}

export interface ForexRateData {
  rate: number;
  source: 'cache' | 'expired-cache';
  isExpired: boolean;
  lastUpdated: string;
}

/**
 * Fetch rates from ForexRateAPI
 */
export async function fetchRatesFromAPI(context: RequestContext): Promise<Record<string, number>> {
  if (!context.env.FOREXRATE_API_KEY) {
    throw new Error('FOREXRATE_API_KEY not configured');
  }

  const url = `https://api.forexrateapi.com/v1/latest?api_key=${context.env.FOREXRATE_API_KEY}&base=USD`;
  
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`ForexRateAPI error: ${response.status} ${response.statusText}`);
  }

  const data: any = await response.json();
  
  if (!data.success || !data.rates) {
    throw new Error('Invalid response from ForexRateAPI');
  }

  return data.rates as Record<string, number>;
}

/**
 * Get cached rates from KV
 */
export async function getCachedRates(context: RequestContext): Promise<ForexRateCache | null> {
  const kvClient = createKVClient(context.env);
  
  const ratesData = await kvClient.get<Record<string, number>>('forex:rates:usd', true);
  const metadata = await kvClient.get<ForexMetadata>('forex:rates:metadata', true);

  if (!ratesData || !metadata) {
    return null;
  }

  const isExpired = checkIfExpired(metadata.lastUpdated);
  
  return {
    rates: ratesData,
    timestamp: metadata.lastUpdated,
    source: metadata.source,
    isExpired,
    lastUpdated: metadata.lastUpdated
  };
}

/**
 * Set cached rates in KV
 */
export async function setCachedRates(
  context: RequestContext,
  rates: Record<string, number>,
  quotaUsed?: number,
  quotaTotal?: number
): Promise<void> {
  const kvClient = createKVClient(context.env);
  const now = new Date().toISOString();

  // Store rates with 7-day TTL
  await kvClient.cache('forex:rates:usd', rates, KV_TTL_SECONDS);

  // Store metadata with 7-day TTL
  const metadata: ForexMetadata = {
    lastUpdated: now,
    source: 'api',
    isExpired: false,
    nextUpdate: getNextUpdateTime(),
    ratesCount: Object.keys(rates).length,
    apiQuotaUsed: quotaUsed,
    apiQuotaTotal: quotaTotal
  };

  await kvClient.cache('forex:rates:metadata', metadata, KV_TTL_SECONDS);
}

/**
 * Calculate cross rate: fromCurrency → USD → toCurrency
 */
export function calculateCrossRate(
  fromCurrency: string,
  toCurrency: string,
  usdRates: Record<string, number>
): number {
  if (fromCurrency === 'USD') return usdRates[toCurrency] || 1;
  if (toCurrency === 'USD') return 1 / (usdRates[fromCurrency] || 1);
  
  // Cross rate: (1 / fromRate) * toRate
  const fromToUsd = 1 / (usdRates[fromCurrency] || 1);
  const usdToTarget = usdRates[toCurrency] || 1;
  return fromToUsd * usdToTarget;
}

/**
 * Check if cache is past the market close cutoff (5 PM EST / 10 PM UTC)
 */
export function isExpired(lastUpdated: string): boolean {
  const lastUpdateDate = new Date(lastUpdated);
  const now = new Date();
  
  // Get current time in UTC
  const currentHourUTC = now.getUTCHours();
  
  // If last update was before today's market close, it's expired
  if (currentHourUTC >= DAILY_MARKET_CLOSE_HOUR) {
    // After market close today, check if last update was before today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    return lastUpdateDate < todayStart;
  } else {
    // Before market close today, check if last update was before yesterday
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
    return lastUpdateDate < yesterdayStart;
  }
}

/**
 * Check if cache is expired (convenience wrapper)
 */
function checkIfExpired(lastUpdated: string): boolean {
  return isExpired(lastUpdated);
}

/**
 * Get exchange rate with fallback to cached data
 */
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
  context: RequestContext
): Promise<ForexRateData> {
  // Get cached rates
  const cached = await getCachedRates(context);
  
  if (!cached) {
    throw new Error('No forex rates available');
  }

  // Validate currency codes exist in rates (USD is always valid as base)
  if (fromCurrency !== 'USD' && !cached.rates[fromCurrency]) {
    throw new Error(`Currency ${fromCurrency} not found in rates`);
  }
  if (toCurrency !== 'USD' && !cached.rates[toCurrency]) {
    throw new Error(`Currency ${toCurrency} not found in rates`);
  }

  const rate = calculateCrossRate(fromCurrency, toCurrency, cached.rates);
  
  // Track currency conversion
  await trackEvent(context, {
    event_type: 'currency_conversion',
    tool_id: 'unit-converter',
    metadata: {
      from_currency: fromCurrency,
      to_currency: toCurrency,
      exchange_rate: rate,
      source: cached.isExpired ? 'expired-cache' : 'cache',
      is_expired: cached.isExpired,
      cache_age_hours: calculateCacheAge(cached.lastUpdated)
    }
  });
  
  return {
    rate,
    source: cached.isExpired ? 'expired-cache' : 'cache',
    isExpired: cached.isExpired,
    lastUpdated: cached.lastUpdated
  };
}

/**
 * Update rates from API and cache them
 */
export async function updateForexRatesFromAPI(context: RequestContext): Promise<void> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(
      `https://api.forexrateapi.com/v1/latest?api_key=${context.env.FOREXRATE_API_KEY}&base=USD`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!response.ok) {
      throw new Error(`ForexRateAPI error: ${response.status} ${response.statusText}`);
    }
    
    const data: any = await response.json();
    
    if (!data.success || !data.rates) {
      throw new Error('Invalid response from ForexRateAPI');
    }
    
    const rates = data.rates as Record<string, number>;
    const duration = Date.now() - startTime;
    
    // Get quota info from response headers
    const quotaUsed = response.headers.get('X-API-CURRENT');
    const quotaTotal = response.headers.get('X-API-QUOTA');
    
    // Store rates in cache
    await setCachedRates(context, rates, 
      quotaUsed ? parseInt(quotaUsed) : undefined,
      quotaTotal ? parseInt(quotaTotal) : undefined
    );
    
    // Track successful API call
    await trackEvent(context, {
      event_type: 'forex_api_call',
      tool_id: 'unit-converter',
      metadata: {
        status: response.status,
        duration_ms: duration,
        rates_count: Object.keys(rates).length,
        quota_used: quotaUsed ? parseInt(quotaUsed) : null,
        quota_total: quotaTotal ? parseInt(quotaTotal) : null,
        quota_percentage: quotaUsed && quotaTotal 
          ? ((parseInt(quotaUsed) / parseInt(quotaTotal)) * 100).toFixed(2)
          : null,
        trigger: context.request_id.startsWith('cron-') ? 'cron' : 'manual'
      }
    });
    
    console.log(`Forex rates updated successfully in ${duration}ms`);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Track error event
    await trackEvent(context, {
      event_type: 'forex_api_error',
      tool_id: 'unit-converter',
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration_ms: duration,
        trigger: context.request_id.startsWith('cron-') ? 'cron' : 'manual'
      }
    });
    
    console.error(`Forex rate update failed after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Get forex metadata for rates endpoint
 */
export async function getForexMetadata(context: RequestContext): Promise<ForexMetadata> {
  const kvClient = createKVClient(context.env);
  const metadata = await kvClient.get<ForexMetadata>('forex:rates:metadata', true);

  if (!metadata) {
    throw new Error('No forex metadata available');
  }

  // Check if expired based on current logic
  metadata.isExpired = isExpired(metadata.lastUpdated);
  metadata.nextUpdate = getNextUpdateTime();

  return metadata;
}

/**
 * Get next update time (5:05 PM EST / 10:05 PM UTC tomorrow if after market close)
 */
function getNextUpdateTime(): string {
  const now = new Date();
  const currentHourUTC = now.getUTCHours();
  
  let nextUpdate: Date;
  
  if (currentHourUTC >= DAILY_MARKET_CLOSE_HOUR) {
    // After market close, next update is tomorrow at 10:05 PM UTC
    nextUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 22, 5, 0, 0);
  } else {
    // Before market close, next update is today at 10:05 PM UTC
    nextUpdate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 5, 0, 0);
  }
  
  return nextUpdate.toISOString();
}

/**
 * Calculate cache age in hours
 */
export function calculateCacheAge(lastUpdated: string): number {
  const lastUpdate = new Date(lastUpdated);
  const now = new Date();
  const diffMs = now.getTime() - lastUpdate.getTime();
  return Math.round(diffMs / (1000 * 60 * 60)); // Convert to hours
}

