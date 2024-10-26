/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  // The test environment that will be used for testing
  testEnvironment: "jsdom",
  coverageProvider: "v8",
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // "^auth$": "<rootDir>/auth",
    // "^@auth/prisma-adapter$": "<rootDir>/node_modules/@auth/prisma-adapter",
    // "^next-auth/react$": "<rootDir>/node_modules/next-auth/react",
  },

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  /*
    Activate collectCoverage
    Deactivate for better test performance
    (npm run test:coverage for collecting coverage)
   */
  collectCoverage: false,
  // A List of paths to files that should be covered by the coverage reporter
  collectCoverageFrom: ["src/app/**/*.{js,jsx,ts,tsx}", "src/components/**/*.{js,jsx,ts,tsx}", "!src/app/api/**/*", "!src/components/ui/**/*"],
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // An array of regexp pattern strings used to skip coverage collection
  coverageReporters: ["json", "text", "lcov"],

  // Activate clearMocks for clearing all mocks before each test
  clearMocks: true,

  // Activate transform for ts-jest
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Activate cacheDirectory for saving cache files (npm run test:clear for clearing cache)
  cacheDirectory: "<rootDir>/.jest/cache",
};

export default createJestConfig(config);
