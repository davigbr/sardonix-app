import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static HTML export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure trailing slashes for direct linking on GH Pages if needed, usually safer
  trailingSlash: true,
};

export default nextConfig;
