import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  build: {
    target: 'es2022',
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
})
