import {getNonDisabledIndex} from '../getNonDisabledIndex'

const items = ['a', 'b', 'c', 'd', 'e']
const isItemDisabled = () => false
const isAllDisabled = () => true
const isFirstDisabled = (_item: unknown, index: number) => index === 0
const isLastDisabled = (_item: unknown, index: number) => index === items.length - 1

describe('getNonDisabledIndex', () => {
  describe('forward search (backwards = false)', () => {
    test('returns start index when it is not disabled', () => {
      expect(getNonDisabledIndex(0, false, items, isItemDisabled)).toBe(0)
    })

    test('returns next non-disabled index when start is disabled', () => {
      expect(getNonDisabledIndex(0, false, items, isFirstDisabled)).toBe(1)
    })

    test('returns -1 when all items are disabled and non-circular', () => {
      expect(getNonDisabledIndex(0, false, items, isAllDisabled)).toBe(-1)
    })

    test('wraps around from end to start when circular and no enabled item forward', () => {
      const allButFirstDisabled = (_item: unknown, index: number) => index !== 0
      expect(getNonDisabledIndex(1, false, items, allButFirstDisabled, true)).toBe(0)
    })

    test('returns -1 when all items are disabled and circular', () => {
      expect(getNonDisabledIndex(0, false, items, isAllDisabled, true)).toBe(-1)
    })
  })

  describe('backward search (backwards = true)', () => {
    test('returns start index when it is not disabled', () => {
      expect(getNonDisabledIndex(4, true, items, isItemDisabled)).toBe(4)
    })

    test('returns previous non-disabled index when start is disabled', () => {
      expect(getNonDisabledIndex(4, true, items, isLastDisabled)).toBe(3)
    })

    test('returns -1 when all items are disabled and non-circular', () => {
      expect(getNonDisabledIndex(4, true, items, isAllDisabled)).toBe(-1)
    })

    test('wraps around from start to end when circular and no enabled item backward', () => {
      const allButLastDisabled = (_item: unknown, index: number) =>
        index !== items.length - 1
      expect(getNonDisabledIndex(3, true, items, allButLastDisabled, true)).toBe(4)
    })

    test('returns -1 when all items are disabled and circular', () => {
      expect(getNonDisabledIndex(4, true, items, isAllDisabled, true)).toBe(-1)
    })
  })
})