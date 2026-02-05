import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'sardonix-app';

const nextConfig: NextConfig = {
  output: "export", // Enables static HTML export for GitHub Pages
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure trailing slashes for direct linking on GH Pages if needed, usually safer
  trailingSlash: true,
};

export default nextConfig;
