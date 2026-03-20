import {getHighlightedIndexOnOpen} from '../getHighlightedIndexOnOpen'

const items = ['a', 'b', 'c']
const isItemDisabled = () => false
const isFirstItemDisabled = (_item: string, index: number) => index === 0
const isLastItemDisabled = (_item: string, index: number) =>
  index === items.length - 1
const itemToKey = (item: string | null) => item

test('returns -1 when items is empty', () => {
  expect(
    getHighlightedIndexOnOpen([], undefined, undefined, isItemDisabled, itemToKey, null, -1, 0),
  ).toBe(-1)
})

test('returns initialHighlightedIndex when it matches state highlightedIndex and is not disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, 1, undefined, isItemDisabled, itemToKey, null, 1, 0),
  ).toBe(1)
})

test('skips initialHighlightedIndex when state highlightedIndex does not match', () => {
  expect(
    getHighlightedIndexOnOpen(items, 1, undefined, isItemDisabled, itemToKey, null, 0, 0),
  ).toBe(-1)
})

test('skips initialHighlightedIndex when that item is disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, 0, undefined, isFirstItemDisabled, itemToKey, null, 0, 1),
  ).toBe(-1)
})

test('returns defaultHighlightedIndex when it is not disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, 2, isItemDisabled, itemToKey, null, -1, 0),
  ).toBe(2)
})

test('skips defaultHighlightedIndex when that item is disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, 0, isFirstItemDisabled, itemToKey, null, -1, 1),
  ).toBe(-1)
})

test('returns index of selectedItem when selectedItem is set', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, undefined, isItemDisabled, itemToKey, 'b', -1, 0),
  ).toBe(1)
})

test('returns last index when offset is negative and last item is not disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, undefined, isItemDisabled, itemToKey, null, -1, -1),
  ).toBe(2)
})

test('skips last index when offset is negative and last item is disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, undefined, isLastItemDisabled, itemToKey, null, -1, -1),
  ).toBe(-1)
})

test('returns 0 when offset is positive and first item is not disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, undefined, isItemDisabled, itemToKey, null, -1, 1),
  ).toBe(0)
})

test('skips 0 when offset is positive and first item is disabled', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, undefined, isFirstItemDisabled, itemToKey, null, -1, 1),
  ).toBe(-1)
})

test('returns -1 when no conditions match', () => {
  expect(
    getHighlightedIndexOnOpen(items, undefined, undefined, isItemDisabled, itemToKey, null, -1, 0),
  ).toBe(-1)
})
