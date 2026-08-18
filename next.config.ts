import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // There is a stray package-lock.json in C:\Users\archi, outside this
    // repo. Without pinning the root, Turbopack walks up to it and warns
    // on every start.
    root: __dirname,
  },
};

export default nextConfig;
