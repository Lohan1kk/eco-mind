import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Include retina / 4K breakpoints so the hero is not capped at 1920
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    imageSizes: [64, 96, 128, 256, 384],
    qualities: [75, 80, 85, 90, 92, 95],
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
