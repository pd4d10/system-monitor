// @ts-check
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/dist',
  build: {
    rollupOptions: {
      input: {
        background: './background.html',
        popup: './popup.html',
        options: './options.html',
      },
      output: {
        entryFileNames: '[name].js',
        dir: 'chrome/dist',
      },
    },
    sourcemap: 'inline',
  },
})
