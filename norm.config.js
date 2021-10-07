// @ts-check
const { defineConfig } = require('@norm/cli')

module.exports = defineConfig({
  mode: 'web-extension',
  manifest: {
    manifest_version: 2,
    name: 'System Monitor',
    version: '1.5.1',
    description: 'Monitor system status like CPU, memory, battery',
    homepage_url: 'https://github.com/pd4d10/system-monitor',
    offline_enabled: true,
    background: {
      page: 'background.html',
    },
    permissions: ['system.cpu', 'system.memory', 'system.storage', 'storage'],
    browser_action: {
      default_popup: 'popup.html',
    },
    options_ui: {
      page: 'options.html',
      chrome_style: true,
    },
    icons: {
      128: 'icon.png',
    },
  },
})
