// this is here until/if this ever happens for real:
// https://github.com/kentcdodds/kcd-scripts/pull/28
const baseConfig = require('kcd-scripts/dist/config/rollup.config')

Object.assign(baseConfig, {
  output: [{...baseConfig.output[0], exports: 'named'}],
})

module.exports = baseConfig
