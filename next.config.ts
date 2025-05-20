
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Removed to enable Server Actions
  // trailingSlash: true, // Removed as it's primarily for static exports
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true, // Removed as it's primarily for static exports
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', // Removed as it's primarily for GitHub Pages subdirectory deployment
};

export default nextConfig;
