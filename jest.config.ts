import { pathsToModuleNameMapper } from 'ts-jest'
import { readFileSync } from 'node:fs'

const { compilerOptions } = JSON.parse(readFileSync('./tsconfig.json', 'utf-8'))

export default {
  moduleFileExtensions: ['ts', 'js', 'json'],

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  testRegex: '.*\\.spec\\.ts$',

  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
}
