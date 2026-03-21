import {getChangesOnSelection} from '../getChangesOnSelection'

describe('getChangesOnSelection', () => {
  const items = ['a', 'b', 'c']
  const itemToString = (item: string | null) => (item ? item : '')
  const defaultIsOpen = undefined
  const defaultHighlightedIndex = undefined

  test('should return the correct changes when there is a highlighted index', () => {
    const highlightedIndex = 1

    expect(
      getChangesOnSelection(
        items,
        itemToString,
        defaultIsOpen,
        defaultHighlightedIndex,
        highlightedIndex,
      ),
    ).toEqual({
      isOpen: false,
      highlightedIndex: -1,
      selectedItem: 'b',
    })
  })

  test('should return the correct changes when there is no highlighted index', () => {
    const highlightedIndex = -1

    expect(
      getChangesOnSelection(
        items,
        itemToString,
        defaultIsOpen,
        defaultHighlightedIndex,
        highlightedIndex,
      ),
    ).toEqual({
      isOpen: false,
      highlightedIndex: -1,
    })
  })

  test('should return the correct changes when items is empty', () => {
    const highlightedIndex = 0

    expect(
      getChangesOnSelection(
        [],
        itemToString,
        defaultIsOpen,
        defaultHighlightedIndex,
        highlightedIndex,
      ),
    ).toEqual({
      isOpen: false,
      highlightedIndex: -1,
    })
  })

  test('should return the correct changes when inputValue is true', () => {
    const highlightedIndex = 1
    const inputValue = true

    expect(
      getChangesOnSelection(
        items,
        itemToString,
        defaultIsOpen,
        defaultHighlightedIndex,
        highlightedIndex,
        inputValue,
      ),
    ).toEqual({
      isOpen: false,
      highlightedIndex: -1,
      selectedItem: 'b',
      inputValue: 'b',
    })
  })

  test('should return the default values for isOpen and highlightedIndex when there is a highlighted index', () => {
    const highlightedIndex = 1
    const customDefaultIsOpen = true
    const customDefaultHighlightedIndex = 2

    expect(
      getChangesOnSelection(
        items,
        itemToString,
        customDefaultIsOpen,
        customDefaultHighlightedIndex,
        highlightedIndex,
      ),
    ).toEqual({
      isOpen: true,
      highlightedIndex: 2,
      selectedItem: 'b',
    })
  })
})
