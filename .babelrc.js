const originalPreset = require('kcd-scripts/babel')
const customPreset = api => {
  api.cache(true)
  const evaluatedPreset = originalPreset(api)
  const plugins = [
    ['no-side-effect-class-properties'],
    ...evaluatedPreset.plugins,
  ]
  return {
    ...evaluatedPreset,
    plugins,
  }
}
module.exports = customPreset
