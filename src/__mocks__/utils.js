const actualUtils = require.requireActual('../utils')
module.exports = Object.assign(actualUtils, {
  scrollIntoView: jest.fn(), // hard to write tests for this thing...
})
