import {getItemIndexByCharacterKey} from '../utils'
import reducer from '../reducer'

describe('getItemIndexByCharacterKey', () => {
  const items = ['a', 'b', 'aba', 'aab', 'bab']
  const itemToString = jest.fn().mockImplementation(item => item)
  const isItemDisabled = jest.fn().mockReturnValue(false)

  test('returns to check from start if from highlightedIndex does not find anything', () => {
    const index = getItemIndexByCharacterKey({
      keysSoFar: 'a',
      highlightedIndex: 3,
      items,
      itemToString,
      isItemDisabled,
    })
    expect(index).toBe(0)
  })

  test('checks from highlightedIndex position inclusively if there is more than one key', () => {
    const index = getItemIndexByCharacterKey({
      keysSoFar: 'aba',
      highlightedIndex: 2,
      items,
      itemToString,
      isItemDisabled,
    })
    expect(index).toBe(2)
  })

  test('checks from highlightedIndex position exclusively if there is only one key', () => {
    const index = getItemIndexByCharacterKey({
      keysSoFar: 'a',
      highlightedIndex: 2,
      items,
      itemToString,
      isItemDisabled,
    })
    expect(index).toBe(3)
  })

  test('skips disabled item and moves to next', () => {
    const keysSoFar = 'b'
    const highlightedIndex = 0

    expect(
      getItemIndexByCharacterKey({
        keysSoFar,
        highlightedIndex,
        items,
        itemToString,
        isItemDisabled: jest
          .fn()
          .mockImplementation((_item, index) => index === 1),
      }),
    ).toEqual(4)
  })
})

test('reducer throws error if called without proper action type', () => {
  expect(() => {
    reducer({}, {type: 'super-bogus'})
  }).toThrowError('Reducer called without proper action type.')
})
