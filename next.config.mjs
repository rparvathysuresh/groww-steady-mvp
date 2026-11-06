import './scripts/patch-fs.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./evals/**/*'],
    },
  },
};

export default nextConfig;

