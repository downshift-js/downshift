const {createMacro, MacroError} = require('babel-plugin-macros')

module.exports = createMacro(({references, babel: {types: t, template}}) => {
  const usedReferences = Object.keys(references)

  if (usedReferences.length > 1 || usedReferences[0] !== 'default') {
    throw new MacroError(
      `${__filename} must be used as default import, instead you have used it as: ${usedReferences.join(
        ', ',
      )}.`,
    )
  }

  const tmpl = template(
    'process.env.NODE_ENV !== "production" ? DEV_VALUE : NUMBER',
    {placeholderPattern: /(DEV_VALUE)|(NUMBER)/},
  )

  references.default.forEach(({parentPath: ref}, index) => {
    if (!ref.isCallExpression()) {
      throw new Error(
        `${__filename} is supposed to be used as function call, isntead you have used it as ${
          ref.node.type
        }.`,
      )
    }
    ref.replaceWith(
      tmpl({DEV_VALUE: ref.node.arguments[0], NUMBER: t.numericLiteral(index)}),
    )
  })
})
