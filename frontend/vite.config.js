import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // all fetches starting with '/api' will go to backend
      '/api': 'http://localhost:3000' // same port as backend
    }
  }
})

