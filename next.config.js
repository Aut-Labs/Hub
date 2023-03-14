const withPlugins = require("next-compose-plugins");

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  strictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudflare-ipfs.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withPlugins([], nextConfig);
