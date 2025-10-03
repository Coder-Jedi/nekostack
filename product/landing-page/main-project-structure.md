# NekoStack Monorepo Project Structure

## Root Level Architecture

```
nekostack/
├── apps/                           # Applications
│   ├── homepage/                   # Next.js homepage (Cloudflare Pages)
│   ├── dashboard/                  # User dashboard (Next.js)
│   └── admin/                      # Admin panel (Next.js)
├── services/                       # Backend services
│   ├── workers/                    # Cloudflare Workers
│   ├── containers/                 # Oracle Container Instances
│   └── shared/                     # Shared backend utilities
├── packages/                       # Shared packages
│   ├── ui/                         # Shared UI components
│   ├── config/                     # Shared configurations
│   ├── types/                      # TypeScript type definitions
│   ├── utils/                      # Shared utilities
│   └── database/                   # Database schemas and migrations
├── tools/                          # Individual SaaS tools
│   ├── image-compressor/           # Image processing tool
│   ├── qr-generator/               # QR & Barcode generator
│   ├── markdown-editor/            # Markdown editor & converter
│   ├── unit-converter/             # Unit & currency converter
│   ├── signature-creator/          # Digital signature tool
│   ├── resume-builder/             # Resume builder
│   └── ats-checker/                # ATS compatibility checker
├── infrastructure/                 # Infrastructure as Code
│   ├── cloudflare/                 # Cloudflare configurations
│   ├── oracle/                     # Oracle Cloud Infrastructure configs
│   └── docker/                     # Docker configurations
├── docs/                           # Documentation
├── scripts/                        # Build and deployment scripts
└── config files...                 # Root configuration files
```

## Detailed Structure Breakdown

### **Apps Directory (`/apps`)**

**Homepage Application (`/apps/homepage`)**
```
apps/homepage/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (dashboard)/            # Route groups
│   │   │   ├── page.tsx            # Dashboard homepage
│   │   │   ├── tools/              # Tools listing
│   │   │   ├── profile/            # User profile
│   │   │   └── settings/           # User settings
│   │   ├── api/                    # API routes (proxy to Workers)
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Landing page
│   ├── components/                 # Homepage-specific components
│   │   ├── dashboard/              # Dashboard components
│   │   ├── landing/                # Landing page components
│   │   └── tools/                  # Tool-related components
│   ├── hooks/                      # Custom React hooks
│   ├── stores/                     # Zustand stores
│   ├── lib/                        # Utilities and configurations
│   └── types/                      # Local type definitions
├── public/                         # Static assets
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind configuration
├── package.json
└── tsconfig.json
```

### **Services Directory (`/services`)**

**Cloudflare Workers (`/services/workers`)**
```
services/workers/
├── api-gateway/                    # Main API router
│   ├── src/
│   │   ├── index.ts                # Main worker entry
│   │   ├── routes/                 # API route handlers
│   │   ├── middleware/             # Authentication, CORS, etc.
│   │   └── utils/                  # Worker utilities
│   ├── wrangler.toml               # Worker configuration
│   └── package.json
├── auth-service/                   # Authentication worker
├── analytics-service/              # Analytics collection
├── notification-service/           # Real-time notifications
└── shared/                         # Shared worker utilities
    ├── database/                   # D1 database helpers
    ├── kv/                         # KV storage helpers
    ├── auth/                       # JWT utilities
    └── types/                      # Shared types
```

**Oracle Container Instances (`/services/containers`)**
```
services/containers/
├── image-processor/                # Image compression & conversion
│   ├── src/
│   │   ├── app.ts                  # Express/Fastify app
│   │   ├── handlers/               # Processing handlers
│   │   ├── utils/                  # Image processing utilities
│   │   └── types/                  # Type definitions
│   ├── Dockerfile
│   ├── package.json
│   └── docker-compose.yml
├── document-processor/             # PDF generation, resume building
├── ai-analyzer/                    # ATS checking, content analysis
├── queue-processor/                # Oracle Streaming message processing
└── shared/                         # Shared container utilities
    ├── oracle/                     # Oracle Cloud SDK helpers
    ├── queue/                      # Oracle Streaming utilities
    ├── storage/                    # Oracle Object Storage utilities
    └── monitoring/                 # Oracle APM logging
```

### **Packages Directory (`/packages`)**

**Shared UI Components (`/packages/ui`)**
```
packages/ui/
├── src/
│   ├── components/                 # Reusable components
│   │   ├── forms/                  # Form components
│   │   ├── layout/                 # Layout components
│   │   ├── data-display/           # Tables, cards, etc.
│   │   ├── feedback/               # Alerts, modals, etc.
│   │   └── navigation/             # Navigation components
│   ├── hooks/                      # Shared React hooks
│   ├── utils/                      # UI utilities
│   └── styles/                     # Shared styles
├── package.json
├── tailwind.config.js              # Base Tailwind config
└── tsconfig.json
```

**Shared Types (`/packages/types`)**
```
packages/types/
├── src/
│   ├── api/                        # API response types
│   ├── database/                   # Database schema types
│   ├── user/                       # User-related types
│   ├── tools/                      # Tool-specific types
│   └── common/                     # Common utility types
├── package.json
└── tsconfig.json
```

### **Tools Directory (`/tools`)**

**Individual Tool Structure (Example: Image Compressor)**
```
tools/image-compressor/
├── frontend/                       # Tool's frontend interface
│   ├── src/
│   │   ├── components/             # Tool-specific components
│   │   ├── hooks/                  # Tool-specific hooks
│   │   ├── utils/                  # Frontend utilities
│   │   └── types/                  # Frontend types
│   └── package.json
├── backend/                        # Tool's backend logic
│   ├── worker/                     # Cloudflare Worker (light tasks)
│   └── container/                  # Oracle Container Instance (heavy tasks)
├── shared/                         # Shared tool utilities
│   ├── types/                      # Shared types
│   ├── validation/                 # Input validation
│   └── constants/                  # Tool constants
└── docs/                           # Tool documentation
```

### **Infrastructure Directory (`/infrastructure`)**

**Cloudflare Configuration (`/infrastructure/cloudflare`)**
```
infrastructure/cloudflare/
├── pages/                          # Pages deployment configs
├── workers/                        # Worker deployment configs
├── d1/                             # Database schemas and migrations
├── kv/                             # KV namespace configurations
├── images/                         # Image service configurations
└── dns/                            # DNS and domain configurations
```

**Oracle Cloud Configuration (`/infrastructure/oracle`)**
```
infrastructure/oracle/
├── terraform/                      # Terraform configurations for OCI
│   ├── modules/
│   │   ├── container-instances.tf  # Oracle Container Instances
│   │   ├── object-storage.tf       # Oracle Object Storage
│   │   ├── streaming.tf            # Oracle Streaming service
│   │   └── monitoring.tf           # Oracle APM and logging
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   └── main.tf
├── oci-cli/                        # OCI CLI configurations
└── docker/                         # Docker configurations
    ├── base/                       # Base images
    └── services/                   # Service-specific Dockerfiles
```

## Monorepo Management

### **Root Configuration Files**

```
nekostack/
├── package.json                    # Root package.json with workspaces
├── turbo.json                      # Turborepo configuration
├── nx.json                         # Nx configuration (alternative)
├── tsconfig.json                   # Base TypeScript config
├── .eslintrc.js                    # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variables template
├── docker-compose.yml              # Local development setup
└── README.md                       # Project documentation
```

### **Package.json Workspaces Configuration**

```json
{
  "name": "nekostack",
  "private": true,
  "workspaces": [
    "apps/*",
    "services/workers/*",
    "services/containers/*",
    "packages/*",
    "tools/*/frontend",
    "tools/*/backend/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "deploy": "turbo run deploy"
  }
}
```

### **Turborepo Configuration (`turbo.json`)**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "deploy": {
      "dependsOn": ["build", "test", "lint"]
    }
  }
}
```

## Development Workflow Benefits

### **AI Agent Advantages**
- **Clear separation of concerns** with dedicated directories
- **Consistent structure** across all tools and services
- **Shared packages** reduce code duplication
- **Type safety** across the entire monorepo
- **Predictable patterns** that AI can easily understand and replicate

### **Scalability Benefits**
- **Independent deployments** for each service
- **Shared dependencies** managed at the root level
- **Consistent tooling** across all packages
- **Easy addition** of new tools following established patterns
- **Efficient caching** with Turborepo

### **Development Experience**
- **Hot reloading** across all applications
- **Shared component library** for consistent UI
- **Centralized configuration** management
- **Unified testing** and linting setup
- **Docker-based** local development environment

This monorepo structure provides a solid foundation for the NekoStack platform, supporting both the current requirements and future growth while maintaining excellent developer experience and AI agent compatibility.
