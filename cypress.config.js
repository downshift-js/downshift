const webpackPreprocessor = require('@cypress/webpack-preprocessor')

const {defineConfig} = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:6006',
    video: false,
    setupNodeEvents(on) {
      on('file:preprocessor', webpackPreprocessor())
    },
  },
})
