const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

// eslint-disable-next-line
module.exports = function () {
  return {
    name: 'custom-docusaurus-webpack-config-plugin',
    configureWebpack() {
      return {
        resolve: {
          fallback: {
            fs: false,
            module: false,
          },
        },
        plugins: [new NodePolyfillPlugin()],
      }
    },
  }
}
