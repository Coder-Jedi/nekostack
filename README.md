# NekoStack - SaaS Tools Suite

A comprehensive monorepo containing multiple SaaS tools built with modern web technologies.

## Architecture

- **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
- **Edge Computing**: Cloudflare Workers for lightweight operations
- **Heavy Computing**: Oracle Container Instances for intensive tasks
- **Storage**: Oracle Object Storage + Cloudflare KV
- **Queue**: Oracle Streaming for task processing

## Project Structure

```
nekostack/
├── apps/                    # Next.js applications
│   ├── homepage/           # Main landing page
│   ├── dashboard/          # User dashboard
│   └── admin/              # Admin panel
├── services/               # Backend services
│   ├── workers/           # Cloudflare Workers
│   └── containers/        # Oracle Container Instances
├── packages/              # Shared packages
│   ├── ui/               # UI component library
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Shared utilities
│   └── config/           # Shared configurations
├── tools/                # Individual SaaS tools
│   ├── image-compressor/
│   ├── qr-generator/
│   ├── markdown-editor/
│   ├── unit-converter/
│   ├── signature-creator/
│   ├── resume-builder/
│   └── ats-checker/
└── infrastructure/       # Infrastructure as Code
    ├── cloudflare/      # Cloudflare configurations
    └── oracle/          # Oracle Cloud configurations
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build all packages
npm run build

# Lint all packages
npm run lint
```

## Tools Included

1. **Image Compressor & Converter** - Optimize and convert images
2. **QR Code & Barcode Generator** - Generate QR codes and barcodes
3. **Markdown Editor & Converter** - Edit and convert markdown files
4. **Unit & Currency Converter** - Convert units and currencies
5. **Signature Creator** - Create digital signatures
6. **Resume Builder** - Build professional resumes
7. **ATS Checker** - Check resume ATS compatibility

## Development

This is a Turborepo monorepo with the following key features:

- **Shared packages** for consistent UI and utilities
- **Independent deployments** for each service
- **Type safety** across the entire codebase
- **Efficient caching** with Turborepo

## License

MIT
