// const jestConfig = require('kcd-scripts/config').jest

module.exports = {
  preset: 'react-native',
  rootDir: '../../',
  roots: ['.'],
  testMatch: ['<rootDir>/other/react-native/__tests__/**/*.js?(x)'],
}
