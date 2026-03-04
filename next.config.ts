import type { NextConfig } from "next";
import { EXTERNAL_GALLERY_URL } from "./lib/siteLinks";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/gallery/:path*",
        destination: EXTERNAL_GALLERY_URL,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
