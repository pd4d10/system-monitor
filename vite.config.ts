import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest:{
      "manifest_version": 3,
      "name": "System Monitor",
      "version": "1.5.1",
      "description": "Monitor system status like CPU, memory, battery",
      "homepage_url": "https://github.com/pd4d10/system-monitor",
      "offline_enabled": true,
      "background": {
        "service_worker": "src/background.ts",
      },
      "permissions": ["system.cpu", "system.memory", "system.storage", "storage"],
      "action": {
        "default_popup": "popup.html"
      },
      "options_ui": {
        "page": "options.html"
      },
      "icons": {
        "128": "icon.png"
      }
    }
     }),
  ],
})
