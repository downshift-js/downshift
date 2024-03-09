jest.useFakeTimers()

beforeEach(() => {
  document.body.innerHTML = ''
})

test('sets the status', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello', document)
  expect(document.body.firstChild).toMatchSnapshot()
})

test('replaces the status with a different one', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello', document)
  setA11yStatus('goodbye', document)
  expect(document.body.firstChild).toMatchSnapshot()
})

test('does add anything for an empty string', () => {
  const setA11yStatus = setup()
  setA11yStatus('', document)
  expect(document.body).toBeEmptyDOMElement()
})

test('escapes HTML', () => {
  const setA11yStatus = setup()
  setA11yStatus('<script>alert("!!!")</script>', document)
  expect(document.body.firstChild).toMatchSnapshot()
})

test('performs cleanup after a timeout', () => {
  const setA11yStatus = setup()
  setA11yStatus('hello', document)
  jest.runAllTimers()
  expect(document.body.firstChild).toMatchSnapshot()
})

test('creates new status div if there is none', () => {
  const statusDiv = {setAttribute: jest.fn(), style: {}}
  const document = {
    getElementById: jest.fn(() => null),
    createElement: jest.fn().mockReturnValue(statusDiv),
    body: {
      appendChild: jest.fn(),
    },
  }

  const setA11yStatus = setup()
  setA11yStatus('hello', document)

  expect(document.getElementById).toHaveBeenCalledTimes(1)
  expect(document.getElementById).toHaveBeenCalledWith('a11y-status-message')
  expect(document.createElement).toHaveBeenCalledTimes(1)
  expect(document.createElement).toHaveBeenCalledWith('div')
  expect(statusDiv.setAttribute).toHaveBeenCalledTimes(4)
  expect(statusDiv.setAttribute.mock.calls).toMatchSnapshot()
  expect(statusDiv.style).toEqual({
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  })
  expect(document.body.appendChild).toHaveBeenCalledTimes(1)
  expect(document.body.appendChild).toHaveBeenCalledWith(statusDiv)
  // eslint-disable-next-line jest-dom/prefer-to-have-text-content
  expect(statusDiv.textContent).toEqual('hello')
})


test('creates no status div if there is no document', () => {
  const setA11yStatus = setup()
  setA11yStatus('<script>alert("!!!")</script>')
  expect(document.body).toBeEmptyDOMElement()
})

function setup() {
  jest.resetModules()
  return require('../set-a11y-status').setStatus
}
