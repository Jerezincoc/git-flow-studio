import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.split(path.sep).join("/");

          if (normalizedId.includes("/src/data/")) {
            return "data";
          }

          if (!normalizedId.includes("/node_modules/")) {
            return undefined;
          }

          if (
            normalizedId.includes("/node_modules/react/") ||
            normalizedId.includes("/node_modules/react-dom/") ||
            normalizedId.includes("/node_modules/react-router/") ||
            normalizedId.includes("/node_modules/react-router-dom/") ||
            normalizedId.includes("/node_modules/@remix-run/router/")
          ) {
            return "vendor";
          }

          if (
            normalizedId.includes("/node_modules/@radix-ui/") ||
            normalizedId.includes("/node_modules/framer-motion/") ||
            normalizedId.includes("/node_modules/class-variance-authority/") ||
            normalizedId.includes("/node_modules/clsx/") ||
            normalizedId.includes("/node_modules/cmdk/") ||
            normalizedId.includes("/node_modules/lucide-react/") ||
            normalizedId.includes("/node_modules/sonner/") ||
            normalizedId.includes("/node_modules/tailwind-merge/") ||
            normalizedId.includes("/node_modules/vaul/")
          ) {
            return "ui";
          }

          return undefined;
        },
      },
    },
  },
}));
