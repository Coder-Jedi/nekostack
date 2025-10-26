<!-- 11a49abc-7439-4e62-af79-c87fafd38266 2c428b29-dafd-41a1-8897-aae3fed6cc5e -->
# Unit Converter Backend Integration - Complete Plan

## Overview

This plan includes both backend API implementation and frontend integration:

- **Backend**: Implement missing APIs for currency list, rate refresh, and user history
- **Unit Converter**: Keep client-side (no API needed)
- **Currency Converter**: Integrate API for real-time exchange rates
- **Analytics**: Track all conversions
- **History**: Optional sync for authenticated users

## Backend API Status

**✅ Already Implemented:**

- Currency Conversion: `POST /api/tools/unit-converter/currency`
- Unit Categories: `GET /api/tools/unit-converter/categories`
- Analytics Tracking: `POST /api/analytics/track`

**❌ Missing (to implement):**

- Currency List: `GET /api/tools/unit-converter/currency/list`
- Refresh Rates: `GET /api/tools/unit-converter/currency/rates`
- User History: `GET/POST/DELETE /api/user/conversion-history`

## PART A: Backend API Implementation

### Phase 0.1: Add Currency List & Rates Endpoints

**File**: `services/workers/tool-router/src/routes/unit-converter.ts` (ADD)

Add two new exported functions at the end of the file:

```typescript
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
```

**File**: `services/workers/tool-router/src/index.ts` (MODIFY)

Update import line 8 and add routes after line 19:

```typescript
// Line 8 - Update import
import { convertUnits, convertCurrency, getConversionCategories, getCurrencyList, getCurrencyRates } from './routes/unit-converter';

// After line 19 - Add new routes
router.get('/api/tools/unit-converter/currency/list', getCurrencyList);
router.get('/api/tools/unit-converter/currency/rates', getCurrencyRates);
```

### Phase 0.2: Add User History Endpoints

**File**: `services/workers/api-gateway/src/routes/user-history.ts` (NEW)

```typescript
import { RequestContext } from '../../../shared/src/types';
import { createSuccessResponse, createBadRequestResponse, createErrorResponse, createUnauthorizedResponse } from '../../../shared/src/utils/response';

export async function getUserHistory(context: RequestContext): Promise<Response> {
  if (!context.user_id) return createUnauthorizedResponse('Authentication required');
  const url = new URL(context.request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  return createSuccessResponse({ history: [], pagination: { limit, offset: 0, total: 0 } }, context.request_id);
}

export async function saveUserHistory(context: RequestContext): Promise<Response> {
  if (!context.user_id) return createUnauthorizedResponse('Authentication required');
  const body = await context.request.json();
  if (!body.type || !body.from || !body.to) return createBadRequestResponse('Missing required fields');
  return createSuccessResponse({ saved: true, id: Math.random().toString(36).substring(2, 15) }, context.request_id);
}

export async function clearUserHistory(context: RequestContext): Promise<Response> {
  if (!context.user_id) return createUnauthorizedResponse('Authentication required');
  return createSuccessResponse({ cleared: true, deletedCount: 0 }, context.request_id);
}
```

**File**: `services/workers/api-gateway/src/index.ts` (MODIFY)

Update import line 12 and add routes after line 47:

```typescript
// Line 12 - Add to imports
import { getUserHistory, saveUserHistory, clearUserHistory } from './routes/user-history';

// After line 47 - Add new routes
router.get('/api/user/conversion-history', getUserHistory);
router.post('/api/user/conversion-history', saveUserHistory);
router.delete('/api/user/conversion-history', clearUserHistory);
```

## PART B: Frontend Integration

### Phase 1: API Client Infrastructure

**File**: `apps/homepage/src/lib/api/client.ts` (NEW)

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  request_id: string;
  error?: { code: string; message: string };
}

class ApiClient {
  private baseUrls = {
    tools: process.env.NEXT_PUBLIC_TOOLS_API_URL || 'https://api-tools.nekostack.com',
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_API_URL || 'https://api-analytics.nekostack.com',
    gateway: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'https://api-gateway.nekostack.com'
  };

  async post<T>(service: 'tools' | 'analytics' | 'gateway', endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrls[service]}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async get<T>(service: 'tools' | 'analytics' | 'gateway', endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrls[service]}${endpoint}`);
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

**File**: `apps/homepage/src/lib/api/types.ts` (NEW)

```typescript
export interface CurrencyConversionRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  date?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface ConversionHistoryItem {
  type: 'unit' | 'currency';
  from: string;
  to: string;
  category?: string;
  rate?: number;
  timestamp: string;
}
```

### Phase 2: API Services

**File**: `apps/homepage/src/lib/api/services/currency.ts` (NEW)

```typescript
import { apiClient } from '../client';
import { CurrencyConversionRequest, Currency } from '../types';

export const currencyService = {
  convert: async (request: CurrencyConversionRequest) => {
    return apiClient.post('tools', '/api/tools/unit-converter/currency', request);
  },
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get<{ currencies: Currency[] }>('tools', '/api/tools/unit-converter/currency/list');
    return response.data.currencies;
  },
  refreshRates: async () => {
    return apiClient.get<{ lastUpdated: string }>('tools', '/api/tools/unit-converter/currency/rates');
  }
};
```

**File**: `apps/homepage/src/lib/api/services/analytics.ts` (NEW)

```typescript
import { apiClient } from '../client';

export const analyticsService = {
  trackConversion: async (toolId: string, metadata: Record<string, any>) => {
    try {
      await apiClient.post('analytics', '/api/analytics/track', {
        event_type: 'tool_conversion',
        tool_id: toolId,
        metadata
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
};
```

**File**: `apps/homepage/src/lib/api/services/history.ts` (NEW)

```typescript
import { apiClient } from '../client';
import { ConversionHistoryItem } from '../types';

export const historyService = {
  saveConversion: async (conversion: ConversionHistoryItem) => {
    try {
      await apiClient.post('gateway', '/api/user/conversion-history', conversion);
    } catch (error) {
      console.warn('History sync failed:', error);
    }
  },
  getHistory: async (limit: number = 50) => {
    const response = await apiClient.get<{ history: ConversionHistoryItem[] }>('gateway', `/api/user/conversion-history?limit=${limit}`);
    return response.data.history;
  },
  clearHistory: async () => {
    await apiClient.post('gateway', '/api/user/conversion-history', {});
  }
};
```

### Phase 3: Environment Configuration

**File**: `apps/homepage/.env.local` (NEW)

```env
NEXT_PUBLIC_TOOLS_API_URL=https://api-tools.nekostack.com
NEXT_PUBLIC_API_GATEWAY_URL=https://api-gateway.nekostack.com
NEXT_PUBLIC_ANALYTICS_API_URL=https://api-analytics.nekostack.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_HISTORY_SYNC=true
```

### Phase 4: Update Currency Converter

**File**: `apps/homepage/src/components/tools/unit-converter/currency-converter.tsx` (MODIFY)

Changes summary:

1. Import services at top
2. Add state: `apiError`
3. Make `handleConvert` async with API call
4. Add fallback to client-side on error
5. Update `handleRefreshRates` to use API
6. Rename `convertCurrency` to `convertCurrencyClientSide`
7. Add error display in JSX

### Phase 5: Update Unit Converter

**File**: `apps/homepage/src/components/tools/unit-converter/unit-converter.tsx` (MODIFY)

Changes summary:

1. Import analytics service
2. Add analytics call in `handleConvert` (non-blocking)
3. Keep all conversion logic client-side

### Phase 6: Optional History Sync

**File**: `apps/homepage/src/app/tools/unit-converter/page.tsx` (MODIFY)

Changes summary:

1. Import history service and useSession
2. Load history from API on mount if authenticated
3. Sync new conversions to API if authenticated

## Files Summary

**Backend (3 files modified, 1 new):**

1. `services/workers/tool-router/src/routes/unit-converter.ts` - Add currency list & rates
2. `services/workers/tool-router/src/index.ts` - Register new routes
3. `services/workers/api-gateway/src/routes/user-history.ts` - NEW history endpoints
4. `services/workers/api-gateway/src/index.ts` - Register history routes

**Frontend (9 new, 3 modified):**

1. `apps/homepage/src/lib/api/client.ts` - NEW
2. `apps/homepage/src/lib/api/types.ts` - NEW
3. `apps/homepage/src/lib/api/services/currency.ts` - NEW
4. `apps/homepage/src/lib/api/services/analytics.ts` - NEW
5. `apps/homepage/src/lib/api/services/history.ts` - NEW
6. `apps/homepage/.env.local` - NEW
7. `apps/homepage/src/components/tools/unit-converter/currency-converter.tsx` - MODIFY
8. `apps/homepage/src/components/tools/unit-converter/unit-converter.tsx` - MODIFY
9. `apps/homepage/src/app/tools/unit-converter/page.tsx` - MODIFY

## Success Criteria

1. Backend APIs deployed and accessible
2. Currency converter uses API for rates
3. Unit converter adds analytics tracking
4. Client-side fallback works on API failure
5. History sync works for authenticated users
6. No performance degradation
7. Full TypeScript coverage

### To-dos

- [ ] Create DOMAIN_SETUP.md with Hostinger to Cloudflare migration steps and DNS configuration
- [ ] Create DOMAIN_ARCHITECTURE.md documenting complete domain structure and future tool subdomains
- [ ] Update api-gateway/wrangler.toml with custom domain api-gateway.nekostack.com and CORS config
- [ ] Update tool-router/wrangler.toml with custom domain api-tools.nekostack.com and CORS config
- [ ] Update analytics-service/wrangler.toml with custom domain api-analytics.nekostack.com and CORS config
- [ ] Update notification-service/wrangler.toml with custom domain api-notifications.nekostack.com and CORS config
- [ ] Update SETUP.md and API.md to reference custom domains and link to new documentation
- [ ] Create apps/homepage/.env.production with custom domain API endpoints