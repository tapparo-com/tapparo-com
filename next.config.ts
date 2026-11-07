import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Middleware combines case and trailing-slash normalization in one redirect.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
