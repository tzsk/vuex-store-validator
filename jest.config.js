// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: [
    './src/**/*.js',
    '!./**/*.{test,spec}.js',
    '!./dist/**/*.js',
  ],

  coverageDirectory: 'coverage',

  testEnvironment: 'jsdom',

  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],

  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
