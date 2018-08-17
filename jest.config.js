const jestConfig = require('kcd-scripts/config').jest

module.exports = Object.assign(jestConfig, {
  coveragePathIgnorePatterns: [
    ...jestConfig.coveragePathIgnorePatterns,
    '.macro.js$',
    '<rootDir>/src/stateChangeTypes.js',
  ],
})
