import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pinned so Turbopack does not walk up to the home directory looking for a lockfile.
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [{ source: "/contact", destination: "/visit", permanent: true }];
  },
};

export default nextConfig;
