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

import esImport, {
  useCombobox as useComboboxEsImport,
  useSelect as useSelectEsImport,
  useMultipleSelection as useMultipleSelectionEsImport,
} from '../../../dist/downshift.esm.mjs'

import cjsImport, {
  useCombobox as useComboboxCjsImport,
  useSelect as useSelectCjsImport,
  useMultipleSelection as useMultipleSelectionCjsImport,
} from '../../../' // picks up the main from package.json

import umdImport, {
  useCombobox as useComboboxUmdImport,
  useSelect as useSelectUmdImport,
  useMultipleSelection as useMultipleSelectionUmdImport,
} from '../../../dist/downshift.umd'

import rnImport, {
  useCombobox as useComboboxRnImport,
  useSelect as useSelectRnImport,
  useMultipleSelection as useMultipleSelectionRnImport,
} from '../../../dist/downshift.native.cjs.cjs'

import rnWebImport, {
  useCombobox as useComboboxRnWebImport,
  useSelect as useSelectRnWebImport,
  useMultipleSelection as useMultipleSelectionRnWebImport,
} from '../../../dist/downshift.nativeweb.cjs.cjs'

// intentionally left out because you shouldn't ever
// try to require the ES file in CommonJS
// const esRequire = require('../../../dist/downshift.es')
const cjsRequire = require('../../../') // picks up the main from package.json
const umdRequire = require('../../../dist/downshift.umd')
const rnCjsRequire = require('../../../dist/downshift.native.cjs.cjs')
const rnWebCjsRequire = require('../../../dist/downshift.nativeweb.cjs.cjs')

test('downshift component is imported', () => {
  assert(
    isDownshiftComponent(esImport),
    'ES build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(cjsImport),
    'CJS build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(cjsRequire.default),
    'CJS build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(umdImport),
    'UMD build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(umdRequire.default),
    'UMD build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(rnImport),
    'React Native build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnCjsRequire.default),
    'React Native build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(rnWebImport),
    'React Native Web build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnWebCjsRequire.default),
    'React Native Web build has a problem with CJS',
  )

  // TODO: how could we validate the global export?
})

test('useSelect hook is imported', () => {
  assert(
    isDownshiftComponent(useSelectEsImport),
    'ES build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(useSelectCjsImport),
    'CJS build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(cjsRequire.useSelect),
    'CJS build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useSelectUmdImport),
    'UMD build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(umdRequire.useSelect),
    'UMD build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useSelectRnImport),
    'React Native build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnCjsRequire.useSelect),
    'React Native build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useSelectRnWebImport),
    'React Native Web build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnWebCjsRequire.useSelect),
    'React Native Web build has a problem with CJS',
  )
})

test('useCombobox hook is imported', () => {
  assert(
    isDownshiftComponent(useComboboxEsImport),
    'ES build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(useComboboxCjsImport),
    'CJS build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(cjsRequire.useCombobox),
    'CJS build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useComboboxUmdImport),
    'UMD build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(umdRequire.useCombobox),
    'UMD build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useComboboxRnImport),
    'React Native build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnCjsRequire.useCombobox),
    'React Native build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useComboboxRnWebImport),
    'React Native Web build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnWebCjsRequire.useCombobox),
    'React Native Web build has a problem with CJS',
  )
})

test('useMultipleSelection hook is imported', () => {
  assert(
    isDownshiftComponent(useMultipleSelectionEsImport),
    'ES build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(useMultipleSelectionCjsImport),
    'CJS build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(cjsRequire.useMultipleSelection),
    'CJS build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useMultipleSelectionUmdImport),
    'UMD build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(umdRequire.useMultipleSelection),
    'UMD build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useMultipleSelectionRnImport),
    'React Native build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnCjsRequire.useMultipleSelection),
    'React Native build has a problem with CJS',
  )

  assert(
    isDownshiftComponent(useMultipleSelectionRnWebImport),
    'React Native Web build has a problem with ES Modules',
  )

  assert(
    isDownshiftComponent(rnWebCjsRequire.useMultipleSelection),
    'React Native Web build has a problem with CJS',
  )
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
