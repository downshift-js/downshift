const npsUtils = require('nps-utils')

const series = npsUtils.series
const concurrent = npsUtils.concurrent
const rimraf = npsUtils.rimraf
const crossEnv = npsUtils.crossEnv
const commonTags = npsUtils.commonTags
const oneLine = commonTags.oneLine

module.exports = {
  scripts: {
    contributors: {
      add: {
        description: 'When new people contribute to the project, run this',
        script: 'all-contributors add',
      },
      generate: {
        description: 'Update the badge and contributors table',
        script: 'all-contributors generate',
      },
    },
    test: {
      default: crossEnv('NODE_ENV=test jest --coverage'),
      update: crossEnv('NODE_ENV=test jest --coverage --updateSnapshot'),
      watch: crossEnv('NODE_ENV=test jest --watch'),
      build: {
        description: 'validates the built files',
        script: 'babel-node other/build-test.js',
      },
    },
    build: {
      description: 'delete the dist directory and run all builds',
      default: series(
        rimraf('dist'),
        concurrent.nps('build.react', 'build.preact')
      ),
      react: getBuildFor('react'),
      preact: getBuildFor('preact'),
      andTest: series.nps('build', 'test.build'),
    },
    lint: {
      description: 'lint the entire project',
      script: 'eslint .',
    },
    validate: {
      description: oneLine`
        This runs several scripts to make sure things look
        good before committing or on clean install
      `,
      script: concurrent.nps('lint', 'build.andTest', 'test'),
    },
  },
  options: {
    silent: false,
  },
}

function getBuildFor(library) {
  return {
    default: {
      description: `run all ${library} builds in parallel`,
      script: concurrent.nps(
        `build.${library}.esm`,
        `build.${library}.cjs`,
        `build.${library}.umd.main`,
        `build.${library}.umd.min`
      ),
    },
    esm: {
      description: 'run the build with rollup (uses rollup.config.js)',
      script: `rollup --config --environment FORMAT:esm,LIBRARY:${library}`,
    },
    cjs: {
      description: 'run rollup build with CommonJS format',
      script: `rollup --config --environment FORMAT:cjs,LIBRARY:${library}`,
    },
    umd: {
      min: {
        description: 'run the rollup build with sourcemaps',
        script: `rollup --config --sourcemap --environment MINIFY,FORMAT:umd,LIBRARY:${library}`,
      },
      main: {
        description: 'builds the cjs and umd files',
        script: `rollup --config --sourcemap --environment FORMAT:umd,LIBRARY:${library}`,
      },
    },
  }
}

// this is not transpiled
/*
  eslint
  comma-dangle: [
    2,
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      functions: 'never'
    }
  ]
 */
