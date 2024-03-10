/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    cacheOnFrontEndNav: true,
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === "development", // to disable pwa in development
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    reactStrictMode: true,
    output: "standalone",
    // ... other next.js config options
};

export default withSerwist(nextConfig);
