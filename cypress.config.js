const {defineConfig} = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:6006',
    video: false,
  },
})
