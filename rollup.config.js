const commonjs = require('rollup-plugin-commonjs')
const config = require('kcd-scripts/dist/config/rollup.config.js')

const cjsPluginIndex = config.plugins.findIndex(
  plugin => plugin.name === 'commonjs',
)
config.plugins[cjsPluginIndex] = commonjs({
  include: 'node_modules/**',
  namedExports: {
    'react-is': ['isForwardRef'],
    react: ['useReducer', 'useEffect', 'useRef', 'useState'],
    'node_modules/keyboard-key/src/keyboardKey.js': ['getKey'],
    'prop-types': [
      'func',
      'string',
      'any',
      'bool',
      'number',
      'array',
      'checkPropTypes',
      'shape',
    ],
  },
})

module.exports = config
