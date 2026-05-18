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
        module: {
          rules: [
            // Some dependencies ship ESM that does directory-style imports
            // (e.g. yaml's browser dist importing 'buffer'). Webpack 5 strict
            // ESM resolution requires fully specified paths, so relax it.
            {
              test: /\.m?js$/,
              resolve: {fullySpecified: false},
            },
          ],
        },
        plugins: [new NodePolyfillPlugin()],
      }
    },
  }
}
