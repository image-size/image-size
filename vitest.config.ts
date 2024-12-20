import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['specs/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      exclude: ['specs/**/*.ts']
    }
  }
}) 