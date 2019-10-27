const commonjs = require('rollup-plugin-commonjs')
const config = require('kcd-scripts/dist/config/rollup.config.js')

if (JSON.parse(process.env.BUILD_PREACT)) {
  config.input = 'src/index.preact.js'
}

const cjsPluginIndex = config.plugins.findIndex(
  plugin => plugin.name === 'commonjs',
)
config.plugins[cjsPluginIndex] = commonjs({
  include: 'node_modules/**',
  namedExports: {
    'react-is': ['isForwardRef'],
  },
})

module.exports = config
