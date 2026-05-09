import {getItemIndexByCharacterKey} from '..'

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
    expect(
      getItemIndexByCharacterKey({
        keysSoFar: 'b',
        highlightedIndex: 0,
        items,
        itemToString,
        isItemDisabled: jest
          .fn()
          .mockImplementation((_item, index) => index === 1),
      }),
    ).toEqual(4)
  })

  test('returns highlightedIndex if no match is found', () => {
    const index = getItemIndexByCharacterKey({
      keysSoFar: 'z',
      highlightedIndex: 2,
      items,
      itemToString,
      isItemDisabled,
    })
    expect(index).toBe(2)
  })

  test('matching is case-insensitive', () => {
    const index = getItemIndexByCharacterKey({
      keysSoFar: 'A',
      highlightedIndex: -1,
      items,
      itemToString,
      isItemDisabled,
    })
    expect(index).toBe(0)
  })

  test('wraps around from the end of the list back to the start', () => {
    const index = getItemIndexByCharacterKey({
      keysSoFar: 'a',
      highlightedIndex: 4,
      items,
      itemToString,
      isItemDisabled,
    })
    expect(index).toBe(0)
  })

  test('returns highlightedIndex if all matching items are disabled', () => {
    const index = getItemIndexByCharacterKey({
      keysSoFar: 'b',
      highlightedIndex: 1,
      items,
      itemToString,
      isItemDisabled: jest
        .fn()
        .mockImplementation((item: string) => item.startsWith('b')),
    })
    expect(index).toBe(1)
  })
})
