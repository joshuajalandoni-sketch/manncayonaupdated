import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Artwork is the product here — allow large, high-fidelity renditions.
    deviceSizes: [420, 640, 828, 1080, 1366, 1920, 2560, 3200],
    imageSizes: [160, 240, 320, 480, 640],
  },
};

export default nextConfig;
