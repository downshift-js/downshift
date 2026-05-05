import { dropdownDefaultProps } from "../dropdownDefaultProps";

test('dropdownDefaultProps has the expected properties', () => {
  expect(dropdownDefaultProps).toHaveProperty('itemToString')
  expect(dropdownDefaultProps).toHaveProperty('itemToKey')
  expect(dropdownDefaultProps).toHaveProperty('isItemDisabled')
  expect(dropdownDefaultProps).toHaveProperty('stateReducer')
  expect(dropdownDefaultProps).toHaveProperty('scrollIntoView')
  expect(dropdownDefaultProps).toHaveProperty('environment')
})

test('dropdownDefaultProps.itemToString returns empty string for falsy values', () => {
  expect(dropdownDefaultProps.itemToString(null)).toBe('')
  expect(dropdownDefaultProps.itemToString(undefined)).toBe('')
  expect(dropdownDefaultProps.itemToString(false)).toBe('')
  expect(dropdownDefaultProps.itemToString(0)).toBe('')
})

test('dropdownDefaultProps.itemToString returns string representation for truthy values', () => {
  expect(dropdownDefaultProps.itemToString('hello')).toBe('hello')
  expect(dropdownDefaultProps.itemToString(123)).toBe('123')
  expect(dropdownDefaultProps.itemToString(true)).toBe('true')
  expect(dropdownDefaultProps.itemToString({})).toBe('[object Object]')
})

test('dropdownDefaultProps.itemToKey returns the item itself', () => {
  const item = { id: 1, name: 'Test' }
  expect(dropdownDefaultProps.itemToKey(item)).toBe(item)
})

test('dropdownDefaultProps.isItemDisabled returns false for any item', () => {
  expect(dropdownDefaultProps.isItemDisabled({})).toBe(false)
  expect(dropdownDefaultProps.isItemDisabled({ disabled: true })).toBe(false)
})

test('dropdownDefaultProps.stateReducer returns changes from actionAndChanges', () => {
  const state = { highlightedIndex: -1 }
  const actionAndChanges = {
    type: 'setHighlightedIndex',
    changes: { highlightedIndex: 2 },
    props: {},
  }
  expect(
    dropdownDefaultProps.stateReducer(state, actionAndChanges),
  ).toEqual({ highlightedIndex: 2 })
})

test('dropdownDefaultProps.environment is window in browser environment', () => {
  expect(dropdownDefaultProps.environment).toBe(window)
})