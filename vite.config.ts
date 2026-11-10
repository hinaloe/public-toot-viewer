import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/',
  publicDir: './static',
  build: {
    outDir: './dist',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globalSetup: './vitest.global-setup.ts',
  },
})
