const jestConfig = require('kcd-scripts/jest')

module.exports = Object.assign(jestConfig, {
  coveragePathIgnorePatterns: [
    ...jestConfig.coveragePathIgnorePatterns,
    '.macro.js$',
    '<rootDir>/src/stateChangeTypes.js',
  ],
  setupFilesAfterEnv: ['@testing-library/react/cleanup-after-each'],
})
