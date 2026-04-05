import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  experimental: { typedRoutes: false } as any,
};

export default nextConfig;
