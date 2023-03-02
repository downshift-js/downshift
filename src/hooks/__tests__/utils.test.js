import {renderHook} from '@testing-library/react-hooks'
import {
  getItemIndex,
  defaultProps,
  getInitialValue,
  getDefaultValue,
  useMouseAndTouchTracker,
} from '../utils'

describe('utils', () => {
  describe('itemToString', () => {
    test('returns empty string if item is falsy', () => {
      const emptyString = defaultProps.itemToString(null)
      expect(emptyString).toBe('')
    })
  })

  describe('getItemIndex', () => {
    test('returns -1 if no items', () => {
      const index = getItemIndex(undefined, {}, [])
      expect(index).toBe(-1)
    })

    test('returns index if passed', () => {
      const index = getItemIndex(5, {}, [])
      expect(index).toBe(5)
    })

    test('returns index of item', () => {
      const item = {x: 2}
      const index = getItemIndex(undefined, item, [{x: 1}, item, {x: 2}])
      expect(index).toBe(1)
    })
  })

  test('getInitialValue will not return undefined as initial value', () => {
    const defaults = {bogusValue: 'hello'}
    const value = getInitialValue(
      {initialBogusValue: undefined},
      'bogusValue',
      defaults,
    )

    expect(value).toEqual(defaults.bogusValue)
  })

  test('getInitialValue will not return undefined as value', () => {
    const defaults = {bogusValue: 'hello'}
    const value = getInitialValue(
      {bogusValue: undefined},
      'bogusValue',
      defaults,
    )

    expect(value).toEqual(defaults.bogusValue)
  })

  test('getDefaultValue will not return undefined as value', () => {
    const defaults = {bogusValue: 'hello'}
    const value = getDefaultValue(
      {defaultBogusValue: undefined},
      'bogusValue',
      defaults,
    )

    expect(value).toEqual(defaults.bogusValue)
  })

  describe('useMouseAndTouchTracker', () => {
    test('renders without error', () => {
      expect(() => {
        renderHook(() =>
          useMouseAndTouchTracker(false, [], undefined, jest.fn()),
        )
      }).not.toThrowError()
    })

    test('adds and removes listeners to environment', () => {
      const environment = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }

      const {unmount, result} = renderHook(() =>
        useMouseAndTouchTracker(false, [], environment, jest.fn()),
      )

      expect(environment.addEventListener).toHaveBeenCalledTimes(5)
      expect(environment.addEventListener).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
      )
      expect(environment.addEventListener).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function),
      )
      expect(environment.addEventListener).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
      )
      expect(environment.addEventListener).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
      )
      expect(environment.addEventListener).toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
      )
      expect(environment.removeEventListener).not.toHaveBeenCalled()

      unmount()

      expect(environment.addEventListener).toHaveBeenCalledTimes(5)
      expect(environment.removeEventListener).toHaveBeenCalledTimes(5)
      expect(environment.removeEventListener).toHaveBeenCalledWith(
        'mousedown',
        expect.any(Function),
      )
      expect(environment.removeEventListener).toHaveBeenCalledWith(
        'mouseup',
        expect.any(Function),
      )
      expect(environment.removeEventListener).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
      )
      expect(environment.removeEventListener).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
      )
      expect(environment.removeEventListener).toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
      )

      expect(result.current).toEqual({
        current: {isMouseDown: false, isTouchMove: false},
      })
    })
  })
})
