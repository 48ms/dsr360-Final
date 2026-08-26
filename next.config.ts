import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "192.168.18.44:3000",
        "*.ngrok-free.app",
        "*.loca.lt",
      ],
    },
  },
};

export default nextConfig;
