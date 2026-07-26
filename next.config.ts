import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // better-sqlite3 is a native module — don't bundle it
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
