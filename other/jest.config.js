const jestConfig = require('kcd-scripts/config').jest

module.exports = Object.assign(jestConfig, {
  roots: ['.'],
  testEnvironment: 'jsdom',
})
