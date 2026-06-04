import {getHighlightedIndexOnOpen} from '../getHighlightedIndexOnOpen'

const items = ['a', 'b', 'c']
const isItemDisabled = () => false
const isFirstItemDisabled = (_item: string, index: number) => index === 0
const isLastItemDisabled = (_item: string, index: number) =>
  index === items.length - 1
const itemToKey = (item: string | null) => item

test('returns -1 when items is empty', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      [],
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('returns initialHighlightedIndex when it matches state highlightedIndex and is not disabled', () => {
  const initialHighlightedIndex = 1
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = 1
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(1)
})

test('skips initialHighlightedIndex when state highlightedIndex does not match', () => {
  const initialHighlightedIndex = 1
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = 0
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('skips initialHighlightedIndex when that item is disabled', () => {
  const initialHighlightedIndex = 0
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = 0
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isFirstItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('returns defaultHighlightedIndex when it is not disabled', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = 2
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(2)
})

test('skips defaultHighlightedIndex when that item is disabled', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = 0
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isFirstItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('returns index of selectedItem when selectedItem is set', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = 'b'
  const highlightedIndex = -1
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(1)
})

test('returns last index when offset is negative and last item is not disabled', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = -1
  const offset = -1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(2)
})

test('skips last index when offset is negative and last item is disabled', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = -1
  const offset = -1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isLastItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('returns 0 when offset is positive and first item is not disabled', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(0)
})

test('skips 0 when offset is positive and first item is disabled', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isFirstItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('returns -1 when no conditions match', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('returns -1 when defaultHighlightedIndex is -1, even when selectedItem is set', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = -1
  const selectedItem = 'b'
  const highlightedIndex = -1
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('returns -1 when initialHighlightedIndex is -1 and highlightedIndex matches', () => {
  const initialHighlightedIndex = -1
  const defaultHighlightedIndex = undefined
  const selectedItem = 'b'
  const highlightedIndex = -1
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('skips initialHighlightedIndex when it is out of bounds', () => {
  const initialHighlightedIndex = 10
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = 10
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(0)
})

test('skips defaultHighlightedIndex when it is out of bounds', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = 10
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(0)
})

test('skips initialHighlightedIndex when it is a large negative', () => {
  const initialHighlightedIndex = -5
  const defaultHighlightedIndex = undefined
  const selectedItem = null
  const highlightedIndex = -5
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(0)
})

test('skips defaultHighlightedIndex when it is a large negative', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = -5
  const selectedItem = null
  const highlightedIndex = -1
  const offset = 1

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(0)
})

test('returns -1 when selectedItem is not found in items', () => {
  const initialHighlightedIndex = undefined
  const defaultHighlightedIndex = undefined
  const selectedItem = 'z'
  const highlightedIndex = -1
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(-1)
})

test('initialHighlightedIndex takes priority over defaultHighlightedIndex when it matches highlightedIndex', () => {
  const initialHighlightedIndex = 0
  const defaultHighlightedIndex = 2
  const selectedItem = null
  const highlightedIndex = 0
  const offset = 0

  expect(
    getHighlightedIndexOnOpen(
      items,
      initialHighlightedIndex,
      defaultHighlightedIndex,
      isItemDisabled,
      itemToKey,
      selectedItem,
      highlightedIndex,
      offset,
    ),
  ).toBe(0)
})
