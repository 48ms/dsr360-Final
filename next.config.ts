import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.18.44",
    "192.168.18.44:3000",
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
  ],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "192.168.18.44:3000",
        "192.168.18.44",
        "*.ngrok-free.app",
        "*.loca.lt",
      ],
    },
  },
};

export default nextConfig;
