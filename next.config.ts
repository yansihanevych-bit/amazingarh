import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ['image/avif', 'image/webp'], qualities: [75, 85, 90] },
  async redirects() {
    return [{ source: '/tavern', destination: '/en/tavern', permanent: false }];
  },
  async headers() {
    return [{ source: '/img/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
  },
};

export default nextConfig;
