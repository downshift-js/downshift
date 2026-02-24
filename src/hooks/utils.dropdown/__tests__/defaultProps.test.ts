import {defaultProps} from '../dropdownDefaultProps'

describe('itemToString', () => {
  test('returns empty string if item is falsy', () => {
    const emptyString = defaultProps.itemToString(null)
    expect(emptyString).toBe('')
  })
})

describe('itemToKey', () => {
  test('returns the item', () => {
    const item = {hi: 'hello'}
    expect(defaultProps.itemToKey(item)).toBe(item)
  })
})

describe('environment', () => {
  test('is window in browser environment', () => {
    expect(defaultProps.environment).toBe(window)
  })
})
