import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const sha = (process.env.GIT_SHA || 'dev').slice(0, 7)

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    __APP_SHA__: JSON.stringify(sha),
  },
})
