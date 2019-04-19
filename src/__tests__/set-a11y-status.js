jest.useFakeTimers()

beforeEach(() => {
  document.body.innerHTML = ''
})

test('sets the status', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello')
  expect(document.body.firstChild).toMatchSnapshot()
})

test('replaces the status with a different one', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello')
  setA11yStatus('goodbye')
  expect(document.body.firstChild).toMatchSnapshot()
})

test('does add anything for an empty string', () => {
  const setA11yStatus = setup()
  setA11yStatus('')
  expect(document.body.firstChild).toMatchSnapshot()
})

test('escapes HTML', () => {
  const setA11yStatus = setup()
  setA11yStatus('<script>alert("!!!")</script>')
  expect(document.body.firstChild).toMatchSnapshot()
})

test('performs cleanup after a timeout', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello')
  jest.runAllTimers()
  expect(document.body.firstChild).toMatchSnapshot()
})

function setup() {
  jest.resetModules()
  return require('../set-a11y-status').default
}
