const path = require('path')

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.js(\?[^?]*)?$/,
      loader: 'babel-loader',
      include: [path.join(__dirname, '../src')],
      options: {cacheDirectory: false, babelrc: true},
    })

    // this is useful if you want to see the transpiled
    // version of the code (like if you're working on the
    // babel plugin or something).
    // config.devtool = 'eval'

    return config
  },
}
