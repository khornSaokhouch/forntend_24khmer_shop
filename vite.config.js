import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Ensures Vue Router history mode works on refresh
    historyApiFallback: true,
    host: "::",
    port: 5173,
  },
});
