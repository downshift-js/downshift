// This is separate because the test environment is set via the config
// and we want most of our tests to run with jsdom, but we still want
// to make sure that the server rendering use case continues to work.
const jestConfig = require('kcd-scripts/config').jest

module.exports = Object.assign(jestConfig, {
  roots: ['.'],
  testEnvironment: 'node',
})
