import withPWA from '@ducanh2912/next-pwa'

const isDev = process.env.NODE_ENV === 'development'

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev, // Desabilita PWA em desenvolvimento
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    disableDevLogs: true,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default pwaConfig(nextConfig)
