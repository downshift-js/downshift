const originalPreset = require('kcd-scripts/babel')
const customPreset = api => {
  api.cache(true)
  const evaluatedPreset = originalPreset(api)
  const plugins = [
    require.resolve('babel-plugin-dynamic-import-node'),
    ['no-side-effect-class-properties'],
    ['@babel/plugin-proposal-private-property-in-object', {loose: true}], // cypress warning because loose is false in preset-env
    ['@babel/plugin-proposal-private-methods', {loose: true}], // cypress warning because loose is false in preset-env
    ...evaluatedPreset.plugins,
  ]
  return {
    presets: evaluatedPreset.presets,
    plugins,
  }
}
module.exports = customPreset
