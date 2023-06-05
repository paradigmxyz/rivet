import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { outDir } from './vite.config'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    modulePreload: false,
    outDir,
    rollupOptions: {
      input: {
        inpage: 'src/entries/inpage/index.ts',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      },
    },
  },
  plugins: [tsconfigPaths()],
})
