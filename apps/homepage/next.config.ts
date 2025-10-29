import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  transpilePackages: ['@nekostack/ui', '@nekostack/types', '@nekostack/utils', '@nekostack/config'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;

// Initialize OpenNext Cloudflare for development
initOpenNextCloudflareForDev();

