import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    bin: resolve(__dirname, 'node_modules/vite/bin/vite.js'),
    rollupOptions: {
      define: {
        'import.meta.env.VITE_API_URL': JSON.stringify('https://flower-garden-m5vg.onrender.com')
      }
    }
  }
})
