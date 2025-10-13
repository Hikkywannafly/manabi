import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isProduction = process.env.NODE_ENV === "production";

const withSerwist = withSerwistInit({
    // Note: This is only an example. If you use Pages Router,
    // use something else that works, such as "service-worker/index.ts".
    swSrc: "src/lib/sw.ts",
    swDest: "public/sw.js",
    disable: !isProduction,
});

const baseConfig = {
    // Your Next.js config
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

// Apply plugins in correct order: next-intl first, then Serwist (production only)
const nextConfig = isProduction
    ? withSerwist(withNextIntl(baseConfig))
    : withNextIntl(baseConfig);

export default nextConfig;