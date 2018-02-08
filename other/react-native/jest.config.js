const jestConfig = require('kcd-scripts/config').jest

module.exports = Object.assign(jestConfig, {
  preset: 'react-native',
  testEnvironment: 'node',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!react-native)/'],
  rootDir: '../../',
  roots: ['.'],
  testMatch: ['<rootDir>/other/react-native/__tests__/**/*.js?(x)'],
})
