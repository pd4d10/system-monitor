import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    crx({
      manifest: {
        manifest_version: 3,
        name: "Memory Monitor",
        version: pkg.version,
        description: "Monitor memory status at location bar",
        homepage_url: "https://github.com/pd4d10/system-monitor",
        offline_enabled: true,
        background: {
          service_worker: "src/background.ts",
        },
        action: {},
        permissions: ["system.memory"],
        icons: {
          "128": "icon.png",
        },
      },
    }),
  ],
});
