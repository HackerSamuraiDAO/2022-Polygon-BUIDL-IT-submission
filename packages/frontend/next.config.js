/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")(["wrld-react"]);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true,
    esmExternals: "loose",
  },
  webpack: (config) => {
    config.optimization.providedExports = true;
    return config;
  },
};

module.exports = withTM(nextConfig);
