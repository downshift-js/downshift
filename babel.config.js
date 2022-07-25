const originalPreset = require('kcd-scripts/babel')
const customPreset = api => {
  api.cache(true)
  const evaluatedPreset = originalPreset(api)
  const plugins = [
    require.resolve('babel-plugin-dynamic-import-node'),
    ['no-side-effect-class-properties'],
    ...evaluatedPreset.plugins,
  ]
  return {
    presets: evaluatedPreset.presets,
    plugins,
  }
}
module.exports = customPreset
