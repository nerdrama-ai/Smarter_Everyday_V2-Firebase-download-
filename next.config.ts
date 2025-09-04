import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `/:path*`,
      },
      {
        source: '/fb-frameworks-test-mission-command',
        destination: `http://localhost:9002/fb-frameworks-test-mission-command`,
      },
      {
        source: '/fb-frameworks-test-mission-command/:path*',
        destination: `http://localhost:9002/fb-frameworks-test-mission-command/:path*`,
      },
    ];
  },
};

export default nextConfig;
