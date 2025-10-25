# Domain Setup Guide for NekoStack

This guide covers the complete process of setting up custom domains for NekoStack Cloudflare Workers, including migrating DNS management from Hostinger to Cloudflare.

## Prerequisites

- NekoStack domain registered with Hostinger
- Cloudflare account (free plan is sufficient)
- All 4 Cloudflare Workers deployed and functional
- Access to Hostinger domain management panel

## Phase 1: Domain Migration to Cloudflare

### Step 1: Add Domain to Cloudflare

1. **Log into Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Click "Add a Site" or "Add Site"

2. **Enter Domain Name**
   - Enter `nekostack.com` (without www)
   - Click "Add Site"

3. **Select Plan**
   - Choose "Free" plan (sufficient for our needs)
   - Click "Continue"

4. **Review DNS Records**
   - Cloudflare will scan existing DNS records
   - Review and confirm all records are detected correctly
   - Click "Continue"

5. **Update Nameservers**
   - Cloudflare will provide two nameservers:
     - `ns1.cloudflare.com`
     - `ns2.cloudflare.com`
   - **Important**: Note these down - you'll need them for Hostinger

### Step 2: Update Nameservers in Hostinger

1. **Log into Hostinger Control Panel**
   - Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Navigate to "Domains" section

2. **Find NekoStack Domain**
   - Click on `nekostack.com` domain
   - Look for "Nameservers" or "DNS" section

3. **Update Nameservers**
   - Change from Hostinger nameservers to Cloudflare nameservers:
     - Replace existing nameservers with:
       - `ns1.cloudflare.com`
       - `ns2.cloudflare.com`
   - Save changes

4. **Wait for Propagation**
   - DNS propagation typically takes 24-48 hours
   - Usually completes within 2-6 hours
   - You can check status at [whatsmydns.net](https://whatsmydns.net)

### Step 3: Verify Domain in Cloudflare

1. **Check Domain Status**
   - Return to Cloudflare dashboard
   - Verify `nekostack.com` shows as "Active"
   - Status should change from "Pending" to "Active"

2. **Verify DNS Records**
   - Go to "DNS" tab in Cloudflare
   - Confirm all existing records are present
   - Add any missing records if needed

## Phase 2: Configure Custom Domains for Workers

### Step 1: Update API Gateway Worker

**File**: `services/workers/api-gateway/wrangler.toml`

Add custom domain configuration:

```toml
[env.production]
vars = { 
  ENVIRONMENT = "production", 
  ALLOWED_ORIGINS = "https://nekostack.com,https://www.nekostack.com,https://api-gateway.nekostack.com,https://api-tools.nekostack.com,https://api-analytics.nekostack.com,https://api-notifications.nekostack.com", 
  CORS_CREDENTIALS = "false" 
}

[[env.production.custom_domains]]
domain = "api-gateway.nekostack.com"
```

### Step 2: Update Tool Router Worker

**File**: `services/workers/tool-router/wrangler.toml`

Add custom domain configuration:

```toml
[env.production]
vars = { 
  ENVIRONMENT = "production", 
  ORACLE_QUEUE_URL = "https://your-oracle-queue-url.com", 
  ORACLE_API_KEY = "your-oracle-api-key",
  ALLOWED_ORIGINS = "https://nekostack.com,https://www.nekostack.com,https://api-gateway.nekostack.com,https://api-tools.nekostack.com,https://api-analytics.nekostack.com,https://api-notifications.nekostack.com",
  CORS_CREDENTIALS = "false"
}

[[env.production.custom_domains]]
domain = "api-tools.nekostack.com"
```

### Step 3: Update Analytics Service Worker

**File**: `services/workers/analytics-service/wrangler.toml`

Add custom domain configuration:

```toml
[env.production]
vars = { 
  ENVIRONMENT = "production", 
  ANALYTICS_RETENTION_DAYS = "90", 
  REAL_TIME_AGGREGATION = "true",
  ALLOWED_ORIGINS = "https://nekostack.com,https://www.nekostack.com,https://api-gateway.nekostack.com,https://api-tools.nekostack.com,https://api-analytics.nekostack.com,https://api-notifications.nekostack.com",
  CORS_CREDENTIALS = "false"
}

[[env.production.custom_domains]]
domain = "api-analytics.nekostack.com"
```

### Step 4: Update Notification Service Worker

**File**: `services/workers/notification-service/wrangler.toml`

Add custom domain configuration:

```toml
[env.production]
vars = { 
  ENVIRONMENT = "production", 
  NOTIFICATION_RETENTION_DAYS = "30", 
  BROADCAST_ENABLED = "true",
  ALLOWED_ORIGINS = "https://nekostack.com,https://www.nekostack.com,https://api-gateway.nekostack.com,https://api-tools.nekostack.com,https://api-analytics.nekostack.com,https://api-notifications.nekostack.com",
  CORS_CREDENTIALS = "false"
}

[[env.production.custom_domains]]
domain = "api-notifications.nekostack.com"
```

## Phase 3: DNS Configuration in Cloudflare

### Step 1: Create CNAME Records

After domain migration is complete, create the following CNAME records in Cloudflare DNS:

1. **API Gateway**
   ```
   Type: CNAME
   Name: api-gateway
   Target: nekostack-api-gateway-production.madankar-hritik.workers.dev
   Proxy: Enabled (Orange cloud)
   TTL: Auto
   ```

2. **Tool Router**
   ```
   Type: CNAME
   Name: api-tools
   Target: nekostack-tool-router-production.madankar-hritik.workers.dev
   Proxy: Enabled (Orange cloud)
   TTL: Auto
   ```

3. **Analytics Service**
   ```
   Type: CNAME
   Name: api-analytics
   Target: nekostack-analytics-service-production.madankar-hritik.workers.dev
   Proxy: Enabled (Orange cloud)
   TTL: Auto
   ```

4. **Notification Service**
   ```
   Type: CNAME
   Name: api-notifications
   Target: nekostack-notification-service-production.madankar-hritik.workers.dev
   Proxy: Enabled (Orange cloud)
   TTL: Auto
   ```

### Step 2: Verify DNS Records

1. **Check Record Status**
   - All CNAME records should show "Proxied" status (orange cloud)
   - Records should be "Active" within a few minutes

2. **Test DNS Resolution**
   ```bash
   # Test each subdomain
   nslookup api-gateway.nekostack.com
   nslookup api-tools.nekostack.com
   nslookup api-analytics.nekostack.com
   nslookup api-notifications.nekostack.com
   ```

## Phase 4: Deploy Workers with Custom Domains

### Step 1: Deploy All Workers

```bash
# Navigate to project root
cd /Users/hritik.madankar/Projects/nekostack

# Deploy API Gateway
cd services/workers/api-gateway
npm run deploy:production

# Deploy Tool Router
cd ../tool-router
npm run deploy:production

# Deploy Analytics Service
cd ../analytics-service
npm run deploy:production

# Deploy Notification Service
cd ../notification-service
npm run deploy:production
```

### Step 2: Verify Custom Domains

Test each custom domain:

```bash
# Test API Gateway
curl https://api-gateway.nekostack.com/api/tools

# Test Tool Router
curl https://api-tools.nekostack.com/api/tools/unit-converter

# Test Analytics Service
curl https://api-analytics.nekostack.com/api/analytics/stats

# Test Notification Service
curl https://api-notifications.nekostack.com/api/notifications/status
```

Expected responses:
- All endpoints should return JSON responses
- No CORS errors
- SSL certificates should be valid

## Phase 5: SSL Certificate Verification

### Automatic SSL Provisioning

Cloudflare automatically provisions SSL certificates for custom domains:

1. **Certificate Status**
   - Go to Cloudflare Dashboard → SSL/TLS → Overview
   - Verify certificates are "Active" for all subdomains
   - Certificates are automatically renewed

2. **SSL Configuration**
   - Go to SSL/TLS → Edge Certificates
   - Ensure "Always Use HTTPS" is enabled
   - Set "Minimum TLS Version" to 1.2

### Verify SSL Certificates

```bash
# Check SSL certificate for each domain
openssl s_client -connect api-gateway.nekostack.com:443 -servername api-gateway.nekostack.com
openssl s_client -connect api-tools.nekostack.com:443 -servername api-tools.nekostack.com
openssl s_client -connect api-analytics.nekostack.com:443 -servername api-analytics.nekostack.com
openssl s_client -connect api-notifications.nekostack.com:443 -servername api-notifications.nekostack.com
```

## Phase 6: Update Frontend Configuration

### Step 1: Create Production Environment File

**File**: `apps/homepage/.env.production`

```env
# API Endpoints with Custom Domains
NEXT_PUBLIC_API_GATEWAY_URL=https://api-gateway.nekostack.com
NEXT_PUBLIC_TOOLS_API_URL=https://api-tools.nekostack.com
NEXT_PUBLIC_ANALYTICS_API_URL=https://api-analytics.nekostack.com
NEXT_PUBLIC_NOTIFICATIONS_API_URL=https://api-notifications.nekostack.com

# Supabase Configuration (unchanged)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth Configuration (unchanged)
NEXTAUTH_URL=https://nekostack.com
NEXTAUTH_SECRET=your_nextauth_secret
```

### Step 2: Update Frontend Code

Ensure all API calls in the frontend use the new environment variables:

```typescript
// Example API call
const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/tools`);
```

## Troubleshooting

### Common Issues

1. **DNS Propagation Delays**
   - **Symptom**: Custom domains not resolving
   - **Solution**: Wait 2-24 hours for DNS propagation
   - **Check**: Use [whatsmydns.net](https://whatsmydns.net) to verify global propagation

2. **SSL Certificate Issues**
   - **Symptom**: SSL errors or mixed content warnings
   - **Solution**: Ensure "Always Use HTTPS" is enabled in Cloudflare
   - **Check**: Verify certificate status in Cloudflare dashboard

3. **CORS Errors**
   - **Symptom**: CORS policy errors in browser console
   - **Solution**: Verify ALLOWED_ORIGINS includes all required domains
   - **Check**: Test with curl to isolate CORS vs other issues

4. **Worker Not Responding**
   - **Symptom**: 502 Bad Gateway or timeout errors
   - **Solution**: Check worker deployment status and logs
   - **Check**: Test worker.dev URL directly

5. **Custom Domain Not Working**
   - **Symptom**: Custom domain returns 404 or doesn't resolve
   - **Solution**: Verify CNAME record points to correct worker.dev URL
   - **Check**: Ensure worker is deployed with custom domain configuration

### Debugging Commands

```bash
# Check DNS resolution
dig api-gateway.nekostack.com
dig api-tools.nekostack.com
dig api-analytics.nekostack.com
dig api-notifications.nekostack.com

# Check SSL certificate
curl -I https://api-gateway.nekostack.com
curl -I https://api-tools.nekostack.com
curl -I https://api-analytics.nekostack.com
curl -I https://api-notifications.nekostack.com

# Test API endpoints
curl -v https://api-gateway.nekostack.com/api/tools
curl -v https://api-tools.nekostack.com/api/tools/unit-converter
```

### Support Resources

- [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Hostinger DNS Management](https://support.hostinger.com/en/articles/1583290-how-to-change-dns-nameservers-for-domains)

## Next Steps

After successful custom domain setup:

1. **Update Documentation**: Update API documentation with new URLs
2. **Monitor Performance**: Use Cloudflare Analytics to monitor traffic
3. **Set Up Monitoring**: Configure alerts for domain and SSL issues
4. **Plan Tool Subdomains**: Refer to DOMAIN_ARCHITECTURE.md for future subdomain planning

## Security Considerations

1. **SSL/TLS**: All custom domains use Cloudflare's SSL certificates
2. **DDoS Protection**: Cloudflare provides automatic DDoS protection
3. **Rate Limiting**: Configure rate limiting in Cloudflare dashboard
4. **Access Control**: Use Cloudflare Access for additional security if needed
5. **CORS**: Properly configured CORS prevents unauthorized cross-origin requests
