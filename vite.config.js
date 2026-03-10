import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Para GitHub Pages, altere para o nome do seu repositório
  // Ex: base: '/study-tracker/'
  base: process.env.GITHUB_ACTIONS ? '/study-tracker/' : '/',
})
