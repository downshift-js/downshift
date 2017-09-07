const jestConfig = require('kcd-scripts/config').jest

jestConfig.snapshotSerializers = jestConfig.snapshotSerializers || []
jestConfig.snapshotSerializers.push(
  'jest-serializer-html',
  'enzyme-to-json/serializer',
)

module.exports = jestConfig
