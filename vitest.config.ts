// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'

export default defineVitestConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
})
