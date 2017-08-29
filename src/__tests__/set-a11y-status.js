beforeEach(() => {
  document.body.innerHTML = ''
})

test('sets the status', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello')
  expect(document.body.innerHTML.trim()).toMatchSnapshot()
})

test('repeat statuses get appended as children', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello')
  setA11yStatus('hello')
  setA11yStatus('hello')
  expect(document.body.innerHTML.trim()).toMatchSnapshot()
})

test('clears statuses when a change appears', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello')
  setA11yStatus('hello')
  setA11yStatus('hello')
  setA11yStatus('goodbye')
  expect(document.body.innerHTML.trim()).toMatchSnapshot()
})

test('does add anything for an empty string', () => {
  const setA11yStatus = setup()
  setA11yStatus('')
  expect(document.body.innerHTML.trim()).toMatchSnapshot()
})

function setup() {
  jest.resetModules()
  return require('../set-a11y-status').default
}
