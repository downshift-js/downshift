import fs from 'fs'
import alias from 'rollup-plugin-alias'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

// import replace from 'rollup-plugin-replace'

// * library & peerDeps stuff
// build for both preact and react
const library = process.env.LIBRARY === 'preact' ? 'preact' : 'react'

// get peer dependencies
const peerDeps = Object.keys(pkg.peerDependencies || {})

// some peer dependancy checking
// if React or Preact as an instance are not in peerDependencies throw this error
if (library && peerDeps.indexOf(library) < 0) {
  throw new Error('🚫 Please include your library as peer dependency')
}

// * Babel stuff Ideally ready from babelrc. this is a WIP will use .baberc later
// const babelrc = JSON.parse(fs.readFileSync('.babelrc'))

const preactBabelPlugins = [
  'transform-class-properties',
  ['transform-react-jsx', {pragma: 'h'}],
  'external-helpers',
]
const reactBabelPlugins = [
  'transform-class-properties',
  ['transform-react-jsx'],
  'external-helpers',
]

export default {
  entry: 'src/index.js',
  sourceMap: true,
  dest: pkg.browser,
  format: 'umd',
  moduleName: pkg.name,
  external: ['dom-scroll-into-view', 'react'],
  plugins: [
    alias(
      library === 'preact' ?
        {
          react: `${__dirname}/src/compat/compat-lite.js`,
          'prop-types': `${__dirname}/src/compat/prop-types.js`,
        } :
        {},
    ),
    resolve(),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/process-es6/**'],
      namedExports: {
        'node_modules/react/react.js': [
          'Children',
          'Component',
          'PropTypes',
          'createElement',
        ],
        'node_modules/react-dom/index.js': ['render'],
      },
    }),
    babel({
      babelrc: false,
      exclude: ['node_modules/**', '*.json'],
      presets: [['es2015', {modules: false}], 'stage-0', 'react'],
      plugins: library === 'preact' ? preactBabelPlugins : reactBabelPlugins,
    }),
  ],
}
