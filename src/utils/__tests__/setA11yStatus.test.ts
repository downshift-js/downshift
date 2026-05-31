import {setStatus} from '../setA11yStatus'

test('setStatus does not set status if document is undefined', () => {
  setStatus('test status', undefined)
  expect(document.getElementById('a11y-status-message')).toBeNull()
})

test('setStatus does not set status if status is empty', () => {
  setStatus('', document)
  expect(document.getElementById('a11y-status-message')).toBeNull()
})

test('setStatus sets status correctly', () => {
  setStatus('test status', document)
  const statusDiv = document.getElementById('a11y-status-message')
  expect(statusDiv).not.toBeNull()
  expect(statusDiv?.textContent).toBe('test status')
})

test('setStatus updates status correctly', () => {
  setStatus('initial status', document)
  setStatus('updated status', document)
  const statusDiv = document.getElementById('a11y-status-message')
  expect(statusDiv).not.toBeNull()
  expect(statusDiv?.textContent).toBe('updated status')
})

test('setStatus cleans up status after delay', () => {
  jest.useFakeTimers()
  setStatus('temporary status', document)
  const statusDiv = document.getElementById('a11y-status-message')
  expect(statusDiv).not.toBeNull()
  expect(statusDiv?.textContent).toBe('temporary status')

  jest.advanceTimersByTime(600) // Wait longer than the debounce delay to ensure cleanup has occurred
  expect(statusDiv?.textContent).toBe('')
  jest.useRealTimers()
})

test('status div has the correct attributes', () => {
  setStatus('attribute test', document)
  const statusDiv = document.getElementById('a11y-status-message')
  expect(statusDiv).not.toBeNull()
  expect(statusDiv?.getAttribute('role')).toBe('status')
  expect(statusDiv?.getAttribute('aria-live')).toBe('polite')
  expect(statusDiv?.getAttribute('aria-relevant')).toBe('additions text')
  expect(document.body.contains(statusDiv)).toBe(true)
  expect(statusDiv?.style.border).toBe('0px')
  expect(statusDiv?.style.height).toBe('1px')
  expect(statusDiv?.style.margin).toBe('-1px')
  expect(statusDiv?.style.overflow).toBe('hidden')
  expect(statusDiv?.style.padding).toBe('0px')
  expect(statusDiv?.style.position).toBe('absolute')
  expect(statusDiv?.style.width).toBe('1px')
})
