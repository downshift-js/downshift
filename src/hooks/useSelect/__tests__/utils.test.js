import {getItemIndexByCharacterKey} from '../utils'
import reducer from '../reducer'

describe('utils', () => {
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

  test('reducer throws error if called without proper action type', () => {
    expect(() => {
      reducer({}, {type: 'super-bogus'})
    }).toThrowError('Reducer called without proper action type.')
  })
})
