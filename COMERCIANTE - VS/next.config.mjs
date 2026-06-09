/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    // Permite que o VOUCHER SOCIAL (localhost:3001 e produção) chame as APIs do COMERCIANTE
    const voucherAppUrl = process.env.NEXT_PUBLIC_VOUCHER_APP_URL || "http://localhost:3001"

    return [
      // CORS para as rotas de API — necessário para integração com VOUCHER SOCIAL
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: voucherAppUrl },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
      // Headers de segurança para páginas
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}

export default nextConfig
