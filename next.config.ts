import type { NextConfig } from "next";

// Инкрементировать при необходимости принудительной пересборки
const BUILD_VERSION = 3;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
