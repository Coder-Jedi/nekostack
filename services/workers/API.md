# NekoStack Workers API Documentation

## Overview

NekoStack uses 4 Cloudflare Workers to handle different aspects of the application:

1. **API Gateway** - Tool metadata, categories, system status, announcements, changelog
2. **Tool Router** - Light tool processing (unit converter, QR generator, markdown converter)
3. **Analytics Service** - Event tracking, statistics, performance metrics
4. **Notification Service** - Announcements, system status, notifications

## Custom Domains

All API services use custom domains with the `api-` prefix:

- **API Gateway**: `https://api-gateway.nekostack.com`
- **Tool Router**: `https://api-tools.nekostack.com`
- **Analytics Service**: `https://api-analytics.nekostack.com`
- **Notification Service**: `https://api-notifications.nekostack.com`

### Backward Compatibility

The old `*.workers.dev` URLs are still functional but deprecated:
- `https://nekostack-api-gateway-production.madankar-hritik.workers.dev`
- `https://nekostack-tool-router-production.madankar-hritik.workers.dev`
- `https://nekostack-analytics-service-production.madankar-hritik.workers.dev`
- `https://nekostack-notification-service-production.madankar-hritik.workers.dev`

**Migration**: Update your applications to use the new custom domains. The old URLs will continue to work but may be removed in future versions.

### Domain Setup

For detailed instructions on setting up custom domains, see [DOMAIN_SETUP.md](./DOMAIN_SETUP.md).

For complete domain architecture and future tool subdomain planning, see [DOMAIN_ARCHITECTURE.md](./DOMAIN_ARCHITECTURE.md).

## API Gateway

**Base URL**: `https://api-gateway.nekostack.com`

**Note**: The old `https://api.nekostack.com` URL is deprecated. Please use the new custom domain.

### Tools

#### GET /api/tools
Get all available tools with optional filtering.

**Query Parameters:**
- `category` (string, optional): Filter by category ID
- `search` (string, optional): Search in tool names and descriptions
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "tools": [
      {
        "id": "image-compressor",
        "name": "Image Compressor & Converter",
        "description": "Compress and convert images...",
        "category": "media",
        "category_name": "Media & Design",
        "icon_url": "/icons/image-compressor.svg",
        "features": ["Compress images", "Convert formats"],
        "pricing_tier": "free",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 7
    }
  }
}
```

#### GET /api/tools/:id
Get specific tool by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "image-compressor",
    "name": "Image Compressor & Converter",
    "description": "Compress and convert images...",
    "category": "media",
    "category_name": "Media & Design",
    "icon_url": "/icons/image-compressor.svg",
    "features": [
      {
        "feature_name": "Basic Compression",
        "description": "Compress images up to 5MB",
        "is_premium": false
      }
    ],
    "pricing_tier": "free",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/tools/search
Search tools by query.

**Query Parameters:**
- `q` (string, required): Search query
- `category` (string, optional): Filter by category ID
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)

### Categories

#### GET /api/categories
Get all tool categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "productivity",
      "name": "Productivity",
      "description": "Tools to boost your productivity...",
      "icon": "zap",
      "sort_order": 1
    }
  ]
}
```

#### GET /api/categories/:id
Get specific category by ID.

#### GET /api/categories/:id/tools
Get tools in a specific category.

### System

#### GET /api/system/status
Get overall system status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "services": {
      "database": "healthy",
      "api": "healthy",
      "workers": "healthy"
    },
    "performance": {
      "average_response_time": 150.5,
      "error_rate": 0.001,
      "total_requests": 1000
    }
  }
}
```

#### GET /api/system/health
Health check endpoint.

#### GET /api/system/config
Get system configuration.

#### GET /api/system/metrics
Get system performance metrics.

### Announcements

#### GET /api/announcements
Get active announcements.

**Query Parameters:**
- `audience` (string, optional): Filter by audience (all, free, pro, enterprise)
- `priority` (string, optional): Filter by priority (low, medium, high, critical)

**Response:**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "ann-123",
        "title": "New Feature Release",
        "content": "We've added new features...",
        "priority": "high",
        "audience": "all",
        "start_date": "2024-01-01T00:00:00Z",
        "end_date": null,
        "is_active": true
      }
    ],
    "count": 1,
    "filters": {
      "audience": "all",
      "priority": "all"
    }
  }
}
```

### Changelog

#### GET /api/changelog
Get latest changelog entries.

**Query Parameters:**
- `limit` (number, optional): Number of entries (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "changelog": [
      {
        "id": "changelog-123",
        "version": "1.0.0",
        "title": "Initial Release",
        "description": "First release of NekoStack",
        "release_date": "2024-01-01T00:00:00Z",
        "features": ["Image compression", "QR generation"]
      }
    ],
    "count": 1,
    "limit": 10
  }
}
```

## Tool Router

**Base URL**: `https://api-tools.nekostack.com`

**Note**: The old `https://tools.nekostack.com` URL is deprecated. Please use the new custom domain.

### Unit Converter

#### POST /api/tools/unit-converter
Convert between different units.

**Request Body:**
```json
{
  "value": 100,
  "fromUnit": "meter",
  "toUnit": "kilometer",
  "category": "length"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "original": {
      "value": 100,
      "unit": "meter"
    },
    "converted": {
      "value": 0.1,
      "unit": "kilometer"
    },
    "rate": 0.001,
    "category": "length",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/tools/unit-converter/currency
Convert between currencies.

**Request Body:**
```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "EUR",
  "date": "2024-01-01"
}
```

#### GET /api/tools/unit-converter/categories
Get available conversion categories.

### QR Generator

#### POST /api/tools/qr-generator
Generate QR code.

**Request Body:**
```json
{
  "text": "https://nekostack.com",
  "size": 200,
  "format": "png",
  "errorCorrectionLevel": "M",
  "foregroundColor": "#000000",
  "backgroundColor": "#FFFFFF",
  "margin": 4
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrCode": {
      "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "format": "png",
      "size": 200,
      "text": "https://nekostack.com"
    },
    "metadata": {
      "errorCorrectionLevel": "M",
      "foregroundColor": "#000000",
      "backgroundColor": "#FFFFFF",
      "margin": 4,
      "generatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /api/tools/qr-generator/bulk
Generate multiple QR codes.

**Request Body:**
```json
{
  "texts": ["https://nekostack.com", "https://example.com"],
  "options": {
    "size": 200,
    "format": "png"
  }
}
```

#### GET /api/tools/qr-generator/formats
Get supported output formats.

#### GET /api/tools/qr-generator/error-levels
Get error correction levels.

### Markdown Converter

#### POST /api/tools/markdown-converter
Convert markdown to other formats.

**Request Body:**
```json
{
  "markdown": "# Hello World\n\nThis is **bold** text.",
  "outputFormat": "html",
  "options": {
    "includeMath": false,
    "includeCharts": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "output": "<h1>Hello World</h1><p>This is <strong>bold</strong> text.</p>",
    "format": "html",
    "metadata": {
      "inputLength": 35,
      "outputLength": 65,
      "processedAt": "2024-01-01T00:00:00Z",
      "processingMethod": "worker"
    }
  }
}
```

#### GET /api/tools/markdown-converter/job/:jobId
Get job status for heavy processing.

#### GET /api/tools/markdown-converter/formats
Get supported output formats.

## Analytics Service

**Base URL**: `https://api-analytics.nekostack.com`

**Note**: The old `https://analytics.nekostack.com` URL is deprecated. Please use the new custom domain.

### Events

#### POST /api/analytics/track
Track analytics event.

**Request Body:**
```json
{
  "event_type": "tool_used",
  "tool_id": "image-compressor",
  "user_id": "user-123",
  "metadata": {
    "duration": 1500,
    "file_size": 1024000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "eventId": "event-123",
    "event_type": "tool_used",
    "tool_id": "image-compressor",
    "user_id": "user-123",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/analytics/events
Get analytics events.

**Query Parameters:**
- `user_id` (string, optional): Filter by user ID
- `tool_id` (string, optional): Filter by tool ID
- `event_type` (string, optional): Filter by event type
- `start_date` (string, optional): Start date (ISO 8601)
- `end_date` (string, optional): End date (ISO 8601)
- `limit` (number, optional): Number of events (default: 100, max: 1000)

#### POST /api/analytics/batch
Track multiple events.

**Request Body:**
```json
{
  "events": [
    {
      "event_type": "tool_used",
      "tool_id": "image-compressor",
      "user_id": "user-123"
    },
    {
      "event_type": "page_view",
      "user_id": "user-123"
    }
  ]
}
```

### Statistics

#### GET /api/analytics/stats
Get overall analytics statistics.

**Query Parameters:**
- `start_date` (string, optional): Start date (ISO 8601)
- `end_date` (string, optional): End date (ISO 8601)
- `period` (string, optional): Predefined period (1d, 7d, 30d, 90d)

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-08T00:00:00Z",
      "days": 7
    },
    "overall": {
      "total_events": 1000,
      "unique_users": 150,
      "unique_tools": 7,
      "unique_event_types": 5
    },
    "tools": [
      {
        "id": "image-compressor",
        "name": "Image Compressor & Converter",
        "usage_count": 500,
        "unique_users": 100,
        "avg_duration": 1500
      }
    ],
    "users": {
      "total_users": 150,
      "authenticated_users": 120,
      "anonymous_users": 30
    }
  }
}
```

#### GET /api/analytics/tools/:toolId/stats
Get tool-specific statistics.

#### GET /api/analytics/trends
Get usage trends.

### Performance

#### POST /api/analytics/performance
Track performance metrics.

**Request Body:**
```json
{
  "endpoint": "/api/tools/image-compressor",
  "response_time": 150.5,
  "error_rate": 0.001
}
```

#### GET /api/analytics/performance
Get performance metrics.

#### GET /api/analytics/performance/summary
Get performance summary.

#### GET /api/analytics/performance/health
Get performance health status.

## Notification Service

**Base URL**: `https://api-notifications.nekostack.com`

**Note**: The old `https://notifications.nekostack.com` URL is deprecated. Please use the new custom domain.

### Announcements

#### GET /api/notifications/announcements
Get active announcements.

**Query Parameters:**
- `audience` (string, optional): Filter by audience (all, free, pro, enterprise)
- `priority` (string, optional): Filter by priority (low, medium, high, critical)

#### GET /api/notifications/announcements/:id
Get specific announcement by ID.

#### GET /api/notifications/announcements/priority/:priority
Get announcements by priority.

#### GET /api/notifications/announcements/audience/:audience
Get announcements by audience.

#### GET /api/notifications/announcements/critical
Get critical announcements.

### System Status

#### GET /api/notifications/status
Get system status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00Z",
    "services": {
      "database": "healthy",
      "api": "healthy",
      "workers": "healthy",
      "notifications": "healthy"
    },
    "performance": {
      "average_response_time": 150.5,
      "error_rate": 0.001,
      "total_requests": 1000
    },
    "notifications": {
      "active_announcements": 2
    }
  }
}
```

#### GET /api/notifications/status/health
Health check endpoint.

#### GET /api/notifications/status/incidents
Get system incidents.

**Query Parameters:**
- `status` (string, optional): Filter by status (active, resolved, all)
- `limit` (number, optional): Number of incidents (default: 10, max: 100)

#### GET /api/notifications/status/uptime
Get system uptime.

**Query Parameters:**
- `period` (string, optional): Time period (1h, 24h, 7d, 30d, 90d)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req-123"
  }
}
```

### Common Error Codes

- `BAD_REQUEST` (400): Invalid request data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Access denied
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMIT_EXCEEDED` (429): Rate limit exceeded
- `INTERNAL_ERROR` (500): Internal server error
- `VALIDATION_ERROR` (400): Request validation failed

## Rate Limiting

All endpoints are rate limited:

- **Public APIs**: 1000 requests per 15 minutes
- **Protected APIs**: 100 requests per 15 minutes
- **Sensitive Operations**: 10 requests per 15 minutes

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## CORS

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Authentication

Some endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

## Pagination

List endpoints support pagination:
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

Pagination info is included in responses:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```
