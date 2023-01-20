import { defineConfig } from 'vitest/config'

export const config = {
  test: {
    testTimeout: 10000,
    globals: true,
    deps: {
      interopDefault: true,
    },
  },
}

export default defineConfig(config)
