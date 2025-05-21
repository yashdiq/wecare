/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removing 'output: export' to allow server-side rendering
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Explicitly set environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://8.219.89.94:4200",
  },
};

module.exports = nextConfig;
