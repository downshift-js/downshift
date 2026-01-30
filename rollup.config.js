const commonjs = require('@rollup/plugin-commonjs')
const {babel} = require('@rollup/plugin-babel')
const config = require('kcd-scripts/dist/config/rollup.config')

const babelPlugin = babel({
  babelHelpers: 'runtime',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  exclude: '**/node_modules/**',
})
const cjsPlugin = commonjs({include: 'node_modules/**'})

config.plugins = [
  babelPlugin,
  cjsPlugin,
  ...config.plugins.filter(
    p => !['babel', 'typescript', 'commonjs'].includes(p.name),
  ),
]

const prevExternal = config.external
config.external = id => {
  if (id.includes('productionEnum.macro') || id.includes('is.macro')) {
    return true
  }
  if (typeof prevExternal === 'function') return prevExternal(id)
  if (Array.isArray(prevExternal)) return prevExternal.includes(id)
  return false
}

module.exports = config
