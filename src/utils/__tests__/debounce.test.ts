import {debounce} from '../debounce'

jest.useFakeTimers()

test('debounce calls the function after the specified delay', () => {
  const fn = jest.fn()
  const debouncedFn = debounce(fn, 1000)

  debouncedFn()
  expect(fn).not.toHaveBeenCalled()

  jest.advanceTimersByTime(1000)
  expect(fn).toHaveBeenCalledTimes(1)
})

test('debounce cancels the previous call if called again before the delay', () => {
  const fn = jest.fn()
  const debouncedFn = debounce(fn, 1000)

  debouncedFn()
  debouncedFn()
  expect(fn).not.toHaveBeenCalled()

  jest.advanceTimersByTime(1000)
  expect(fn).toHaveBeenCalledTimes(1)
})

test('debounce cancel method prevents the function from being called', () => {
  const fn = jest.fn()
  const debouncedFn = debounce(fn, 1000)

  debouncedFn()
  debouncedFn.cancel()
  expect(fn).not.toHaveBeenCalled()

  jest.advanceTimersByTime(1000)
  expect(fn).not.toHaveBeenCalled()
})

test('debounce returns a function with a cancel method', () => {
  const fn = jest.fn()
  const debouncedFn = debounce(fn, 1000)

  expect(typeof debouncedFn).toBe('function')
  expect(typeof debouncedFn.cancel).toBe('function')
})

test('debounce calls the function with the latest arguments', () => {
  const fn = jest.fn()
  const debouncedFn = debounce(fn, 1000)

  debouncedFn(1)
  debouncedFn(2)
  debouncedFn(3)

  jest.advanceTimersByTime(1000)
  expect(fn).toHaveBeenCalledWith(3)
})
