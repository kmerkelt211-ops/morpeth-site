import type { NextConfig } from "next";
import { EXTERNAL_GALLERY_URL } from "./lib/siteLinks";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
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
