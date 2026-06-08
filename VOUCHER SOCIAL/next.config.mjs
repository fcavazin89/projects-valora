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
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Configuração vazia do Turbopack para aceitar o webpack do PWA
  turbopack: {},
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
        ],
      },
    ]
  },
}

export default pwaConfig(nextConfig)
