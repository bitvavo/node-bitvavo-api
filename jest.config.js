/** @type {import('jest').Config} */
const config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/test/*.spec.js'],

  testEnvironment: 'node', // Set the environment for Node.js
  collectCoverage: true, // Enable code coverage
  coverageDirectory: 'coverage', // Directory to save coverage reports
  collectCoverageFrom: [
    '!**/node_modules/**', // Exclude node_modules
    '!**/dist/**', // Exclude built files
    '!jest.config.js', // Exclude the config file
  ],
  coverageReporters: ['lcov'], // Specify formats for coverage reports
}

module.exports = config
