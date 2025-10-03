# NekoStack Monorepo Implementation Plan

## Phase 1: Initial Setup & Root Configuration

### Step 1: Initialize Root Repository
```bash
# Create root directory
mkdir nekostack
cd nekostack

# Initialize git repository
git init
git branch -M main

# Create initial directory structure
mkdir -p apps services packages tools infrastructure docs scripts
mkdir -p services/workers services/containers services/shared
mkdir -p packages/ui packages/config packages/types packages/utils packages/database
mkdir -p infrastructure/cloudflare infrastructure/oracle infrastructure/docker
```

### Step 2: Root Package Configuration
```bash
# Initialize root package.json
npm init -y

# Install monorepo management tools
npm install -D turbo
npm install -D @changesets/cli
npm install -D typescript @types/node
npm install -D eslint prettier
npm install -D husky lint-staged
```

**Create `package.json`:**
```json
{
  "name": "nekostack",
  "version": "1.0.0",
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
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "clean": "turbo run clean",
    "deploy": "turbo run deploy"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "@changesets/cli": "^2.26.0",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  }
}
```

### Step 3: Root Configuration Files

**Create `turbo.json`:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "clean": {
      "cache": false
    },
    "deploy": {
      "dependsOn": ["build", "lint"]
    }
  }
}
```

**Create `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@nekostack/ui": ["./packages/ui/src"],
      "@nekostack/types": ["./packages/types/src"],
      "@nekostack/utils": ["./packages/utils/src"],
      "@nekostack/config": ["./packages/config/src"],
      "@nekostack/database": ["./packages/database/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Create `.eslintrc.js`:**
```javascript
module.exports = {
  root: true,
  extends: ["eslint:recommended", "@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", "build/"],
};
```

**Create `.prettierrc`:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

**Create `.gitignore`:**
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
dist/
build/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Turbo
.turbo

# AWS
.aws-sam/

# Docker
Dockerfile.prod
docker-compose.prod.yml

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

## Phase 2: Shared Packages Setup

### Step 4: Create Shared UI Package
```bash
cd packages/ui
npm init -y
npm install react react-dom @types/react @types/react-dom
npm install tailwindcss @tailwindcss/forms @tailwindcss/typography
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react @radix-ui/react-slot
```

**Create `packages/ui/package.json`:**
```json
{
  "name": "@nekostack/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "tailwindcss": "^3.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "lucide-react": "^0.263.0",
    "@radix-ui/react-slot": "^1.0.2"
  }
}
```

**Create basic UI structure:**
```bash
mkdir -p src/components/forms src/components/layout src/components/data-display
mkdir -p src/components/feedback src/components/navigation
mkdir -p src/hooks src/utils src/styles

# Create index files
touch src/index.ts
touch src/components/index.ts
touch src/hooks/index.ts
touch src/utils/index.ts
```

### Step 5: Create Shared Types Package
```bash
cd packages/types
npm init -y
```

**Create `packages/types/package.json`:**
```json
{
  "name": "@nekostack/types",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**Create types structure:**
```bash
mkdir -p src/api src/database src/user src/tools src/common
touch src/index.ts src/api/index.ts src/database/index.ts
touch src/user/index.ts src/tools/index.ts src/common/index.ts
```

### Step 6: Create Shared Utils Package
```bash
cd packages/utils
npm init -y
npm install date-fns zod
```

**Create `packages/utils/package.json`:**
```json
{
  "name": "@nekostack/utils",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "date-fns": "^2.30.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

### Step 7: Create Config Package
```bash
cd packages/config
npm init -y
```

**Create `packages/config/package.json`:**
```json
{
  "name": "@nekostack/config",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

## Phase 3: Applications Setup

### Step 8: Create Homepage Application
```bash
cd apps
npx create-next-app@latest homepage --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd homepage

# Install additional dependencies
npm install @nekostack/ui @nekostack/types @nekostack/utils @nekostack/config
npm install zustand @tanstack/react-query
npm install next-themes
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog
```

**Update `apps/homepage/package.json`:**
```json
{
  "name": "homepage",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf .next"
  },
  "dependencies": {
    "@nekostack/ui": "*",
    "@nekostack/types": "*",
    "@nekostack/utils": "*",
    "@nekostack/config": "*",
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^4.35.0",
    "next-themes": "^0.2.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3",
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}
```

**Create homepage directory structure:**
```bash
mkdir -p src/app/\(dashboard\)/tools src/app/\(dashboard\)/profile src/app/\(dashboard\)/settings
mkdir -p src/app/api
mkdir -p src/components/dashboard src/components/landing src/components/tools
mkdir -p src/hooks src/stores src/lib
```

### Step 9: Create Dashboard and Admin Apps
```bash
cd apps
npx create-next-app@latest dashboard --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx create-next-app@latest admin --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install dependencies for both
cd dashboard && npm install @nekostack/ui @nekostack/types @nekostack/utils @nekostack/config
cd ../admin && npm install @nekostack/ui @nekostack/types @nekostack/utils @nekostack/config
```

## Phase 4: Services Setup

### Step 10: Create Cloudflare Workers Structure
```bash
cd services/workers

# Create API Gateway Worker
mkdir api-gateway
cd api-gateway
npm init -y
npm install @cloudflare/workers-types
npm install -D wrangler typescript

# Create other workers
cd ..
mkdir auth-service analytics-service notification-service
mkdir shared

# Create shared utilities
cd shared
mkdir database kv auth types
```

**Create `services/workers/api-gateway/package.json`:**
```json
{
  "name": "api-gateway",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.0.0",
    "wrangler": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

**Create worker structure:**
```bash
mkdir -p src/routes src/middleware src/utils
touch src/index.ts wrangler.toml
```

### Step 11: Create Oracle Container Instances Structure
```bash
cd services/containers

# Create container services
mkdir image-processor document-processor ai-analyzer queue-processor
mkdir shared

# Create shared utilities
cd shared
mkdir oracle queue storage monitoring
```

**Create `services/containers/image-processor/package.json`:**
```json
{
  "name": "image-processor",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "lint": "eslint src/",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "express": "^4.18.0",
    "sharp": "^0.32.0",
    "oci-sdk": "^2.70.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "nodemon": "^3.0.0",
    "ts-node": "^10.9.0"
  }
}
```

## Phase 5: Tools Structure Setup

### Step 12: Create Individual Tool Structures
```bash
cd tools

# Create all tool directories
mkdir image-compressor qr-generator markdown-editor unit-converter
mkdir signature-creator resume-builder ats-checker

# For each tool, create the structure (example with image-compressor)
cd image-compressor
mkdir frontend backend shared docs

# Frontend setup
cd frontend
npm init -y
npm install react react-dom next typescript
mkdir -p src/components src/hooks src/utils src/types

# Backend setup
cd ../backend
mkdir worker container

# Shared setup
cd ../shared
mkdir types validation constants
```

## Phase 6: Infrastructure Setup

### Step 13: Create Infrastructure Structure
```bash
cd infrastructure

# Cloudflare setup
cd cloudflare
mkdir pages workers d1 kv images dns

# Oracle Cloud setup
cd ../oracle
mkdir terraform oci-cli
mkdir -p docker/base docker/services

# Terraform setup
cd terraform
mkdir modules environments
mkdir -p environments/dev environments/staging environments/production
touch main.tf variables.tf outputs.tf

# Create Terraform modules
cd modules
touch container-instances.tf object-storage.tf streaming.tf monitoring.tf
```

## Phase 7: Final Setup Steps

### Step 14: Install Dependencies and Build
```bash
# From root directory
cd nekostack

# Install all dependencies
npm install

# Build all packages
npm run build

# Verify everything works
npm run lint
```

### Step 15: Create Initial Documentation
```bash
cd docs
touch README.md CONTRIBUTING.md DEPLOYMENT.md
mkdir api-docs architecture
```

### Step 16: Initialize Git and First Commit
```bash
# Add all files
git add .

# Create initial commit
git commit -m "feat: initial monorepo setup with basic structure

- Add root configuration with Turborepo
- Setup shared packages (ui, types, utils, config)
- Initialize Next.js applications (homepage, dashboard, admin)
- Create Cloudflare Workers structure
- Setup Oracle Container Instances structure
- Add individual tool directories
- Configure infrastructure setup
- Add comprehensive tooling and linting"

# Add remote and push (replace with your repo URL)
# git remote add origin https://github.com/your-username/nekostack.git
# git push -u origin main
```

## Verification Checklist

After completing all steps, verify:

- [ ] Root `package.json` with workspaces configured
- [ ] Turborepo configuration working (`npm run build`)
- [ ] All shared packages created and linked
- [ ] Homepage Next.js app running (`cd apps/homepage && npm run dev`)
- [ ] Worker structure created with basic configuration
- [ ] Container structure created with Docker setup
- [ ] All tool directories created with proper structure
- [ ] Infrastructure directories created
- [ ] Git repository initialized with first commit
- [ ] TypeScript configuration working across all packages
- [ ] ESLint and Prettier configured and working

## Next Steps

After completing this implementation plan:

1. **Configure Cloudflare accounts** and deploy first worker
2. **Setup Oracle Cloud accounts** and configure Terraform stacks
3. **Implement authentication** across all applications
4. **Create database schemas** and migrations
5. **Build first tool** (recommend starting with Unit Converter)
6. **Setup CI/CD pipelines** for automated deployments

This implementation plan provides a solid foundation for the NekoStack monorepo without any complex features or tests, focusing purely on getting the structure in place and ready for development.
