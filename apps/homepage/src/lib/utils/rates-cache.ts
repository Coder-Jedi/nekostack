// Currency Rates Cache Utility
// Manages 15-minute localStorage caching for forex rates

const CACHE_KEY = 'nekostack_forex_rates';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
  lastUpdated: string;
  isExpired: boolean;
}

export function getCachedRatesFromStorage(): CachedRates | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached) as CachedRates;
    const now = Date.now();
    
    // Check if cache is still valid (15 minutes)
    if (now - data.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch {
    return null;
  }
}

export function setCachedRatesToStorage(rates: Record<string, number>, lastUpdated: string, isExpired: boolean): void {
  try {
    const data: CachedRates = {
      rates,
      timestamp: Date.now(),
      lastUpdated,
      isExpired
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to cache rates:', error);
  }
}

export function clearCachedRates(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore errors
  }
}

