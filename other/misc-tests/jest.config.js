const jestConfig = require('kcd-scripts/config').jest
const babelHelpersList = require('@babel/helpers').list

module.exports = Object.assign(jestConfig, {
  roots: ['.'],
  testEnvironment: 'jsdom',
  moduleNameMapper: babelHelpersList.reduce((aliasMap, helper) => {
    aliasMap[
      `@babel/runtime/helpers/esm/${helper}`
    ] = `@babel/runtime/helpers/${helper}`
    return aliasMap
  }, {}),
})
