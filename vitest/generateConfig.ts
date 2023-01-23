import { CoverageIstanbulOptions, VitestEnvironment } from 'vitest'
import { defineConfig } from 'vitest/config'

export const config = {
  test: {
    testTimeout: 10000,
    globals: true,
    setupFiles: `${__dirname}/vitest.setup.js`,
    deps: {
      interopDefault: true,
    },
    coverage: {
      all: true,
      provider: 'istanbul',
      enabled: true,
      include: ['**/src/**/*.ts', '**/src/**/*.tsx'],
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    } as CoverageIstanbulOptions,
  },
}

type Config = {
  coverageReportPath: string
  environment?: VitestEnvironment
  coverageExclude?: string[]
}

export const generateConfig = ({ coverageReportPath, environment = 'node', coverageExclude = [] }: Config) =>
  defineConfig({
    ...config,
    test: {
      reporters: ['default', 'junit'],
      outputFile: `./reports/${coverageReportPath}.xml`,
      environment,
      ...config.test,
      coverage: { ...config.test.coverage, reportsDirectory: `../../../coverage/${coverageReportPath}`, exclude: coverageExclude },
    },
  })
