import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Required for static export to GitHub Pages
  trailingSlash: true, // Recommended for static exports, helps with routing on GitHub Pages
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Required for next/image to work correctly with static exports on GitHub Pages
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // If your GitHub Pages site is served from a subdirectory (e.g., https://<username>.github.io/<repository-name>/),
  // you will need to set the basePath.
  // 1. Uncomment the line below.
  // 2. In your GitHub Actions workflow file (e.g., .github/workflows/deploy.yml),
  //    under the 'Build Next.js app' step, add `env: { NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}" }`
  //    (Ensure the env var name matches what you use here).
  //
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  //
  // Note: If you enable basePath, ensure any direct links or image src attributes in your code
  // that don't use Next.js components (like `<Link>` or `<Image>`) are manually prefixed with the basePath.
  // Next.js components usually handle this automatically.
};

export default nextConfig;
