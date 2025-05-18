/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removing 'output: export' to allow server-side rendering
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
