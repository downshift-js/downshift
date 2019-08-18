import {act} from 'react-dom/test-utils'
import {renderHook} from '@testing-library/react-hooks'
import * as keyboardKey from 'keyboard-key'
import {fireEvent, cleanup} from '@testing-library/react'
import {setup, dataTestIds, options, defaultIds} from '../testUtils'
import {stateChangeTypes} from '../utils'
import useSelect from '..'

describe('props', () => {
  afterEach(cleanup)

  test('if falsy then prop types error is thrown', () => {
    global.console.error = jest.fn()
    renderHook(() => useSelect())
    expect(global.console.error).toBeCalledWith(expect.any(String))
    global.console.error.mockRestore()
  })

  describe('id', () => {
    test('if passed will override downshift default', () => {
      const wrapper = setup({items: [], id: 'my-custom-little-id'})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      expect(toggleButton.getAttribute('id')).toContain('my-custom-little-id')
    })
  })

  describe('items', () => {
    test('if passed as empty then menu will not open', () => {
      const wrapper = setup({items: [], isOpen: true})
      const menu = wrapper.getByTestId(dataTestIds.menu)

      expect(menu.childNodes).toHaveLength(0)
    })

    test('passed as objects should work with custom itemToString', () => {
      const wrapper = setup({
        items: [{str: 'aaa'}, {str: 'bbb'}],
        itemToString: item => item.str,
        initialIsOpen: true,
      })

      fireEvent.click(wrapper.getByTestId(dataTestIds.item(0)))
      expect(document.getElementById('a11y-status-message').textContent).toBe(
        'aaa has been selected.',
      )
    })
  })

  describe('itemToString', () => {
    jest.useFakeTimers()

    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('should provide string version to a11y status message', () => {
      const wrapper = setup({
        itemToString: () => 'custom-item',
        initialIsOpen: true,
      })
      const item = wrapper.getByTestId(dataTestIds.item(0))

      fireEvent.click(item)

      expect(document.getElementById('a11y-status-message').textContent).toBe(
        'custom-item has been selected.',
      )
    })
  })

  describe('getA11yStatusMessage', () => {
    jest.useFakeTimers()

    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('reports that no results are available if items list is empty', () => {
      const wrapper = setup({items: []})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(document.getElementById('a11y-status-message').textContent).toBe(
        'No results are available',
      )
    })

    test('reports that one result is available if one item is shown', () => {
      const wrapper = setup({items: ['bla']})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(
        document.getElementById('a11y-status-message').textContent,
      ).toEqual(
        '1 result is available, use up and down arrow keys to navigate. Press Enter key to select.',
      )
    })

    test('reports the number of results available if more than one item are shown', () => {
      const wrapper = setup({items: ['bla', 'blabla']})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(
        document.getElementById('a11y-status-message').textContent,
      ).toEqual(
        '2 results are available, use up and down arrow keys to navigate. Press Enter key to select.',
      )
    })

    test('is empty on menu close', () => {
      const wrapper = setup({items: ['bla', 'blabla'], initialIsOpen: true})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      act(() => jest.runAllTimers())

      fireEvent.click(toggleButton)
      expect(
        document.getElementById('a11y-status-message').textContent,
      ).toEqual('')
    })

    test('is removed after 500ms as a cleanup', () => {
      const wrapper = setup()
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      act(() => jest.runAllTimers())

      expect(
        document.getElementById('a11y-status-message').textContent,
      ).toEqual('')
    })

    test('is replaced with the user provided one', () => {
      const wrapper = setup({getA11yStatusMessage: () => 'custom message'})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(
        document.getElementById('a11y-status-message').textContent,
      ).toEqual('custom message')

      const item = wrapper.getByTestId(dataTestIds.item(3))
      act(() => jest.runAllTimers())
      fireEvent.click(item)
      expect(
        document.getElementById('a11y-status-message').textContent,
      ).toEqual('custom message')
    })

    test('is called with the correct props', () => {
      const getA11yStatusMessage = jest.fn()
      const wrapper = setup({getA11yStatusMessage})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.any(Array),
          itemToString: expect.any(Function),
          isOpen: expect.any(Boolean),
          selectedItem: expect.any(Object),
        }),
      )
    })
  })

  describe('highlightedIndex', () => {
    test('controls the state property if passed', () => {
      const highlightedIndex = 1
      const wrapper = setup({isOpen: true, highlightedIndex})
      const menu = wrapper.getByTestId(dataTestIds.menu)

      expect(menu.getAttribute('aria-activedescendant')).toBe(
        defaultIds.itemId(highlightedIndex),
      )

      fireEvent.keyDown(menu, {keyCode: keyboardKey.ArrowDown})
      expect(menu.getAttribute('aria-activedescendant')).toBe(
        defaultIds.itemId(highlightedIndex),
      )

      fireEvent.keyDown(menu, {keyCode: keyboardKey.End})
      expect(menu.getAttribute('aria-activedescendant')).toBe(
        defaultIds.itemId(highlightedIndex),
      )

      fireEvent.keyDown(menu, {keyCode: keyboardKey.ArrowUp})
      expect(menu.getAttribute('aria-activedescendant')).toBe(
        defaultIds.itemId(highlightedIndex),
      )

      fireEvent.keyDown(menu, {key: 'c'})
      expect(menu.getAttribute('aria-activedescendant')).toBe(
        defaultIds.itemId(highlightedIndex),
      )
    })
  })

  describe('isOpen', () => {
    test('controls the state property if passed', () => {
      const wrapper = setup({isOpen: true})
      const menu = wrapper.getByTestId(dataTestIds.menu)
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      expect(menu.childNodes).toHaveLength(options.length)

      fireEvent.click(toggleButton)
      expect(menu.childNodes).toHaveLength(options.length)

      expect(menu.childNodes).toHaveLength(options.length)

      fireEvent.blur(menu)
      expect(menu.childNodes).toHaveLength(options.length)
    })
  })

  describe('selectedItem', () => {
    test('controls the state property if passed', () => {
      const selectedItem = options[2]
      const wrapper = setup({selectedItem, initialIsOpen: true})
      const menu = wrapper.getByTestId(dataTestIds.menu)
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const item = wrapper.getByTestId(dataTestIds.item(3))

      expect(toggleButton.textContent).toEqual(options[2])

      fireEvent.keyDown(menu, {keyCode: keyboardKey.ArrowDown})
      fireEvent.keyDown(menu, {keyCode: keyboardKey.Enter})

      expect(toggleButton.textContent).toEqual(options[2])

      fireEvent.click(toggleButton)
      fireEvent.click(item)
      expect(toggleButton.textContent).toEqual(options[2])
    })
  })

  describe('stateReducer', () => {
    test('is called at each state change', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const wrapper = setup({stateReducer})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const menu = wrapper.getByTestId(dataTestIds.menu)

      expect(stateReducer).not.toHaveBeenCalled()

      fireEvent.click(toggleButton)
      expect(stateReducer).toHaveBeenCalledTimes(2)

      fireEvent.keyDown(menu, {key: 'c'})
      expect(stateReducer).toHaveBeenCalledTimes(3)

      fireEvent.keyDown(menu, {keyCode: keyboardKey.ArrowUp})
      expect(stateReducer).toHaveBeenCalledTimes(4)

      fireEvent.click(toggleButton)
      expect(stateReducer).toHaveBeenCalledTimes(5)
    })

    test('replaces prop values with user defined', () => {
      const highlightedIndex = 2
      const stateReducer = jest.fn((s, a) => {
        const changes = a.changes
        changes.highlightedIndex = highlightedIndex
        return changes
      })
      const wrapper = setup({stateReducer})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const menu = wrapper.getByTestId(dataTestIds.menu)

      fireEvent.click(toggleButton)
      expect(menu.getAttribute('aria-activedescendant')).toBe(
        defaultIds.itemId(highlightedIndex),
      )
    })

    test('receives a downshift action type', () => {
      const stateReducer = jest.fn((s, a) => {
        expect(stateChangeTypes).toHaveProperty(a.type)
        return a.changes
      })
      const wrapper = setup({stateReducer})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
    })

    test('receives state, changes and type', () => {
      const stateReducer = jest.fn((s, a) => {
        expect(a.type).not.toBeUndefined()
        expect(a.type).not.toBeNull()

        expect(s).not.toBeUndefined()
        expect(s).not.toBeNull()

        expect(a.changes).not.toBeUndefined()
        expect(a.changes).not.toBeNull()

        return a.changes
      })
      const wrapper = setup({stateReducer})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
    })
  })

  describe('onSelectedItemChange', () => {
    test('is called at selectedItem change', () => {
      const onSelectedItemChange = jest.fn()
      const wrapper = setup({initialIsOpen: true, onSelectedItemChange})
      const item = wrapper.getByTestId(dataTestIds.item(0))

      fireEvent.click(item)
      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: options[0],
        }),
      )
    })

    test('is not called at if selectedItem is the same', () => {
      const onSelectedItemChange = jest.fn()
      const wrapper = setup({
        initialIsOpen: true,
        initialSelectedItem: options[0],
        onSelectedItemChange,
      })
      const item = wrapper.getByTestId(dataTestIds.item(0))

      fireEvent.click(item)
      expect(onSelectedItemChange).not.toHaveBeenCalled()
    })
  })

  describe('onHighlightedIndexChange', () => {
    test('is called at each highlightedIndex change', () => {
      const onHighlightedIndexChange = jest.fn()
      const wrapper = setup({initialIsOpen: true, onHighlightedIndexChange})
      const menu = wrapper.getByTestId(dataTestIds.menu)

      fireEvent.keyDown(menu, {keyCode: keyboardKey.ArrowDown})
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
        }),
      )
    })

    test('is not called if highlightedIndex is the same', () => {
      const onHighlightedIndexChange = jest.fn()
      const wrapper = setup({
        initialIsOpen: true,
        initialHighlightedIndex: 0,
        onHighlightedIndexChange,
      })
      const menu = wrapper.getByTestId(dataTestIds.menu)

      fireEvent.keyDown(menu, {keyCode: keyboardKey.ArrowUp})
      expect(onHighlightedIndexChange).not.toHaveBeenCalled()

      fireEvent.keyDown(menu, {keyCode: keyboardKey.Home})
      expect(onHighlightedIndexChange).not.toHaveBeenCalled()
    })
  })

  describe('onIsOpenChange', () => {
    test('is called at each isOpen change', () => {
      const onIsOpenChange = jest.fn()
      const wrapper = setup({initialIsOpen: true, onIsOpenChange})
      const menu = wrapper.getByTestId(dataTestIds.menu)

      fireEvent.keyDown(menu, {keyCode: keyboardKey.Escape})
      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: false,
        }),
      )
    })

    test('is not called at if isOpen is the same', () => {
      const onIsOpenChange = jest.fn()
      const wrapper = setup({defaultIsOpen: true, onIsOpenChange})
      const item = wrapper.getByTestId(dataTestIds.item(0))

      fireEvent.click(item)
      expect(onIsOpenChange).not.toHaveBeenCalledWith()
    })
  })

  describe('onStateChange', () => {
    test('is called at each state property change', () => {
      const onStateChange = jest.fn()
      const wrapper = setup({onStateChange})
      const menu = wrapper.getByTestId(dataTestIds.menu)
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: true,
        }),
      )

      fireEvent.keyDown(menu, {keyCode: keyboardKey.ArrowDown})
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
        }),
      )

      const item = wrapper.getByTestId(dataTestIds.item(0))
      fireEvent.click(item)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: options[0],
        }),
      )
    })
  })
})
