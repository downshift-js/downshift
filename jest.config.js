const jestConfig = require('kcd-scripts/jest')

jestConfig.snapshotSerializers = jestConfig.snapshotSerializers || []
jestConfig.snapshotSerializers.push(
  'jest-serializer-html',
  'enzyme-to-json/serializer',
)
jestConfig.setupFiles = jestConfig.setupFiles || []
jestConfig.setupFiles.push('<rootDir>/other/setup-tests.js')

module.exports = jestConfig
