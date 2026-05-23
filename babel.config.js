const originalPreset = require('kcd-scripts/babel')
const customPreset = api => {
  // Docusaurus discovers this root babel.config.js (via getCustomBabelConfigFilePath)
  // and passes it as configFile to its babel-loader, replacing its own preset.
  // The kcd-scripts preset uses the classic JSX runtime, which breaks Docusaurus
  // internals (e.g. TitleFormatterProvider) that import only named members from
  // 'react' (no default React import). Defer to Docusaurus's own babel preset
  // when invoked by Docusaurus (caller.name is 'client' or 'server').
  const callerName = api.caller(caller => caller && caller.name)
  if (callerName === 'client' || callerName === 'server') {
    api.cache.using(() => callerName)
    return {
      presets: [require.resolve('@docusaurus/babel/preset')],
      plugins: [require.resolve('babel-plugin-macros')],
    }
  }
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
