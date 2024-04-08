import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginFonts } from "vite-plugin-fonts";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/Joe"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    svgr(),
    VitePluginFonts({
      google: {
        families: [
          {
            name: "Chakra Petch",
            styles:
              "ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700",
          },
          {
            name: "Inter",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
});
