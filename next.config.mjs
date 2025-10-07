import withSerwistInit from "@serwist/next";

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
};

const nextConfig = isProduction ? withSerwist(baseConfig) : baseConfig;

export default nextConfig;