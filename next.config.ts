import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Vercel injects these server-side only. Metadata is built on the server so
    // it would work regardless, but exposing them keeps `siteUrl` correct if it
    // is ever read from a Client Component.
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
      process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "",
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL ?? "",
  },
};

export default nextConfig;
