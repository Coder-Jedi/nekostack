# ForexRateAPI Integration - Deployment Instructions

## Overview

This document outlines the deployment steps for integrating ForexRateAPI.com with the NekoStack tool-router worker.

## Changes Summary

### Backend Changes

1. **New Forex Service Module** (`services/workers/tool-router/src/services/forex-service.ts`)
   - Fetches rates from ForexRateAPI
   - Stores rates in KV with 7-day TTL
   - Calculates cross-rates using USD as base currency
   - Handles cache expiration logic (daily at 5 PM EST)

2. **Updated Currency Conversion** (`services/workers/tool-router/src/routes/unit-converter.ts`)
   - Removed mock rate logic
   - Integrated with forex service
   - Returns `source`, `isExpired`, and `lastUpdated` metadata

3. **Updated Rates Endpoint** (`services/workers/tool-router/src/routes/unit-converter.ts`)
   - Returns real metadata from KV cache
   - Includes quota usage information

4. **Cron Handler** (`services/workers/tool-router/src/index.ts`)
   - Scheduled event runs daily at 10:05 PM UTC (5:05 PM EST)
   - Manual trigger endpoint: `POST /api/admin/refresh-rates`

5. **Configuration Updates**
   - `services/workers/tool-router/wrangler.toml`: Added cron trigger
   - `services/workers/shared/src/types/index.ts`: Added `FOREXRATE_API_KEY` to Env interface

### Frontend Changes

1. **Updated TypeScript Types** (`apps/homepage/src/lib/api/types.ts`)
   - Added `source`, `isExpired`, `lastUpdated` to `CurrencyConversionResponse`
   - Updated `CurrencyRatesResponse` with metadata fields

2. **Updated Currency Converter** (`apps/homepage/src/components/tools/unit-converter/currency-converter.tsx`)
   - Shows expiration warnings when using cached data
   - Displays last updated timestamp from API

## Deployment Steps

### 1. Set Cloudflare Secret

```bash
cd services/workers/tool-router
wrangler secret put FOREXRATE_API_KEY --env production
# Enter your ForexRateAPI key when prompted
```

To get a ForexRateAPI key:
1. Sign up at https://forexrateapi.com
2. Get your API key from the dashboard
3. Free tier: 100 requests/month, daily updates

### 2. Build and Deploy Worker

```bash
cd services/workers/tool-router
npm run build
npm run deploy:production
```

### 3. Verify Cron Setup

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select `nekostack-tool-router` worker
3. Go to Settings → Triggers → Cron Triggers
4. Verify schedule shows: `5 22 * * *` (10:05 PM UTC daily)

### 4. Test Manual Refresh

```bash
curl -X POST https://api-tools.nekostack.com/api/admin/refresh-rates \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "message": "Forex rates refreshed successfully",
  "timestamp": "2025-01-XX..."
}
```

### 5. Monitor First Cron Run

```bash
wrangler tail nekostack-tool-router --env production
```

Wait for the cron to execute at 10:05 PM UTC (5:05 PM EST) or trigger manually for testing.

### 6. Verify Frontend Integration

1. Deploy frontend changes (if needed):
```bash
cd apps/homepage
npm run build
npm run deploy:production
```

2. Test currency converter:
   - Navigate to unit converter tool
   - Switch to currency tab
   - Convert between currencies
   - Verify rate metadata is displayed
   - Check for expiration warnings if cache is stale

## API Quota Management

### Current Limits (Free Tier)
- **Monthly Requests**: 100
- **Cron Usage**: ~30 requests (1/day)
- **Reserved for Manual Refreshes**: 50 requests
- **Reserved for Error Retries**: 20 requests

### Monitoring Usage

Check API usage via response headers on manual refresh:
```
X-API-CURRENT: 25 (requests used this month)
X-API-QUOTA: 100 (total monthly quota)
```

### Upgrade When Needed

When approaching 80+ requests/month:
1. Sign up for Essential plan ($9.99/month)
2. Get 5000 requests/month
3. 30-minute rate delay
4. Update payment info in ForexRateAPI dashboard

## Cache Strategy

### Logical Expiration
- **Time**: 5 PM EST (10 PM UTC) daily
- **Behavior**: Rates marked as expired after market close
- **User Experience**: Shows warning but serves cached data

### Physical TTL
- **Duration**: 7 days (604800 seconds)
- **Purpose**: Safety buffer if cron fails
- **Fallback**: Can serve up to 6-day-old rates before deletion

### Cache Structure (KV)

**Key**: `forex:rates:usd`
**Value**: `{ "AED": 3.6725, "AFN": 70.50, ... }`

**Key**: `forex:rates:metadata`
**Value**: 
```json
{
  "lastUpdated": "2025-01-26T22:00:00Z",
  "source": "api",
  "isExpired": false,
  "nextUpdate": "2025-01-27T22:05:00Z",
  "ratesCount": 162,
  "apiQuotaUsed": 25,
  "apiQuotaTotal": 100
}
```

## Troubleshooting

### Issue: Cron job not running

**Check**:
1. Worker deployment successful
2. Cron trigger configured correctly
3. Worker logs for errors

**Test**:
```bash
curl -X POST https://api-tools.nekostack.com/api/admin/refresh-rates
```

### Issue: No rates available

**Possible Causes**:
1. First deployment - cron hasn't run yet
2. API key not set
3. API quota exceeded

**Solutions**:
1. Trigger manual refresh
2. Check Cloudflare secrets
3. Check ForexRateAPI dashboard for quota

### Issue: Expired cache showing

**Expected Behavior**:
- Cache expires after 5 PM EST
- Shows warning to user
- Still provides conversion (previous day's rates)
- Cron fetches new rates at 5:05 PM EST

**If persistent**:
1. Check cron job logs
2. Verify API key is valid
3. Check ForexRateAPI service status

## Rollback

If integration fails:

1. **Disable cron trigger**:
```bash
cd services/workers/tool-router
# Remove [triggers] section from wrangler.toml
npm run deploy:production
```

2. **Revert worker code** (if needed):
```bash
git revert <commit-hash>
cd services/workers/tool-router
npm run build
npm run deploy:production
```

## Testing Checklist

- [ ] Cloudflare secret set successfully
- [ ] Worker deployed to production
- [ ] Cron trigger configured
- [ ] Manual refresh endpoint working
- [ ] Cron job runs at scheduled time
- [ ] Rates available in KV cache
- [ ] Currency conversion returns valid rates
- [ ] Expiration warnings display correctly
- [ ] Frontend shows last updated timestamp
- [ ] API quota tracking working

## Next Steps

1. **Monitor Performance**: Watch API usage and cron success rate
2. **Upgrade Plan**: When approaching quota, upgrade to Essential tier
3. **Add Authentication**: Protect `/api/admin/refresh-rates` endpoint with admin auth
4. **Add Analytics**: Track API usage, cache hit rates, and conversion patterns

