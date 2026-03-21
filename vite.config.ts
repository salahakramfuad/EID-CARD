import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Lets `<img crossOrigin="anonymous">` load `/bg*.png` for canvas / html-to-image on dev.
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
})

