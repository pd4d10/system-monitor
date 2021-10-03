// @ts-check
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const prod = mode === 'production'
  // console.log(prod)

  return {
    base: '/dist',
    build: {
      watch: prod ? null : {},
      minify: prod,
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
  }
})
