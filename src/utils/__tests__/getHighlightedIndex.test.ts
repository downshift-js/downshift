import {getHighlightedIndex} from '../getHighlightedIndex'

const items = ['a', 'b', 'c', 'd', 'e']
const isItemDisabled = () => false
const isMiddleItemDisabled = (_item: unknown, index: number) => index === 2

describe('getHighlightedIndex', () => {
  test('returns -1 when items is empty', () => {
    expect(getHighlightedIndex(0, 1, [], isItemDisabled)).toBe(-1)
  })

  describe('forward navigation (offset > 0)', () => {
    test('returns next index from current', () => {
      expect(getHighlightedIndex(1, 1, items, isItemDisabled)).toBe(2)
    })

    test('clamps to last index when going past the end (non-circular)', () => {
      expect(getHighlightedIndex(4, 1, items, isItemDisabled)).toBe(4)
    })

    test('wraps around to start when going past the end (circular)', () => {
      expect(getHighlightedIndex(4, 1, items, isItemDisabled, true)).toBe(0)
    })

    test('skips disabled item and returns next enabled one', () => {
      expect(getHighlightedIndex(1, 1, items, isMiddleItemDisabled)).toBe(3)
    })

    test('wraps around and skips disabled when circular and all forward items are disabled', () => {
      const allButFirstDisabled = (_item: unknown, index: number) => index !== 0
      expect(getHighlightedIndex(1, 1, items, allButFirstDisabled, true)).toBe(0)
    })

    test('returns start when all items forward are disabled and non-circular', () => {
      const allDisabledFromTwo = (_item: unknown, index: number) => index >= 2
      expect(getHighlightedIndex(1, 1, items, allDisabledFromTwo)).toBe(1)
    })

    test('starts from index -1 when start is invalid and offset is positive', () => {
      // invalid start means search from beginning
      expect(getHighlightedIndex(-1, 1, items, isItemDisabled)).toBe(0)
    })

    test('starts from index -1 when start is above last index and offset is positive', () => {
      expect(getHighlightedIndex(10, 1, items, isItemDisabled)).toBe(0)
    })
  })

  describe('backward navigation (offset < 0)', () => {
    test('returns previous index from current', () => {
      expect(getHighlightedIndex(3, -1, items, isItemDisabled)).toBe(2)
    })

    test('clamps to first index when going before the start (non-circular)', () => {
      expect(getHighlightedIndex(0, -1, items, isItemDisabled)).toBe(0)
    })

    test('wraps around to end when going before the start (circular)', () => {
      expect(getHighlightedIndex(0, -1, items, isItemDisabled, true)).toBe(4)
    })

    test('skips disabled item and returns previous enabled one', () => {
      expect(getHighlightedIndex(3, -1, items, isMiddleItemDisabled)).toBe(1)
    })

    test('starts from last index + 1 when start is invalid and offset is negative', () => {
      // invalid start means search from end
      expect(getHighlightedIndex(-1, -1, items, isItemDisabled)).toBe(4)
    })
  })

  describe('large offsets (page up/down)', () => {
    test('moves forward by 10 and clamps to last index when non-circular', () => {
      expect(getHighlightedIndex(0, 10, items, isItemDisabled)).toBe(4)
    })

    test('moves backward by 10 and clamps to first index when non-circular', () => {
      expect(getHighlightedIndex(4, -10, items, isItemDisabled)).toBe(0)
    })
  })
})