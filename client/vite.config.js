import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://127.0.0.1:3000', // Change this to your backend's address
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // Change the origin of the request to the target URL
      },
    },
  },
})
