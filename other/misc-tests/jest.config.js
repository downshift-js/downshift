const jestConfig = require('kcd-scripts/config').jest
const babelHelpersList = require('@babel/helpers').list

module.exports = Object.assign(jestConfig, {
  roots: ['.'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs)$': ['babel-jest', { rootMode: 'upward' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(dedent|@testing-library/preact)/)',
  ],
  moduleNameMapper: babelHelpersList.reduce(
    (aliasMap, helper) => {
      aliasMap[`@babel/runtime/helpers/esm/${helper}`] =
        `@babel/runtime/helpers/${helper}`
      return aliasMap
    },
    {
      '^preact(/(.*)|$)': 'preact$1',
    },
  ),
})
