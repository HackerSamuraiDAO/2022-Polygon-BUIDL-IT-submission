/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true,
    esmExternals: "loose",
    reactStrictMode: false,
  },
};

module.exports = nextConfig;
