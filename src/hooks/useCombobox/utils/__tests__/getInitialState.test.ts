import {getInitialState} from '../getInitialState'

describe('getInitialState', () => {
  test('should return the initial state with default values', () => {
    const props = {
      itemToString(item: unknown) {
        return String(item)
      },
      items: [],
      isItemDisabled() {
        return false
      },
      itemToKey(item: unknown) {
        return String(item)
      },
    }
    const state = getInitialState(props)

    expect(state).toEqual({
      highlightedIndex: -1,
      inputValue: '',
      isOpen: false,
      selectedItem: null,
    })
  })

  test('should set inputValue to the string representation of selectedItem if inputValue is empty and selectedItem is provided', () => {
    const props = {
      itemToString(item: unknown) {
        return String(item)
      },
      items: ['item1', 'item2'],
      selectedItem: 'item1',
      isItemDisabled() {
        return false
      },
      itemToKey(item: unknown) {
        return String(item)
      },
    }
    const state = getInitialState(props)

    expect(state.inputValue).toBe('item1')
  })

  it('should not override inputValue if it is provided', () => {
    const props = {
      itemToString(item: unknown) {
        return String(item)
      },
      items: ['item1', 'item2'],
      selectedItem: 'item1',
      inputValue: 'custom input',
      isItemDisabled() {
        return false
      },
      itemToKey(item: unknown) {
        return String(item)
      },
    }
    const state = getInitialState(props)

    expect(state.inputValue).toBe('custom input')
  })

  it('should not override inputValue if defaultInputValue is provided', () => {
    const props = {
      itemToString(item: unknown) {
        return String(item)
      },
      items: ['item1', 'item2'],
      selectedItem: 'item1',
      defaultInputValue: 'default input',
      isItemDisabled() {
        return false
      },
      itemToKey(item: unknown) {
        return String(item)
      },
    }
    const state = getInitialState(props)

    expect(state.inputValue).toBe('default input')
  })

  it('should not override inputValue if initialInputValue is provided', () => {
    const props = {
      itemToString(item: unknown) {
        return String(item)
      },
      items: ['item1', 'item2'],
      selectedItem: 'item1',
      initialInputValue: 'initial input',
      isItemDisabled() {
        return false
      },
      itemToKey(item: unknown) {
        return String(item)
      },
    }
    const state = getInitialState(props)

    expect(state.inputValue).toBe('initial input')
  })

  it('should not override inputValue if inputValue is provided', () => {
    const props = {
      itemToString(item: unknown) {
        return String(item)
      },
      items: ['item1', 'item2'],
      selectedItem: 'item1',
      inputValue: 'controlled input',
      isItemDisabled() {
        return false
      },
      itemToKey(item: unknown) {
        return String(item)
      },
    }
    const state = getInitialState(props)

    expect(state.inputValue).toBe('controlled input')
  })
})
