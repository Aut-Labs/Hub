const withPlugins = require("next-compose-plugins");

module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(process.env.NEXT_PUBLIC_IPFS_URL).hostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
};
