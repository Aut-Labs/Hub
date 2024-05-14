const path = require("path");
const { alias } = require("react-app-rewire-alias");
const webpack = require("webpack");

module.exports = {
  webpack: (config) => {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      crypto: false,
      stream: false,
      assert: false,
      http: false,
      https: false,
      os: false,
      url: false,
      zlib: false
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"]
      })
    ]);
    config.ignoreWarnings = [/Failed to parse source map/];
    config.module.rules.push({
      test: /\.(js|mjs|jsx)$/,
      enforce: "pre",
      loader: require.resolve("source-map-loader"),
      resolve: {
        fullySpecified: false
      }
    });

    const modifiedConfig = alias({
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@auth": path.resolve(__dirname, "./src/auth"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@store": path.resolve(__dirname, "./src/redux"),
      "@theme": path.resolve(__dirname, "./src/theme"),
      "@components": path.resolve(__dirname, "./src/components")
    })(config);

    return modifiedConfig;
  }
};
