import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/print-card/",
  server: {
    host: true,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Print Card A4",
        short_name: "Print Card A4",
        description: "Arrange front/back card images on an A4 sheet for printing.",
        start_url: "/print-card/",
        scope: "/print-card/",
        display: "standalone",
        background_color: "#eceef2",
        theme_color: "#126421",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,webmanifest}"],
      },
    }),
  ],
});
