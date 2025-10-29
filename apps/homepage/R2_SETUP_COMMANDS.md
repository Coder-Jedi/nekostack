# Quick R2 Setup Commands

## Enable R2 in Cloudflare Dashboard
1. Go to: https://dash.cloudflare.com
2. Navigate to: R2 → Enable (if not already enabled)

## Create Bucket (after R2 is enabled)
```bash
cd /Users/hritik.madankar/Projects/nekostack/apps/homepage
wrangler r2 bucket create nekostack-cache
```

## Deploy with R2 Caching
```bash
npm run deploy
```

## Verify R2 Cache is Working
```bash
# List cached pages
wrangler r2 object list nekostack-cache --prefix=pages/

# View homepage cache
wrangler r2 object get nekostack-cache pages/index.html
```

## Check Bucket
```bash
# List all buckets
wrangler r2 bucket list

# Get bucket info
wrangler r2 bucket info nekostack-cache
```

## Clear Cache (if needed)
```bash
# Delete all cache
wrangler r2 object delete nekostack-cache --recursive

# Delete specific page
wrangler r2 object delete nekostack-cache pages/index.html
```
