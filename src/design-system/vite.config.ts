import { join } from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      formats: ['iife'],
      name: 'theme',
      entry: [join(__dirname, './utils/initializeTheme.critical.ts')],
    },
    copyPublicDir: true,
    minify: true,
    outDir: 'public',
    emptyOutDir: false,
  },
})
