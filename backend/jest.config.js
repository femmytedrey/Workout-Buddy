module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  coverageDirectory: 'coverage',
  testTimeout: 30000,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    'routes/**/*.js',
    '!node_modules/**',
    '!tests/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/'
  ],
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 10,
      functions: 15,
      lines: 30
    }
  }
};