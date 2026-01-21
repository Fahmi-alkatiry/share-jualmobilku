import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb", // Naikkan batas ke 10MB atau sesuai kebutuhan
    },
  },
};

export default nextConfig;