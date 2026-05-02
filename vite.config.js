import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'

const sha = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    __APP_SHA__: JSON.stringify(sha),
  },
})
