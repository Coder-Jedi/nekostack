/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nekostack/ui', '@nekostack/types', '@nekostack/utils', '@nekostack/config'],
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig
