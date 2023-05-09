const path = require("path");
const { alias } = require("react-app-rewire-alias");
const webpack = require("webpack");

module.exports = {
  webpack: (config) => {
    config.ignoreWarnings = [/Failed to parse source map/];

    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      stream: false,
      assert: false,
      https: false,
      util: path.resolve(__dirname, "node_modules/util"),
      os: false,
      url: false,
      http: false
    });
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"]
      })
    ]);
    config.resolve.fallback = fallback;

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
