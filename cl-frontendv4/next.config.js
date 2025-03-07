/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { dev }) {
      if (dev) {
        config.devtool = "source-map"; // Enables source maps in development mode
      }
      return config;
    },
  };
  
  module.exports = nextConfig;