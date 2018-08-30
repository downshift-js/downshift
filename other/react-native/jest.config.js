// const jestConfig = require('kcd-scripts/config').jest

module.exports = {
  preset: 'react-native',
  rootDir: '../../',
  roots: ['.'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  testMatch: ['<rootDir>/other/react-native/__tests__/**/*.js?(x)'],
}
