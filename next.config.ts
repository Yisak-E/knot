import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Notes in /content are read from disk at request time, so make sure
  // Vercel bundles them with every server function.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
