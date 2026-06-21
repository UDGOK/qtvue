import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['test/unit/**/*.spec.ts'],
    setupFiles: ['test/unit/setup.ts'],
  },
  resolve: {
    alias: {
      // Nuxt 4 uses app/ as srcDir, so '~' and '@' resolve there
      '~': fileURLToPath(new URL('./app/', import.meta.url)),
      '@': fileURLToPath(new URL('./app/', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '@@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
