const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const config = require('kcd-scripts/dist/config/rollup.config.js')
const babelPluginIndex = config.plugins.findIndex(
  plugin => plugin.name === 'babel',
)
const cjsPluginIndex = config.plugins.findIndex(
  plugin => plugin.name === 'commonjs',
)
config.plugins[babelPluginIndex] = babel({
  runtimeHelpers: true,
})
config.plugins[cjsPluginIndex] = commonjs({
  include: 'node_modules/**',
  namedExports: {
    'react-is': ['isForwardRef'],
  },
})
module.exports = config
