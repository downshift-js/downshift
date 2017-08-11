/*
 * This file is here to validate that the built version
 * of the library exposes the module in the way that we
 * want it to. Specifically that the ES6 module import can
 * get the downshift function via default import. Also that
 * the CommonJS require returns the downshift function
 * (rather than an object that has the downshift as a
 * `default` property).
 *
 * This file is unable to validate the global export.
 */
import assert from 'assert'

import esImport from '../dist/downshift.es'

import cjsImport from '../' // picks up the main from package.json

import umdImport from '../dist/downshift.umd'

// intentionally left out because you shouldn't ever
// try to require the ES file in CommonJS
// const esRequire = require('../dist/downshift.es')
const cjsRequire = require('../') // picks up the main from package.json
const umdRequire = require('../dist/downshift.umd')

test('stuff is good', () => {
  assert(
    isDownshiftComponent(esImport),
    'ES build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(cjsImport),
    'CJS build has a problem with ES Modules',
  )

  assert(isDownshiftComponent(cjsRequire), 'CJS build has a problem with CJS')

  assert(
    isDownshiftComponent(umdImport),
    'UMD build has a problem with ES Modules',
  )

  assert(isDownshiftComponent(umdRequire), 'UMD build has a problem with CJS')

  // TODO: how could we validate the global export?
})

function isDownshiftComponent(thing) {
  if (typeof thing !== 'function') {
    console.error(
      `downshift thing should be a function. It's a ${typeof thing} with the properties of: ${Object.keys(
        thing,
      ).join(', ')}`,
    )
    return false
  }
  return true
}

/*
 eslint
  no-console: 0,
  import/extensions: 0,
  import/no-unresolved: 0,
  import/no-duplicates: 0,
  no-duplicate-imports: 0,
 */
