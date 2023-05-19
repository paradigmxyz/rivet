import webExtension from '@samrum/vite-plugin-web-extension'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { getManifest } from './manifest.config'

const dev = process.env.NODE_ENV === 'development'

const outDir = dev ? 'dist/dev' : 'dist/build'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir
  },
  plugins: [
    react(),
    vanillaExtractPlugin(),
    webExtension({
      additionalInputs: {
        html: ['src/entries/tab/_app.html'],
        scripts: ['src/entries/inpage/index.ts'],
      },
      manifest: getManifest({ dev }),
    }),
  ],
})
