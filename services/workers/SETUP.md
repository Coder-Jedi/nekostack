# NekoStack Workers Setup Guide

## Overview

This guide covers setting up the NekoStack Cloudflare Workers infrastructure, including D1 database, KV storage, and all 4 worker services.

## Prerequisites

- Cloudflare account with Workers plan
- Wrangler CLI installed (`npm install -g wrangler`)
- Node.js 18+ and npm
- Git

## 1. Cloudflare Setup

### 1.1 Install Wrangler CLI

```bash
npm install -g wrangler
```

### 1.2 Login to Cloudflare

```bash
wrangler login
```

### 1.3 Create D1 Database

```bash
# Create production database
wrangler d1 create nekostack-production

# Create staging database
wrangler d1 create nekostack-staging

# Create development database
wrangler d1 create nekostack-development
```

Note the database IDs from the output - you'll need them for configuration.

### 1.4 Create KV Namespaces

```bash
# Create cache namespace
wrangler kv:namespace create "CACHE"

# Create analytics namespace
wrangler kv:namespace create "ANALYTICS"

# Create notifications namespace
wrangler kv:namespace create "NOTIFICATIONS"
```

Note the namespace IDs from the output.

## 2. Database Setup

### 2.1 Run Migrations

```bash
# Apply initial schema
wrangler d1 migrations apply nekostack-production --file=services/workers/shared/database/schema.sql

# Apply staging schema
wrangler d1 migrations apply nekostack-staging --file=services/workers/shared/database/schema.sql

# Apply development schema
wrangler d1 migrations apply nekostack-development --file=services/workers/shared/database/schema.sql
```

### 2.2 Seed Data

```bash
# Seed categories
wrangler d1 execute nekostack-production --file=services/workers/shared/database/seeds/categories.sql

# Seed tools
wrangler d1 execute nekostack-production --file=services/workers/shared/database/seeds/tools.sql

# Repeat for staging and development
wrangler d1 execute nekostack-staging --file=services/workers/shared/database/seeds/categories.sql
wrangler d1 execute nekostack-staging --file=services/workers/shared/database/seeds/tools.sql

wrangler d1 execute nekostack-development --file=services/workers/shared/database/seeds/categories.sql
wrangler d1 execute nekostack-development --file=services/workers/shared/database/seeds/tools.sql
```

## 3. Worker Configuration

### 3.1 Update Wrangler Configurations

Update each worker's `wrangler.toml` with the correct database and KV IDs:

**API Gateway** (`services/workers/api-gateway/wrangler.toml`):
```toml
[[d1_databases]]
binding = "DB"
database_name = "nekostack-production"
database_id = "your-production-database-id"

[[kv_namespaces]]
binding = "CACHE"
id = "your-cache-namespace-id"
```

**Tool Router** (`services/workers/tool-router/wrangler.toml`):
```toml
[[d1_databases]]
binding = "DB"
database_name = "nekostack-production"
database_id = "your-production-database-id"

[[kv_namespaces]]
binding = "CACHE"
id = "your-cache-namespace-id"
```

**Analytics Service** (`services/workers/analytics-service/wrangler.toml`):
```toml
[[d1_databases]]
binding = "DB"
database_name = "nekostack-production"
database_id = "your-production-database-id"

[[kv_namespaces]]
binding = "CACHE"
id = "your-cache-namespace-id"
```

**Notification Service** (`services/workers/notification-service/wrangler.toml`):
```toml
[[d1_databases]]
binding = "DB"
database_name = "nekostack-production"
database_id = "your-production-database-id"

[[kv_namespaces]]
binding = "CACHE"
id = "your-cache-namespace-id"
```

### 3.2 Environment Variables

Set environment variables for each worker:

```bash
# API Gateway
wrangler secret put ALLOWED_ORIGINS --env production
wrangler secret put CORS_CREDENTIALS --env production

# Tool Router
wrangler secret put ORACLE_QUEUE_URL --env production
wrangler secret put ORACLE_API_KEY --env production

# Analytics Service
wrangler secret put ANALYTICS_RETENTION_DAYS --env production
wrangler secret put REAL_TIME_AGGREGATION --env production

# Notification Service
wrangler secret put NOTIFICATION_RETENTION_DAYS --env production
wrangler secret put BROADCAST_ENABLED --env production
```

## 4. Development Setup

### 4.1 Install Dependencies

```bash
# Install root dependencies
npm install

# Install worker dependencies
cd services/workers/shared && npm install
cd ../api-gateway && npm install
cd ../tool-router && npm install
cd ../analytics-service && npm install
cd ../notification-service && npm install
```

### 4.2 Local Development

```bash
# Start all workers locally
npm run dev:workers

# Or start individual workers
cd services/workers/api-gateway && npm run dev
cd services/workers/tool-router && npm run dev
cd services/workers/analytics-service && npm run dev
cd services/workers/notification-service && npm run dev
```

### 4.3 Test Endpoints

```bash
# Test API Gateway
curl http://localhost:8787/api/tools

# Test Tool Router
curl -X POST http://localhost:8788/api/tools/unit-converter \
  -H "Content-Type: application/json" \
  -d '{"value": 100, "fromUnit": "meter", "toUnit": "kilometer", "category": "length"}'

# Test Analytics Service
curl -X POST http://localhost:8789/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event_type": "test", "user_id": "test-user"}'

# Test Notification Service
curl http://localhost:8790/api/notifications/announcements
```

## 5. Deployment

### 5.1 Deploy All Workers

```bash
# Deploy all workers
npm run deploy:workers

# Or deploy individually
cd services/workers/api-gateway && npm run deploy
cd services/workers/tool-router && npm run deploy
cd services/workers/analytics-service && npm run deploy
cd services/workers/notification-service && npm run deploy
```

### 5.2 Deploy to Staging

```bash
# Deploy to staging
cd services/workers/api-gateway && npm run deploy:staging
cd services/workers/tool-router && npm run deploy:staging
cd services/workers/analytics-service && npm run deploy:staging
cd services/workers/notification-service && npm run deploy:staging
```

### 5.3 Deploy to Production

```bash
# Deploy to production
cd services/workers/api-gateway && npm run deploy:production
cd services/workers/tool-router && npm run deploy:production
cd services/workers/analytics-service && npm run deploy:production
cd services/workers/notification-service && npm run deploy:production
```

## 6. Custom Domains (Production)

### 6.1 Domain Setup Overview

NekoStack uses custom domains with the `api-` prefix for all backend services:

- **API Gateway**: `api-gateway.nekostack.com`
- **Tool Router**: `api-tools.nekostack.com`
- **Analytics Service**: `api-analytics.nekostack.com`
- **Notification Service**: `api-notifications.nekostack.com`

### 6.2 Domain Migration (Prerequisites)

Before setting up custom domains, you need to migrate DNS management from your domain registrar to Cloudflare:

1. **Add domain to Cloudflare**: Add `nekostack.com` to your Cloudflare account
2. **Update nameservers**: Change nameservers in your domain registrar to Cloudflare's
3. **Wait for propagation**: DNS changes can take 24-48 hours (usually 2-6 hours)
4. **Verify domain**: Ensure domain is active in Cloudflare dashboard

**Detailed Instructions**: See [DOMAIN_SETUP.md](./DOMAIN_SETUP.md) for complete step-by-step guide.

### 6.3 Configure Custom Domains

Each worker's `wrangler.toml` is already configured with custom domains:

```toml
# API Gateway
[[env.production.custom_domains]]
domain = "api-gateway.nekostack.com"

# Tool Router
[[env.production.custom_domains]]
domain = "api-tools.nekostack.com"

# Analytics Service
[[env.production.custom_domains]]
domain = "api-analytics.nekostack.com"

# Notification Service
[[env.production.custom_domains]]
domain = "api-notifications.nekostack.com"
```

### 6.4 DNS Configuration

After domain migration, create CNAME records in Cloudflare DNS:

```
Type: CNAME
Name: api-gateway
Target: nekostack-api-gateway-production.madankar-hritik.workers.dev
Proxy: Enabled (Orange cloud)

Type: CNAME
Name: api-tools
Target: nekostack-tool-router-production.madankar-hritik.workers.dev
Proxy: Enabled (Orange cloud)

Type: CNAME
Name: api-analytics
Target: nekostack-analytics-service-production.madankar-hritik.workers.dev
Proxy: Enabled (Orange cloud)

Type: CNAME
Name: api-notifications
Target: nekostack-notification-service-production.madankar-hritik.workers.dev
Proxy: Enabled (Orange cloud)
```

### 6.5 Deploy with Custom Domains

```bash
# Deploy all workers with custom domains
npm run deploy:workers

# Or deploy individually
cd services/workers/api-gateway && npm run deploy:production
cd services/workers/tool-router && npm run deploy:production
cd services/workers/analytics-service && npm run deploy:production
cd services/workers/notification-service && npm run deploy:production
```

### 6.6 Verify Custom Domains

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

### 6.7 Domain Architecture

For complete domain structure and future tool subdomain planning, see [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md).

## 7. Monitoring and Maintenance

### 7.1 View Logs

```bash
# View worker logs
wrangler tail nekostack-api-gateway
wrangler tail nekostack-tool-router
wrangler tail nekostack-analytics-service
wrangler tail nekostack-notification-service
```

### 7.2 Database Management

```bash
# Query database
wrangler d1 execute nekostack-production --command="SELECT * FROM tools LIMIT 5"

# Export data
wrangler d1 export nekostack-production --output=backup.sql

# Import data
wrangler d1 execute nekostack-production --file=backup.sql
```

### 7.3 KV Management

```bash
# List KV keys
wrangler kv:key list --namespace-id=your-namespace-id

# Get KV value
wrangler kv:key get "key-name" --namespace-id=your-namespace-id

# Set KV value
wrangler kv:key put "key-name" "value" --namespace-id=your-namespace-id
```

## 8. Troubleshooting

### 8.1 Common Issues

**Database Connection Errors:**
- Verify database IDs in `wrangler.toml`
- Check database exists: `wrangler d1 list`
- Verify migrations applied: `wrangler d1 migrations list nekostack-production`

**KV Storage Errors:**
- Verify namespace IDs in `wrangler.toml`
- Check namespaces exist: `wrangler kv:namespace list`
- Verify bindings are correct

**Worker Deployment Errors:**
- Check Wrangler version: `wrangler --version`
- Verify authentication: `wrangler whoami`
- Check for syntax errors in code

**CORS Errors:**
- Verify CORS configuration in middleware
- Check allowed origins in environment variables
- Ensure preflight requests are handled

### 8.2 Debug Mode

Enable debug mode for detailed logging:

```bash
# Set debug environment variable
wrangler secret put DEBUG --env production
# Value: "true"
```

### 8.3 Performance Issues

**Database Performance:**
- Check query performance in D1 dashboard
- Add indexes for frequently queried columns
- Consider query optimization

**Worker Performance:**
- Monitor CPU usage in Cloudflare dashboard
- Check for memory leaks
- Optimize code for edge execution

**Rate Limiting:**
- Adjust rate limits in middleware configuration
- Monitor rate limit headers in responses
- Consider implementing user-based rate limiting

## 9. Security Considerations

### 9.1 Environment Variables

- Never commit secrets to version control
- Use `wrangler secret put` for sensitive data
- Rotate secrets regularly

### 9.2 Database Security

- Use Row Level Security (RLS) policies
- Validate all inputs
- Sanitize user data

### 9.3 API Security

- Implement proper authentication
- Use HTTPS for all communications
- Validate request data
- Implement rate limiting

### 9.4 CORS Configuration

- Restrict allowed origins in production
- Use specific domains instead of wildcards
- Configure proper headers

## 10. Backup and Recovery

### 10.1 Database Backups

```bash
# Create backup
wrangler d1 export nekostack-production --output=backup-$(date +%Y%m%d).sql

# Restore from backup
wrangler d1 execute nekostack-production --file=backup-20240101.sql
```

### 10.2 KV Backups

```bash
# Export KV data
wrangler kv:key list --namespace-id=your-namespace-id > kv-backup.txt
```

### 10.3 Worker Code Backups

- Use Git for version control
- Tag releases: `git tag v1.0.0`
- Keep deployment history

## 11. Scaling Considerations

### 11.1 Database Scaling

- D1 automatically scales
- Monitor query performance
- Consider read replicas for heavy read workloads

### 11.2 Worker Scaling

- Workers auto-scale based on demand
- Monitor CPU and memory usage
- Consider worker concurrency limits

### 11.3 KV Scaling

- KV automatically scales
- Monitor storage usage
- Consider data expiration policies

## 12. Cost Optimization

### 12.1 Database Costs

- Monitor D1 usage in Cloudflare dashboard
- Optimize queries to reduce reads
- Use appropriate data types

### 12.2 Worker Costs

- Monitor worker invocations
- Optimize code for faster execution
- Use appropriate worker plans

### 12.3 KV Costs

- Monitor KV storage usage
- Implement data expiration
- Use appropriate data structures

## Support

For issues and questions:

1. Check Cloudflare Workers documentation
2. Review Wrangler CLI documentation
3. Check NekoStack project issues
4. Contact the development team

## Changelog

- **v1.0.0** - Initial setup guide
- Added D1 database configuration
- Added KV storage setup
- Added worker deployment instructions
- Added monitoring and troubleshooting guide
