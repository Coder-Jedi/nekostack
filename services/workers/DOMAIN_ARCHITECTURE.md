# NekoStack Domain Architecture

This document outlines the complete domain structure for NekoStack, including current API services and future tool-specific subdomains.

## Overview

NekoStack uses a hierarchical domain structure that separates concerns and provides clear organization:

- **Main Website**: `nekostack.com` - Primary marketing and user interface
- **API Services**: `api-*.nekostack.com` - Backend services with consistent naming
- **Tool Subdomains**: `*.nekostack.com` - Specialized tool interfaces

## Current Domain Structure

### Main Website
- **Primary**: `nekostack.com`
- **WWW**: `www.nekostack.com` (redirects to primary)
- **Purpose**: Marketing site, user dashboard, authentication
- **Technology**: Next.js 14 with App Router
- **Hosting**: Vercel or similar (to be determined)

### API Services (Current Implementation)

All API services use the `api-` prefix for consistency and easy identification:

#### 1. API Gateway
- **Domain**: `api-gateway.nekostack.com`
- **Purpose**: Central routing, authentication, rate limiting
- **Endpoints**:
  - `GET /api/tools` - List all tools
  - `GET /api/categories` - List tool categories
  - `GET /api/system/status` - System health
  - `GET /api/announcements` - System announcements
  - `GET /api/changelog` - Product changelog

#### 2. Tool Router
- **Domain**: `api-tools.nekostack.com`
- **Purpose**: Tool execution and processing
- **Endpoints**:
  - `POST /api/tools/unit-converter` - Unit conversion
  - `POST /api/tools/currency-converter` - Currency conversion
  - `POST /api/tools/qr-generator` - QR code generation
  - `POST /api/tools/markdown-converter` - Markdown conversion

#### 3. Analytics Service
- **Domain**: `api-analytics.nekostack.com`
- **Purpose**: Usage analytics and reporting
- **Endpoints**:
  - `POST /api/analytics/events` - Track events
  - `GET /api/analytics/stats` - Usage statistics
  - `GET /api/analytics/performance` - Performance metrics

#### 4. Notification Service
- **Domain**: `api-notifications.nekostack.com`
- **Purpose**: System notifications and announcements
- **Endpoints**:
  - `GET /api/notifications/announcements` - User announcements
  - `GET /api/notifications/status` - System status
  - `POST /api/notifications/subscribe` - Notification subscriptions

## Future Tool Subdomains (Planned for Future Implementation)

### Planned Architecture

**Note**: Tool subdomains are planned for future implementation. Each tool subdomain will host a specialized Next.js application focused on a specific category of tools:

#### 1. PDF Tools
- **Domain**: `pdf.nekostack.com`
- **Purpose**: All PDF-related tools
- **Tools**:
  - PDF Converter (to/from various formats)
  - PDF Merger (combine multiple PDFs)
  - PDF Splitter (split PDF into pages)
  - PDF Compressor (reduce file size)
  - PDF to Word Converter
  - PDF to Excel Converter
  - PDF Password Protection
  - PDF Watermark Tool

#### 2. Image Tools
- **Domain**: `image.nekostack.com`
- **Purpose**: Image processing and conversion
- **Tools**:
  - Image Format Converter (JPG, PNG, WebP, etc.)
  - Image Compressor (reduce file size)
  - Image Resizer (change dimensions)
  - Image Cropper (crop images)
  - Image Rotator (rotate/flip images)
  - Image Watermark Tool
  - Image to PDF Converter
  - Image Color Picker

#### 3. Text Tools
- **Domain**: `text.nekostack.com`
- **Purpose**: Text processing and formatting
- **Tools**:
  - Text Formatter (case conversion, etc.)
  - Markdown to HTML Converter
  - HTML to Markdown Converter
  - Text Diff Tool
  - Word Counter
  - Character Counter
  - Text Encoder/Decoder (Base64, URL, etc.)
  - Lorem Ipsum Generator

#### 4. Crypto Tools
- **Domain**: `crypto.nekostack.com`
- **Purpose**: Cryptographic utilities
- **Tools**:
  - Hash Generator (MD5, SHA-1, SHA-256, etc.)
  - Password Generator
  - Encryption/Decryption Tools
  - Base64 Encoder/Decoder
  - JWT Decoder
  - UUID Generator
  - Random String Generator
  - Checksum Calculator

#### 5. Developer Tools
- **Domain**: `dev.nekostack.com`
- **Purpose**: Developer utilities
- **Tools**:
  - JSON Formatter/Validator
  - XML Formatter/Validator
  - YAML Formatter/Validator
  - SQL Formatter
  - Regex Tester
  - URL Encoder/Decoder
  - Timestamp Converter
  - Color Palette Generator

## Cross-Domain Architecture

### Authentication Strategy

All subdomains share the same authentication system:

1. **Primary Authentication**: Handled by main site (`nekostack.com`)
2. **Session Sharing**: JWT tokens work across all subdomains
3. **User Data**: Centralized in Supabase, accessible from all subdomains
4. **CORS Configuration**: All subdomains are whitelisted in API services

### API Integration

Each tool subdomain integrates with the centralized API services:

```typescript
// Example: PDF tools calling API Gateway
const tools = await fetch('https://api-gateway.nekostack.com/api/tools');

// Example: Image tools calling Tool Router
const result = await fetch('https://api-tools.nekostack.com/api/tools/image-converter', {
  method: 'POST',
  body: JSON.stringify(imageData)
});
```

### Navigation and Routing

#### Main Navigation
- **Header**: Consistent across all subdomains
- **User Menu**: Shows user profile and settings
- **Tool Categories**: Links to appropriate subdomains
- **Search**: Global search across all tools

#### Subdomain Navigation
- **Breadcrumbs**: Show path from main site to current tool
- **Category Tools**: List all tools in current category
- **Related Tools**: Suggest similar tools from other categories
- **Back to Main**: Easy return to main site

## Technical Implementation

### DNS Configuration

All subdomains use CNAME records pointing to appropriate services:

```
# Main website (when hosted)
nekostack.com → A record to hosting provider
www.nekostack.com → CNAME to nekostack.com

# API services
api-gateway.nekostack.com → CNAME to nekostack-api-gateway-production.workers.dev
api-tools.nekostack.com → CNAME to nekostack-tool-router-production.workers.dev
api-analytics.nekostack.com → CNAME to nekostack-analytics-service-production.workers.dev
api-notifications.nekostack.com → CNAME to nekostack-notification-service-production.workers.dev

# Tool subdomains (future)
pdf.nekostack.com → CNAME to pdf-app.vercel.app (or similar)
image.nekostack.com → CNAME to image-app.vercel.app
text.nekostack.com → CNAME to text-app.vercel.app
crypto.nekostack.com → CNAME to crypto-app.vercel.app
dev.nekostack.com → CNAME to dev-app.vercel.app
```

### SSL Certificates

- **Cloudflare**: Automatic SSL for all domains
- **Wildcard Certificate**: `*.nekostack.com` covers all subdomains
- **Automatic Renewal**: Handled by Cloudflare
- **HTTPS Enforcement**: All domains redirect HTTP to HTTPS

### CORS Configuration

All API services allow requests from all NekoStack domains:

```typescript
const ALLOWED_ORIGINS = [
  'https://nekostack.com',
  'https://www.nekostack.com',
  'https://api-gateway.nekostack.com',
  'https://api-tools.nekostack.com',
  'https://api-analytics.nekostack.com',
  'https://api-notifications.nekostack.com',
  // Future tool subdomains
  'https://pdf.nekostack.com',
  'https://image.nekostack.com',
  'https://text.nekostack.com',
  'https://crypto.nekostack.com',
  'https://dev.nekostack.com'
];
```

## Deployment Strategy

### Monorepo Structure

Each tool subdomain will be a separate Next.js application in the monorepo:

```
apps/
├── homepage/           # Main website (nekostack.com)
├── pdf-tools/         # PDF tools (pdf.nekostack.com)
├── image-tools/       # Image tools (image.nekostack.com)
├── text-tools/        # Text tools (text.nekostack.com)
├── crypto-tools/      # Crypto tools (crypto.nekostack.com)
└── dev-tools/         # Developer tools (dev.nekostack.com)
```

### Shared Components

Common components and utilities shared across all applications:

```
packages/
├── ui/                # Shared UI components
├── types/             # Shared TypeScript types
├── utils/             # Shared utility functions
└── config/            # Shared configuration
```

### Independent Deployment

Each subdomain can be deployed independently:

```bash
# Deploy specific tool subdomain
npm run deploy:pdf-tools
npm run deploy:image-tools
npm run deploy:text-tools
npm run deploy:crypto-tools
npm run deploy:dev-tools

# Deploy all tool subdomains
npm run deploy:all-tools
```

## Performance Considerations

### CDN and Caching

- **Cloudflare CDN**: All domains benefit from global CDN
- **Edge Caching**: Static assets cached at edge locations
- **API Caching**: API responses cached based on headers
- **Image Optimization**: Automatic image optimization via Cloudflare

### Load Balancing

- **API Services**: Cloudflare Workers provide automatic scaling
- **Tool Applications**: Vercel or similar provides automatic scaling
- **Database**: Supabase handles database scaling
- **File Storage**: Supabase Storage with CDN

### Monitoring and Analytics

- **Cloudflare Analytics**: Traffic and performance metrics
- **Custom Analytics**: Via analytics service for detailed insights
- **Error Tracking**: Centralized error monitoring
- **Uptime Monitoring**: Service health monitoring

## Security Considerations

### Domain Security

- **SSL/TLS**: All domains use HTTPS with modern TLS versions
- **HSTS**: HTTP Strict Transport Security enabled
- **CSP**: Content Security Policy headers configured
- **CORS**: Properly configured cross-origin resource sharing

### Authentication Security

- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Proper session handling across domains
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: All inputs validated and sanitized

### Data Protection

- **Encryption**: Sensitive data encrypted at rest and in transit
- **Privacy**: User data handling follows privacy regulations
- **Access Control**: Proper access control and permissions
- **Audit Logging**: Comprehensive audit trails

## Future Expansion

### Additional Tool Categories

Potential future tool subdomains:

- `video.nekostack.com` - Video processing tools
- `audio.nekostack.com` - Audio processing tools
- `data.nekostack.com` - Data analysis and visualization tools
- `design.nekostack.com` - Design and creative tools
- `finance.nekostack.com` - Financial calculation tools
- `education.nekostack.com` - Educational tools and calculators

### Internationalization

- `fr.nekostack.com` - French language tools
- `es.nekostack.com` - Spanish language tools
- `de.nekostack.com` - German language tools
- `ja.nekostack.com` - Japanese language tools

### Enterprise Features

- `enterprise.nekostack.com` - Enterprise dashboard
- `admin.nekostack.com` - Administrative interface
- `api.nekostack.com` - Public API documentation
- `status.nekostack.com` - System status page

## Migration Strategy

### Phase 1: Current Implementation ✅
- ✅ Main website on `nekostack.com`
- ✅ API services with `api-` prefix
- ✅ Custom domains for all API services
- ✅ Rate limiting configuration optimized

### Phase 2: Future Tool Subdomains (Planned)
- 📋 Implement `pdf.nekostack.com` - PDF tools
- 📋 Implement `image.nekostack.com` - Image tools
- 📋 Implement `text.nekostack.com` - Text tools
- 📋 Implement `crypto.nekostack.com` - Crypto tools
- 📋 Implement `dev.nekostack.com` - Developer tools

### Phase 3: Future Enhancements (Planned)
- 📋 Create shared component library
- 📋 Implement cross-domain navigation
- 📋 Add comprehensive testing
- 📋 Performance optimization
- 📋 SEO optimization for each subdomain
- 📋 Advanced analytics and monitoring

## Conclusion

This domain architecture provides:

1. **Scalability**: Easy to add new tool categories
2. **Maintainability**: Clear separation of concerns
3. **User Experience**: Intuitive and organized tool access
4. **Performance**: Optimized for speed and reliability
5. **Security**: Comprehensive security measures
6. **Flexibility**: Adaptable to future requirements

The architecture supports NekoStack's growth from a simple tool collection to a comprehensive platform for various utility tools, while maintaining performance, security, and user experience standards.
