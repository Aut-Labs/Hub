import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import eslint from "vite-plugin-eslint";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    svgrPlugin(),
    eslint()
  ],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@auth": path.resolve(__dirname, "./src/auth"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@store": path.resolve(__dirname, "./src/redux"),
      "@theme": path.resolve(__dirname, "./src/theme"),
      "@components": path.resolve(__dirname, "./src/components")
    }
  },
  build: {
    outDir: "build"
  },
  server: {
    port: 3000
  }
});
