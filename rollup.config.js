import alias from 'rollup-plugin-alias'
import rollupBabel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import uglify from 'rollup-plugin-uglify'

process.env.ROLLUP_BUILD = true
const minify = process.env.MINIFY
const format = process.env.FORMAT
const library = process.env.LIBRARY === 'react' ? '' : `.${process.env.LIBRARY}`
const isPreact = process.env.LIBRARY === 'preact'
const esm = format === 'esm'
const umd = format === 'umd'
const cjs = format === 'cjs'

let targets

if (esm) {
  targets = [{dest: `dist/downshift${library}.es.js`, format: 'es'}]
} else if (umd) {
  if (minify) {
    targets = [{dest: `dist/downshift${library}.umd.min.js`, format: 'umd'}]
  } else {
    targets = [{dest: `dist/downshift${library}.umd.js`, format: 'umd'}]
  }
} else if (cjs) {
  targets = [{dest: `dist/downshift${library}.cjs.js`, format: 'cjs'}]
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

export default {
  entry: 'src/index.js',
  targets,
  exports: esm ? 'named' : 'default',
  moduleName: 'Downshift',
  format,
  external: isPreact ? ['preact', 'prop-types'] : ['react', 'prop-types'],
  globals: isPreact ?
    {
      react: 'preact',
    } :
    {
      react: 'React',
      'prop-types': 'PropTypes',
    },
  plugins: [
    alias(isPreact ? {react: 'preact'} : {}),
    nodeResolve({jsnext: true, main: true}),
    commonjs({include: 'node_modules/**'}),
    json(),
    rollupBabel({exclude: 'node_modules/**'}),
    minify ? uglify() : null,
  ].filter(Boolean),
}

// this is not transpiled
/*
  eslint
  max-len: 0,
  comma-dangle: [
    2,
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      functions: 'never'
    }
  ]
 */
