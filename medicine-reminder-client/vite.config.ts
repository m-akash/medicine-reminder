import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "icon.svg",
        "apple-touch-icon.png",
        "masked-icon.svg",
      ],
      manifest: {
        name: "Medicine Reminder",
        short_name: "MedReminder",
        description:
          "A comprehensive medicine reminder app to help you never miss your medications",
        theme_color: "#3b82f6",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["health", "medical", "productivity"],
        lang: "en",
        dir: "ltr",
        prefer_related_applications: false,
      },
      workbox: {
        // Add a fallback for SPA navigation.
        navigateFallback: "index.html",
        // Ensure that requests for assets (like images, css, js) are not redirected to index.html
        navigateFallbackDenylist: [/.*\.(js|css|svg|png|jpg|jpeg|ico|woff2)$/],
        globPatterns:
          mode === "development"
            ? []
            : ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              networkTimeoutSeconds: 10,
            },
          },
          // Optional: Add a caching strategy for images
          // {
          //   urlPattern: /\.(?:png|gif|jpg|jpeg|svg)$/,
          //   handler: 'CacheFirst',
          //   options: {
          //     cacheName: 'images',
          //     expiration: {
          //       maxEntries: 60,
          //       maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          //     },
          //   },
          // },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  build: {
    outDir: "dist",
  },
}));

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//     react(),
//     VitePWA({
//       registerType: "autoUpdate",
//       includeAssets: [
//         "favicon.ico",
//         "icon.svg",
//         "apple-touch-icon.png",
//         "masked-icon.svg",
//       ],
//       manifest: {
//         name: "Medicine Reminder",
//         short_name: "MedReminder",
//         description:
//           "A comprehensive medicine reminder app to help you never miss your medications",
//         theme_color: "#3b82f6",
//         background_color: "#ffffff",
//         display: "standalone",
//         orientation: "portrait",
//         scope: "/",
//         start_url: "/",
//         icons: [
//           {
//             src: "icon.svg",
//             sizes: "any",
//             type: "image/svg+xml",
//             purpose: "any",
//           },
//           {
//             src: "pwa-64x64.png",
//             sizes: "64x64",
//             type: "image/png",
//           },
//           {
//             src: "pwa-128x128.png",
//             sizes: "128x128",
//             type: "image/png",
//           },
//           {
//             src: "pwa-192x192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//           {
//             src: "pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//             purpose: "any maskable",
//           },
//         ],
//         categories: ["health", "medical", "productivity"],
//         lang: "en",
//         dir: "ltr",
//         prefer_related_applications: false,
//       },
//       // Custom service worker
//       workbox: {
//         runtimeCaching: [
//           {
//             urlPattern: ({ request }) => request.destination === "document",
//             handler: "NetworkFirst",
//             options: {
//               cacheName: "html-cache",
//             },
//           },
//           {
//             urlPattern: ({ request }) =>
//               ["style", "script", "worker"].includes(request.destination),
//             handler: "StaleWhileRevalidate",
//             options: {
//               cacheName: "asset-cache",
//             },
//           },
//           {
//             urlPattern: ({ request }) => request.destination === "image",
//             handler: "CacheFirst",
//             options: {
//               cacheName: "image-cache",
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
//               },
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   build: {
//     outDir: "dist",
//   },
// });
