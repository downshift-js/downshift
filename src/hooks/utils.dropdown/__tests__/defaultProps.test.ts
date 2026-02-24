import {dropdownDefaultProps} from '../dropdownDefaultProps'

describe('itemToString', () => {
  test('returns empty string if item is falsy', () => {
    const emptyString = dropdownDefaultProps.itemToString(null)
    expect(emptyString).toBe('')
  })
})

describe('itemToKey', () => {
  test('returns the item', () => {
    const item = {hi: 'hello'}
    expect(dropdownDefaultProps.itemToKey(item)).toBe(item)
  })
})

describe('environment', () => {
  test('is window in browser environment', () => {
    expect(dropdownDefaultProps.environment).toBe(window)
  })
})
