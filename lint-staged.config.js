const baseConfig = require('kcd-scripts/config').lintStaged

module.exports = Object.assign(baseConfig, {
  linters: Object.assign(baseConfig.linters, {
    '*.md': 'doc',
  }),
})
