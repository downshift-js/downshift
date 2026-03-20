import {getDefaultHighlightedIndex} from '../getDefaultHighlightedIndex'

test('returns the default highlighted index if it is not disabled', () => {
  expect(getDefaultHighlightedIndex(['a', 'b', 'c'], () => false, 1)).toBe(1)
})

test('returns -1 if the default highlighted index is disabled', () => {
  expect(getDefaultHighlightedIndex(['a', 'b', 'c'], () => true, 1)).toBe(-1)
})

test('returns -1 if the default highlighted index is not provided', () => {
  expect(getDefaultHighlightedIndex(['a', 'b', 'c'], () => false)).toBe(-1)
})

test('returns -1 if the default highlighted index is negative', () => {
  expect(getDefaultHighlightedIndex(['a', 'b', 'c'], () => false, -1)).toBe(-1)
})
