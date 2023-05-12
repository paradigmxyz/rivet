import webExtension from '@samrum/vite-plugin-web-extension'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { manifest } from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    webExtension({
      additionalInputs: {
        html: ['src/entries/tab/_app.html'],
        scripts: ['src/entries/inpage/index.ts'],
      },
      manifest,
    }),
  ],
})
