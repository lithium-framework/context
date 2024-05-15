export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@microsoft/fast-element)", // Ignorer tous les modules node_modules sauf @microsoft/fast-element
  ],
  reporters: [
    "default",
    ["@thesheps/jest-md-reporter",
    {
      "filename": "test-report.md",
      "publicPath": "./tests/reports"
    }]
  ]
};