import {
  getItemIndex,
  getItemIndexByCharacterKey,
  itemToString,
} from '../../utils'
import {getA11yStatusMessage} from '../utils'
import reducer from '../reducer'

describe('utils', () => {
  describe('itemToString', () => {
    test('returns empty string if item is falsy', () => {
      const emptyString = itemToString(null)
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

  describe('getItemIndexByCharacterKey', () => {
    const items = ['a', 'b', 'aba', 'aab', 'bab']

    test('returns to check from start if from highlightedIndex does not find anything', () => {
      const index = getItemIndexByCharacterKey('a', 3, items, item => item)
      expect(index).toBe(0)
    })

    test('checks from highlightedIndex position inclusively if there is more than one key', () => {
      const index = getItemIndexByCharacterKey('aba', 2, items, item => item)
      expect(index).toBe(2)
    })

    test('checks from highlightedIndex position exclusively if there is only one key', () => {
      const index = getItemIndexByCharacterKey('a', 2, items, item => item)
      expect(index).toBe(3)
    })
  })

  describe('getA11yStatusMessage', () => {
    test('returns empty if no items', () => {
      const message = getA11yStatusMessage({})
      expect(message).toBe('')
    })

    test('returns empty if no message can be created', () => {
      const message = getA11yStatusMessage({items: [], isOpen: false})
      expect(message).toBe('')
    })
  })

  test('reducer throws error if called without proper action type', () => {
    let called = false
    try {
      reducer({}, {type: 'super-bogus'})
    } catch (error) {
      called = true
      expect(error.message).toEqual(
        'Reducer called without proper action type.',
      )
    }
    expect(called).toBe(true)
  })
})
