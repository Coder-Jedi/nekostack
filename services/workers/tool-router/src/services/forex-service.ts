// Forex Service - Handles ForexRateAPI integration with D1 caching
import { RequestContext } from '../../../shared/src/types';
import { createD1Client } from '../../../shared/src/database/d1-client';
import { trackEvent } from '../../../shared/src/utils/analytics-client';

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
 * Get cached rates from D1
 */
export async function getCachedRates(context: RequestContext): Promise<ForexRateCache | null> {
  const d1Client = createD1Client(context.env);
  
  // Get the latest rates entry
  const result = await d1Client.get<{
    rates: string;
    last_updated: string;
    source: string;
    is_expired: number;
  }>(
    'SELECT rates, last_updated, source, is_expired FROM forex_rates ORDER BY id DESC LIMIT 1',
    []
  );

  if (!result) {
    return null;
  }

  // Parse JSON rates
  const rates = JSON.parse(result.rates) as Record<string, number>;
  const isExpired = checkIfExpired(result.last_updated);
  
  return {
    rates,
    timestamp: result.last_updated,
    source: result.source as 'api' | 'cache',
    isExpired,
    lastUpdated: result.last_updated
  };
}

/**
 * Set cached rates in D1
 */
export async function setCachedRates(
  context: RequestContext,
  rates: Record<string, number>,
  quotaUsed?: number,
  quotaTotal?: number
): Promise<void> {
  const d1Client = createD1Client(context.env);
  const now = new Date().toISOString();

  // Insert new rates entry
  await d1Client.execute(
    `INSERT INTO forex_rates (rates, last_updated, source, is_expired, rates_count, api_quota_used, api_quota_total, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      JSON.stringify(rates),
      now,
      'api',
      0, // is_expired = false
      Object.keys(rates).length,
      quotaUsed || null,
      quotaTotal || null,
      now,
      now
    ]
  );

  // Optional: Clean up old entries (keep last 30 days for audit)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  await d1Client.execute(
    'DELETE FROM forex_rates WHERE created_at < ?',
    [thirtyDaysAgo]
  );
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
  const d1Client = createD1Client(context.env);
  
  const result = await d1Client.get<{
    last_updated: string;
    source: string;
    rates_count: number;
    api_quota_used: number | null;
    api_quota_total: number | null;
  }>(
    'SELECT last_updated, source, rates_count, api_quota_used, api_quota_total FROM forex_rates ORDER BY id DESC LIMIT 1',
    []
  );

  if (!result) {
    throw new Error('No forex metadata available');
  }

  // Check if expired based on current logic
  const isExpired = checkIfExpired(result.last_updated);

  return {
    lastUpdated: result.last_updated,
    source: result.source as 'api' | 'cache',
    isExpired,
    nextUpdate: getNextUpdateTime(),
    ratesCount: result.rates_count,
    apiQuotaUsed: result.api_quota_used || undefined,
    apiQuotaTotal: result.api_quota_total || undefined
  };
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

