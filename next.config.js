const withPlugins = require('next-compose-plugins');

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  strictMode: true,
  images: {
    domains: [],
  },
};

module.exports = withPlugins([], nextConfig);
