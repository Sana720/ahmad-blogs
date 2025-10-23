import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

// Configure the bundle analyzer to also emit a machine-readable JSON stats file
// when ANALYZE=true. This lets us parse the analysis programmatically instead
// of relying on the interactive viewer HTML.
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  // generate a machine-readable JSON stats file instead of the interactive
  // HTML viewer. This produces a <bundle>.stats.json we can parse.
  analyzerMode: 'json',
  // do not automatically open the interactive analyzer UI during CI
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withAnalyzer(nextConfig);
