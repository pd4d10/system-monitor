import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: {
        manifest_version: 3,
        name: "System Monitor",
        version: pkg.version,
        description: "Monitor system status like CPU, memory, battery",
        homepage_url: "https://github.com/pd4d10/system-monitor",
        offline_enabled: true,
        background: {
          service_worker: "src/background.ts",
        },
        permissions: ["system.cpu", "system.memory", "system.storage", "storage"],
        action: {
          default_popup: "popup.html",
        },
        icons: {
          "128": "icon.png",
        },
      },
    }),
    viteStaticCopy({ targets: [{ src: "../LICENSE", dest: "." }] }),
  ],
});
