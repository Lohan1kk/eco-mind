import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Cap at 2K — phones must not pull 4K hero variants
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [75, 78, 90],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
