import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages serves the site from /notifications-modal/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/notifications-modal/' : '/',
  plugins: [vue()],
}))
