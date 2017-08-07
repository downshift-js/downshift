const isPreact = process.env.LIBRARY === 'preact'
const isRollup = process.env.ROLLUP_BUILD

module.exports = {
  presets: [['env', isRollup ? {modules: false} : {}], 'react'],
  plugins: [
    isRollup ? 'external-helpers' : null,
    // we're actually not using JSX at all, but I'm leaving this
    // in here just in case we ever do (this would be easy to miss).
    isPreact ? ['transform-react-jsx', {pragma: 'h'}] : null,
    'transform-inline-environment-variables',
    'transform-class-properties',
    'transform-object-rest-spread',
  ].filter(Boolean),
}
