import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },

      {
        protocol: "https",
        hostname: "sr12121.newzenler.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "image",
        pathname: "/example/**",
      },
    ],

    domains: [],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
