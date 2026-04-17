import type { NextConfig } from "next";

// Инкрементировать при необходимости принудительной пересборки
const BUILD_VERSION = 10;

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'tellurmarkirovka.vercel.app' }],
        destination: 'https://kassa-cto.ru/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://www.googletagmanager.com https://cdn.jsdelivr.net",
              "connect-src 'self' https://mc.yandex.ru https://www.googletagmanager.com",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' https://fonts.gstatic.com",
              "frame-src https://www.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;
