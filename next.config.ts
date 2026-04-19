import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    turbo: {
      root: path.join(__dirname),
    },
  },
};

export default nextConfig;
