import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from '@samrum/vite-plugin-web-extension'

import { manifest } from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      additionalInputs: {
        html: ['./src/entries/tab/_app.html'],
      },
      manifest,
    }),
  ],
})
