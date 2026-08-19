import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export, so the build can be uploaded to Fasthosts exactly as
     the old site was. Verified: this emits real .html files at the
     original paths (/privacy.html, /cv.html), so existing links survive,
     and contact.php passes through untouched.

     To deploy to Vercel or any Node host instead, delete these two
     lines — that is the whole migration. See docs/DEPLOYMENT.md, which
     also covers the CSP consequence of exporting statically. */
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    // There is a stray package-lock.json in C:\Users\archi, outside this
    // repo. Without pinning the root, Turbopack walks up to it and warns
    // on every start.
    root: __dirname,
  },
};

export default nextConfig;
