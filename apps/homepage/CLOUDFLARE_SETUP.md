# Cloudflare Setup for NekoStack Homepage

This document describes the Cloudflare deployment setup for the NekoStack homepage using `@opennextjs/cloudflare`.

## Overview

The NekoStack homepage is now configured to deploy to Cloudflare Workers using OpenNext Cloudflare, which adapts Next.js applications to run on Cloudflare's edge network.

## Configuration Files

### 1. `wrangler.jsonc`
Cloudflare Workers configuration file defining:
- Worker name: `nekostack-homepage`
- Compatibility flags: `nodejs_compat` and `global_fetch_strictly_public`
- Asset directory: `.open-next/assets`
- Service bindings for self-reference
- R2 bucket configuration (optional, currently commented out)

### 2. `open-next.config.ts`
OpenNext Cloudflare configuration:
- Enables R2-based incremental caching
- Configures server-side caching for ISR/SSG

### 3. `.dev.vars`
Environment variables for local development:
```
NEXTJS_ENV=development
```

### 4. `public/_headers`
Static asset caching headers for Cloudflare:
```
/_next/static/*
  Cache-Control: public,max-age=31536000,immutable
```

### 5. `next.config.ts`
Updated Next.js configuration with:
- `initOpenNextCloudflareForDev()` initialization
- Transpilation of shared packages
- Package import optimizations

## Available Scripts

```bash
# Build and preview locally
npm run preview

# Build and deploy to Cloudflare
npm run deploy

# Build and upload version to Cloudflare
npm run upload

# Generate TypeScript types for Cloudflare environment
npm run cf-typegen

# Development (continues to use next dev)
npm run dev
```

## Deployment Steps

### 1. Build for Cloudflare
```bash
npm run build
```

This creates the `.open-next` directory with optimized Cloudflare Workers code.

### 2. Preview Locally
```bash
npm run preview
```

This builds your app and serves it locally in the Workers runtime environment.

### 3. Deploy to Production
```bash
npm run deploy
```

This builds and deploys your app to Cloudflare Workers.

## Features

### ✅ Compatible with Next.js 15
- Full support for App Router
- Server and Client Components
- API Routes (as Cloudflare Workers)

### ✅ Authentication
- Supabase Auth integration via environment variables
- Session management via Cloudflare KV (configured via bindings)

### ✅ Caching
- Static asset caching (via Cloudflare CDN)
- ISR/SSG support via R2 bucket (optional)
- Edge caching for improved performance

### ✅ Environment Support
- Development via `next dev`
- Production preview via `wrangler dev`
- Cloudflare Workers deployment

## Configuration Reference

### Compatibility Flags
- **nodejs_compat**: Enables Node.js API compatibility
- **global_fetch_strictly_public**: Allows fetching URLs in your app

### Service Bindings
- **WORKER_SELF_REFERENCE**: Enables worker-to-worker communication
- **ASSETS**: Static assets from `.open-next/assets`
- **NEXT_INC_CACHE_R2_BUCKET**: R2 bucket for caching (optional)

## Environment Variables

### Required for Local Development
```
NEXTJS_ENV=development
```

### Production Environment Variables
Set in Cloudflare Dashboard or via `wrangler.toml`:
- Supabase URL and keys
- NextAuth secrets
- Database connection strings

## Limitations

### ❌ Not Supported
- **Edge Runtime**: `export const runtime = "edge"` is removed if present
- **Node.js APIs**: Some Node.js-specific APIs may not work

### ⚠️ Known Issues
- Static build may fail for error pages (dev server works fine)
- Some Supabase features may require additional configuration

## Migrating from Other Platforms

### If migrating from Vercel:
1. Remove Vercel-specific configuration
2. Add Cloudflare configuration files
3. Update environment variables
4. Test preview build

### If using @cloudflare/next-on-pages:
1. Uninstall `@cloudflare/next-on-pages`
2. Remove `setupDevPlatform()` from next.config
3. Replace `getRequestContext` with `getCloudflareContext`
4. Follow this guide for setup

## Troubleshooting

### Build Errors
- Ensure `nodejs_compat` flag is set
- Check compatibility date is 2024-09-23 or later
- Verify all dependencies are compatible

### Runtime Errors
- Check service bindings in `wrangler.jsonc`
- Verify environment variables are set
- Review Cloudflare Workers logs

### Performance
- Enable R2 caching for better ISR/SSG performance
- Use static asset caching headers
- Optimize bundle size via `transpilePackages`

## Resources

- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare/get-started)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

## Next Steps

1. **Set up R2 bucket** for caching (optional but recommended):
   - Create R2 bucket in Cloudflare dashboard
   - Uncomment R2 bucket configuration in `wrangler.jsonc`
   - Update bucket name

2. **Configure environment variables**:
   - Set up Supabase credentials
   - Configure NextAuth secrets
   - Set up additional service bindings

3. **Test deployment**:
   - Run `npm run preview` to test locally
   - Run `npm run deploy` to deploy to staging
   - Monitor Cloudflare Workers logs

4. **Enable caching**:
   - Configure R2 bucket for ISR/SSG
   - Set up custom caching strategies
   - Optimize static assets

---

Last updated: Based on OpenNext Cloudflare v1.11.0

