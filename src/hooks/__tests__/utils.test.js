import {renderHook} from '@testing-library/react'
import {useMouseAndTouchTracker, isDropdownsStateEqual} from '../utils'
import {getInitialValue, getDefaultValue, getItemAndIndex} from '../utils-ts'
import {dropdownDefaultProps} from '../utils.dropdown'

describe('utils', () => {
  describe('itemToString', () => {
    test('returns empty string if item is falsy', () => {
      const emptyString = dropdownDefaultProps.itemToString(null)
      expect(emptyString).toBe('')
    })
  })

  describe('getItemAndIndex', () => {
    test('returns arguments if passed as defined', () => {
      expect(getItemAndIndex({}, 5, [])).toEqual([{}, 5])
    })

    test('throws an error when item and index are not passed', () => {
      const errorMessage = 'Pass either item or index to the item getter prop!'

      expect(() =>
        getItemAndIndex(undefined, undefined, [1, 2, 3], errorMessage),
      ).toThrow(errorMessage)
    })

    test('returns index if item is passed', () => {
      const item = {}

      expect(getItemAndIndex(item, undefined, [{x: 1}, item, {x: 2}])).toEqual([
        item,
        1,
      ])
    })

    test('returns item if index is passed', () => {
      const index = 2
      const item = {x: 2}
      expect(getItemAndIndex(undefined, 2, [{x: 1}, {x: 3}, item])).toEqual([
        item,
        index,
      ])
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
        renderHook(() => useMouseAndTouchTracker(undefined, jest.fn(), []))
      }).not.toThrow()
    })

    test('adds and removes listeners to environment', () => {
      const environment = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
      const elements = [{}, {}]
      const handleBlur = jest.fn()
      const initialProps = {environment, handleBlur, elements}

      const {unmount, rerender, result} = renderHook(
        props =>
          useMouseAndTouchTracker(
            props.environment,
            props.handleBlur,
            props.elements,
          ),
        {initialProps},
      )

      expect(environment.addEventListener).toHaveBeenCalledTimes(5)
      expect(environment.removeEventListener).not.toHaveBeenCalled()
      expect(environment.addEventListener.mock.calls).toMatchSnapshot(
        'initial adding events',
      )

      environment.addEventListener.mockReset()
      environment.removeEventListener.mockReset()
      rerender(initialProps)

      expect(environment.removeEventListener).not.toHaveBeenCalled()
      expect(environment.addEventListener).not.toHaveBeenCalled()

      rerender({...initialProps, elements: [...elements]})

      expect(environment.addEventListener).toHaveBeenCalledTimes(5)
      expect(environment.removeEventListener).toHaveBeenCalledTimes(5)
      expect(environment.addEventListener.mock.calls).toMatchSnapshot(
        'element change rerender adding events',
      )
      expect(environment.removeEventListener.mock.calls).toMatchSnapshot(
        'element change rerender remove events',
      )

      environment.addEventListener.mockReset()
      environment.removeEventListener.mockReset()

      unmount()

      expect(environment.addEventListener).not.toHaveBeenCalled()
      expect(environment.removeEventListener).toHaveBeenCalledTimes(5)
      expect(environment.removeEventListener.mock.calls).toMatchSnapshot(
        'unmount remove events',
      )

      expect(result.current).toEqual({
        isMouseDown: false,
        isTouchMove: false,
        isTouchEnd: false,
      })
    })
  })

  describe('isDropdownsStateEqual', () => {
    test('is true when each property is equal', () => {
      const selectedItem = 'hello'
      const prevState = {
        highlightedIndex: 2,
        isOpen: true,
        selectedItem,
        inputValue: selectedItem,
      }
      const newState = {
        ...prevState,
      }

      expect(isDropdownsStateEqual(prevState, newState)).toBe(true)
    })

    test('is false when at least one property is not equal', () => {
      const selectedItem = {value: 'hello'}
      const prevState = {
        highlightedIndex: 2,
        isOpen: true,
        selectedItem,
        inputValue: selectedItem,
      }
      const newState = {
        ...prevState,
        selectedItem: {...selectedItem},
      }

      expect(isDropdownsStateEqual(prevState, newState)).toBe(false)
    })
  })
})
