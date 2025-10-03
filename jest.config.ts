/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';
import {pathsToModuleNameMapper} from "ts-jest";
import fs from "fs";
const tsconfig = JSON.parse(fs.readFileSync("./tsconfig.json", "utf-8"));
const { compilerOptions } = tsconfig;

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: `<rootDir>${compilerOptions.baseUrl}` }),
    '^chalk$': '<rootDir>/tests/mocks/chalk.mock.ts',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "node_modules",
    'config'
  ],
  verbose: true,
};

export default config;
