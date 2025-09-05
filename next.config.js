/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,   // Enable React strict mode for development best practices
  swcMinify: true,         // Enable SWC minimizer to improve build size and speed

  /* Keep your existing overrides */
  typescript: {
    ignoreBuildErrors: true, // Consider fixing TS errors instead of ignoring, if possible
  },
  eslint: {
    ignoreDuringBuilds: true, // Same for lint errors
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
        destination: '/:path*',
      },
      {
        source: '/fb-frameworks-test-mission-command',
        destination: 'http://localhost:9002/fb-frameworks-test-mission-command',
      },
      {
        source: '/fb-frameworks-test-mission-command/:path*',
        destination: 'http://localhost:9002/fb-frameworks-test-mission-command/:path*',
      },
    ]
  },
}

module.exports = nextConfig
