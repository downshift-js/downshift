const {createMacro, MacroError} = require('babel-plugin-macros')

const importToEnvVar = {
  isPreact: 'BUILD_PREACT',
  isReactNative: 'BUILD_REACT_NATIVE',
}

const arrToStr = arr => arr.join(', ')

module.exports = createMacro(({references, babel: {types: t}}) => {
  const usedReferences = Object.keys(references)
  const allowedReferences = Object.keys(importToEnvVar)

  if (usedReferences.filter(ref => !importToEnvVar[ref]).length !== 0) {
    throw new MacroError(
      `${__filename} handles only those named exports: ${arrToStr(
        allowedReferences,
      )}, you have tried to use it with: ${arrToStr(usedReferences)}.`,
    )
  }

  usedReferences.forEach(refName => {
    const envVar = importToEnvVar[refName]

    references[refName].forEach(usedRef => {
      const envValue = process.env[envVar]
      usedRef.replaceWith(
        t.booleanLiteral((envValue && envValue !== 'false') || false),
      )
    })
  })
})
