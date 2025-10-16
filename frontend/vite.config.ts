import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port
    host: 'localhost',
    proxy: {
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/auctions': {
        target: 'http://localhost:4000',
        changeOrigin: true
      },
      '/bids': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
})
