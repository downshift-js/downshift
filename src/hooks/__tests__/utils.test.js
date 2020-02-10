import {getItemIndex, defaultProps} from '../utils'

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
})
