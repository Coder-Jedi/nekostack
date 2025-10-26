# NekoStack Frontend Deployment Guide (Cloudflare Pages)

This guide covers deploying the NekoStack homepage frontend using Wrangler CLI to Cloudflare Pages.

## Prerequisites

### Required Tools
- Node.js 18+ installed
- npm or yarn package manager
- Wrangler CLI installed globally:
  ```bash
  npm install -g wrangler
  ```

### Cloudflare Account Setup
1. Create a Cloudflare account at https://dash.cloudflare.com
2. Log in and get your API token from Workers & Pages → Overview → API Token
3. Authenticate Wrangler:
   ```bash
   wrangler login
   ```

## Build Configuration

### Step 1: Configure Next.js for Cloudflare

The homepage already has `next.config.js` configured for Cloudflare deployment. Verify it includes:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nekostack/ui', '@nekostack/types', '@nekostack/utils', '@nekostack/config'],
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig
```

### Step 2: Environment Variables

Create `.env.production` file in `apps/homepage/`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_API_GATEWAY_URL=https://api-gateway.nekostack.com
NEXT_PUBLIC_TOOLS_API_URL=https://api-tools.nekostack.com
NEXT_PUBLIC_ANALYTICS_API_URL=https://api-analytics.nekostack.com
NODE_ENV=production
```

**Important**: Get your Supabase credentials from:
- Supabase Dashboard → Project Settings → API
- Copy `Project URL` and `anon` key

## Build the Application

### From Project Root
```bash
cd apps/homepage
npm install
npm run build
```

This will create the production build in `.next/` folder.

### Build Output
After successful build, you should see:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

## Deploy to Cloudflare Pages

### Option 1: Deploy via Wrangler CLI (Recommended)

1. **Initialize Pages project** (first time only):
   ```bash
   cd apps/homepage
   wrangler pages project create nekostack-homepage
   ```

2. **Deploy the built site**:
   ```bash
   wrangler pages deploy .next --project-name=nekostack-homepage
   ```

3. **Set environment variables** in Cloudflare Dashboard:
   - Go to: Workers & Pages → nekostack-homepage → Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables

### Option 2: Deploy via Git Integration (Automatic)

1. **Connect GitHub repository**:
   - Go to Cloudflare Dashboard → Pages → Create Project
   - Select "Connect to Git"
   - Choose your repository
   - Root directory: `/apps/homepage`
   - Build command: `npm install && npm run build`
   - Build output directory: `.next`

2. **Configure environment variables**:
   - Add all `NEXT_PUBLIC_*` variables in Pages settings

3. **Deploy automatically**:
   - Every push to `main` branch will trigger automatic deployment
   - Preview deployments created for pull requests

### Option 3: Manual Deployment

```bash
cd apps/homepage

# Build
npm run build

# Deploy
wrangler pages deploy .next \
  --project-name=nekostack-homepage \
  --branch=main
```

## Custom Domain Setup

### Using Cloudflare DNS

1. **Add custom domain in Pages**:
   - Go to: Workers & Pages → nekostack-homepage → Custom Domains
   - Click "Set up a custom domain"
   - Enter: `nekostack.com` or `www.nekostack.com`

2. **Configure DNS** (if domain in Cloudflare):
   - Already configured automatically
   - SSL certificate provisioned automatically

3. **Configure DNS** (if domain elsewhere):
   - Add CNAME record:
     ```
     Name: @ (or www)
     Target: nekostack-homepage.pages.dev
     Proxy: Enabled
     ```

### SSL Certificate

Cloudflare automatically provisions SSL certificates for custom domains (may take a few minutes).

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | `eyJ...` |
| `NEXT_PUBLIC_API_GATEWAY_URL` | API Gateway endpoint | `https://api-gateway.nekostack.com` |
| `NEXT_PUBLIC_TOOLS_API_URL` | Tools API endpoint | `https://api-tools.nekostack.com` |
| `NEXT_PUBLIC_ANALYTICS_API_URL` | Analytics API endpoint | `https://api-analytics.nekostack.com` |

## Deployment Commands Reference

### Build Locally
```bash
cd apps/homepage
npm run build
```

### Deploy to Pages
```bash
wrangler pages deploy .next --project-name=nekostack-homepage
```

### Deploy with Preview
```bash
wrangler pages deploy .next \
  --project-name=nekostack-homepage \
  --branch=preview-branch
```

### Check Deployment Status
```bash
wrangler pages deployment list --project-name=nekostack-homepage
```

### View Deployment Logs
1. Go to Cloudflare Dashboard → Pages → nekostack-homepage
2. Click on specific deployment to view logs

## Troubleshooting

### Build Fails

**Error**: "Module not found"
```bash
# Solution: Install dependencies
npm install
```

**Error**: "TypeScript errors"
```bash
# Solution: Fix TypeScript errors
npm run lint
```

### Deployment Fails

**Error**: "Missing environment variable"
- Add missing `NEXT_PUBLIC_*` variables in Cloudflare Pages settings

**Error**: "Build output not found"
- Ensure you're running `npm run build` before deploying
- Check that `.next/` folder exists

### Runtime Errors

**Error**: "API calls failing"
- Verify backend workers are deployed and accessible
- Check CORS configuration in workers
- Verify API URLs are correct

**Error**: "Supabase auth not working"
- Verify Supabase credentials are correct
- Check that Supabase project is active
- Verify API keys have correct permissions

## Production Checklist

Before deploying to production:

- [ ] Build passes locally with no errors
- [ ] All environment variables configured
- [ ] Supabase credentials verified
- [ ] Backend workers deployed and accessible
- [ ] CORS configured correctly
- [ ] SSL certificate provisioned (for custom domain)
- [ ] DNS records configured
- [ ] Analytics tracking configured
- [ ] Error monitoring set up

## Post-Deployment

### Verify Deployment

1. **Check site is live**:
   - Visit: `https://nekostack-homepage.pages.dev`
   - Or your custom domain: `https://nekostack.com`

2. **Test functionality**:
   - Navigate through pages
   - Test unit converter tool
   - Check currency conversion
   - Verify responsive design

3. **Check browser console**:
   - Open DevTools → Console
   - Look for any errors
   - Verify API calls are working

### Monitor Performance

Cloudflare Analytics:
- Dashboard → Pages → nekostack-homepage → Analytics
- Monitor traffic, bandwidth, requests

### Update Deployment

```bash
# After making changes, rebuild and redeploy
cd apps/homepage
npm run build
wrangler pages deploy .next --project-name=nekostack-homepage
```

## Automated Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
    paths:
      - 'apps/homepage/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: cd apps/homepage && npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: nekostack-homepage
          directory: apps/homepage/.next
```

Add secrets to GitHub:
- Settings → Secrets and Variables → Actions
- Add: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

## Next Steps

After successful deployment:

1. **Set up monitoring**: Configure Cloudflare Analytics
2. **Configure caching**: Optimize static asset caching
3. **Enable WAF**: Add security rules in Cloudflare
4. **Set up alerts**: Monitor uptime and performance
5. **Implement CDN**: Further optimize global delivery

## Support

For issues or questions:
- Check Cloudflare Workers/Pages documentation
- Review deployment logs in Cloudflare Dashboard
- Check Next.js deployment documentation
- Review project's `product/` folder for implementation details

