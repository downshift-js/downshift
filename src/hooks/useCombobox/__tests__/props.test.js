import {act} from 'react-dom/test-utils'
import React from 'react'
import {renderHook} from '@testing-library/react-hooks'
import {fireEvent, cleanup, render} from '@testing-library/react'
import {defaultProps} from '../../utils'
import {setup, dataTestIds, items, defaultIds} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import useCombobox from '..'

describe('props', () => {
  afterEach(cleanup)

  test('if falsy then prop types error is thrown', () => {
    global.console.error = jest.fn()
    renderHook(() => useCombobox())
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

  describe('getA11ySelectionMessage', () => {
    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('is called with isOpen, items, itemToString and selectedItem at selection', () => {
      const getA11ySelectionMessage = jest.fn()
      const wrapper = setup({
        getA11ySelectionMessage,
        isOpen: true,
        items: [{str: 'ala'}],
      })
      const item = wrapper.getByTestId(dataTestIds.item(0))

      fireEvent.click(item)
      expect(getA11ySelectionMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          itemToString: expect.any(Function),
          selectedItem: expect.any(Object),
          items: expect.any(Array),
          isOpen: expect.any(Boolean),
        }),
      )
    })

    test('is replaced with the user provided one', () => {
      const wrapper = setup({getA11ySelectionMessage: () => 'custom message'})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      const item = wrapper.getByTestId(dataTestIds.item(3))
      act(() => jest.runAllTimers())
      fireEvent.click(item)
      expect(
        document.getElementById('a11y-status-message').textContent,
      ).toEqual('custom message')
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
    })

    test('is called with isOpen, items, itemToString and selectedItem at toggle', () => {
      const getA11yStatusMessage = jest.fn()
      const wrapper = setup({getA11yStatusMessage})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.any(Array),
          isOpen: expect.any(Boolean),
          itemToString: expect.any(Function),
          selectedItem: expect.any(Object),
        }),
      )
    })

    test('is added to the document provided by the user as prop', () => {
      const environment = {
        document: {
          getElementById: jest.fn(() => ({
            setAttribute: jest.fn(),
            style: {},
          })),
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
      const wrapper = setup({items: [], environment})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
    })
  })

  describe('highlightedIndex', () => {
    test('controls the state property if passed', () => {
      const highlightedIndex = 1
      const wrapper = setup({isOpen: true, highlightedIndex})
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(input.getAttribute('aria-activedescendant')).toBe(
        defaultIds.getItemId(highlightedIndex),
      )

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      expect(input.getAttribute('aria-activedescendant')).toBe(
        defaultIds.getItemId(highlightedIndex),
      )

      fireEvent.keyDown(input, {key: 'End'})
      expect(input.getAttribute('aria-activedescendant')).toBe(
        defaultIds.getItemId(highlightedIndex),
      )

      fireEvent.keyDown(input, {key: 'ArrowUp'})
      expect(input.getAttribute('aria-activedescendant')).toBe(
        defaultIds.getItemId(highlightedIndex),
      )

      fireEvent.keyDown(input, {key: 'c'})
      expect(input.getAttribute('aria-activedescendant')).toBe(
        defaultIds.getItemId(highlightedIndex),
      )
    })
  })

  describe('inputValue', () => {
    test('controls the state property if passed', () => {
      const wrapper = setup({isOpen: true, inputValue: 'Dohn Joe'})
      const input = wrapper.getByTestId(dataTestIds.input)
      const item = wrapper.getByTestId(dataTestIds.item(3))

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      fireEvent.keyDown(input, {key: 'Enter'})
      expect(input.value).toBe('Dohn Joe')

      fireEvent.click(item)
      expect(input.value).toBe('Dohn Joe')

      fireEvent.keyDown(input, {key: 'ArrowUp'})
      fireEvent.keyDown(input, {key: 'Enter'})
      expect(input.value).toBe('Dohn Joe')

      fireEvent.blur(input)
      expect(input.value).toBe('Dohn Joe')
    })
  })

  describe('isOpen', () => {
    test('controls the state property if passed', () => {
      const wrapper = setup({isOpen: true})
      const menu = wrapper.getByTestId(dataTestIds.menu)
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(menu.childNodes).toHaveLength(items.length)

      fireEvent.click(toggleButton)
      expect(menu.childNodes).toHaveLength(items.length)

      fireEvent.keyDown(input, {key: 'Escape'})
      expect(menu.childNodes).toHaveLength(items.length)

      fireEvent.blur(input)
      expect(menu.childNodes).toHaveLength(items.length)
    })
  })

  describe('selectedItem', () => {
    const DropdownCustomCombobox = props => {
      const {
        isOpen,
        getLabelProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        getToggleButtonProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
      } = useCombobox({items, ...props})
      return (
        <div>
          <label {...getLabelProps()}>Choose an element:</label>
          <div data-testid={dataTestIds.combobox} {...getComboboxProps()}>
            <input
              data-testid={dataTestIds.input}
              {...getInputProps({
                value: defaultProps.itemToString(selectedItem),
              })}
            />
            <button
              data-testid={dataTestIds.toggleButton}
              {...getToggleButtonProps()}
            >
              Toggle
            </button>
          </div>
          <ul data-testid={dataTestIds.menu} {...getMenuProps()}>
            {isOpen &&
              (props.items || items).map((item, index) => {
                const stringItem =
                  item instanceof Object
                    ? defaultProps.itemToString(item)
                    : item
                return (
                  <li
                    data-testid={dataTestIds.item(index)}
                    style={
                      highlightedIndex === index
                        ? {backgroundColor: 'blue'}
                        : {}
                    }
                    key={`${stringItem}${index}`}
                    {...getItemProps({item, index})}
                  >
                    {stringItem}
                  </li>
                )
              })}
          </ul>
        </div>
      )
    }

    const setupCustom = props => render(<DropdownCustomCombobox {...props} />)

    test('controls the state property if passed', () => {
      const selectedItem = items[2]
      const wrapper = setupCustom({selectedItem, initialIsOpen: true})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const item = wrapper.getByTestId(dataTestIds.item(3))
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(input.value).toEqual(items[2])

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      fireEvent.keyDown(input, {key: 'Enter'})

      expect(input.value).toEqual(items[2])

      fireEvent.click(toggleButton)
      fireEvent.click(item)
      expect(input.value).toEqual(items[2])
    })

    test('highlightedIndex on open gets computed based on the selectedItem prop value', () => {
      const expectedHighlightedIndex = 2
      const selectedItem = items[expectedHighlightedIndex]
      const wrapper = setupCustom({selectedItem})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const input = wrapper.getByTestId(dataTestIds.input)

      fireEvent.click(toggleButton)
      const item = wrapper.getByTestId(dataTestIds.item(3))

      expect(input.getAttribute('aria-activedescendant')).toBe(
        defaultIds.getItemId(expectedHighlightedIndex),
      )

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      fireEvent.keyDown(input, {key: 'Enter'})

      expect(input.value).toEqual(items[expectedHighlightedIndex])

      fireEvent.click(toggleButton)
      fireEvent.click(item)
      expect(input.value).toEqual(items[expectedHighlightedIndex])
    })

    test('highlightedIndex computed based on the selectedItem prop value in initial state as well', () => {
      const expectedHighlightedIndex = 2
      const selectedItem = items[expectedHighlightedIndex]
      // open dropdown in the initial state to check highlighted index.
      const wrapper = setupCustom({selectedItem, initialIsOpen: true})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const item = wrapper.getByTestId(dataTestIds.item(3))
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(input.getAttribute('aria-activedescendant')).toBe(
        defaultIds.getItemId(expectedHighlightedIndex),
      )

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      fireEvent.keyDown(input, {key: 'Enter'})

      expect(input.value).toEqual(items[expectedHighlightedIndex])

      fireEvent.click(toggleButton)
      fireEvent.click(item)
      expect(input.value).toEqual(items[expectedHighlightedIndex])
    })
  })

  describe('stateReducer', () => {
    // eslint-disable-next-line max-statements
    test('is called at each state change with the appropriate change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const wrapper = setup({stateReducer, isOpen: true})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const input = wrapper.getByTestId(dataTestIds.input)
      const menu = wrapper.getByTestId(dataTestIds.menu)

      expect(stateReducer).not.toHaveBeenCalled()

      fireEvent.click(toggleButton)
      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ToggleButtonClick}),
      )

      fireEvent.change(input, {target: {value: 'c'}})
      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputChange}),
      )

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownArrowDown}),
      )

      fireEvent.keyDown(input, {key: 'ArrowUp'})
      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownArrowUp}),
      )

      fireEvent.keyDown(input, {key: 'End'})
      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownEnd}),
      )

      fireEvent.keyDown(input, {key: 'Home'})
      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownHome}),
      )

      const item = wrapper.getByTestId(dataTestIds.item(1))
      fireEvent.mouseMove(item)
      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ItemMouseMove}),
      )

      fireEvent.mouseLeave(menu)
      expect(stateReducer).toHaveBeenCalledTimes(8)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.MenuMouseLeave}),
      )

      fireEvent.keyDown(input, {key: 'Enter'})
      expect(stateReducer).toHaveBeenCalledTimes(9)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownEnter}),
      )

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      expect(stateReducer).toHaveBeenCalledTimes(10)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownArrowDown}),
      )

      fireEvent.keyDown(input, {key: 'Escape'})
      expect(stateReducer).toHaveBeenCalledTimes(11)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownEscape}),
      )

      fireEvent.click(item)
      expect(stateReducer).toHaveBeenCalledTimes(12)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ItemClick}),
      )
    })

    test('replaces prop values with user defined', () => {
      const inputValue = 'Robin Hood'
      const stateReducer = jest.fn((s, a) => {
        const changes = a.changes
        changes.inputValue = inputValue
        return changes
      })
      const wrapper = setup({stateReducer})
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
      const input = wrapper.getByTestId(dataTestIds.input)

      fireEvent.click(toggleButton)
      expect(input.value).toBe('Robin Hood')
    })

    test('receives a downshift action type', () => {
      const stateReducer = jest.fn((s, a) => {
        expect(a.type).toBe(useCombobox.stateChangeTypes.ToggleButtonClick)
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

    test('changes are visible in onChange handlers', () => {
      const highlightedIndex = 2
      const selectedItem = {foo: 'bar'}
      const isOpen = true
      const stateReducer = jest.fn(() => ({
        highlightedIndex,
        isOpen,
        selectedItem,
      }))
      const onSelectedItemChange = jest.fn()
      const onHighlightedIndexChange = jest.fn()
      const onIsOpenChange = jest.fn()
      const onStateChange = jest.fn()
      const wrapper = setup({
        stateReducer,
        onStateChange,
        onSelectedItemChange,
        onHighlightedIndexChange,
        onIsOpenChange,
      })
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex,
        }),
      )
      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem,
        }),
      )
      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen,
        }),
      )
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen,
          highlightedIndex,
          selectedItem,
        }),
      )
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
          selectedItem: items[0],
        }),
      )
    })

    test('is not called at if selectedItem is the same', () => {
      const onSelectedItemChange = jest.fn()
      const wrapper = setup({
        initialIsOpen: true,
        initialSelectedItem: items[0],
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
      const input = wrapper.getByTestId(dataTestIds.input)

      fireEvent.keyDown(input, {key: 'ArrowDown'})
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
        circularNavigation: false,
      })
      const input = wrapper.getByTestId(dataTestIds.input)

      fireEvent.keyDown(input, {key: 'ArrowUp'})
      expect(onHighlightedIndexChange).not.toHaveBeenCalled()

      fireEvent.keyDown(input, {key: 'Home'})
      expect(onHighlightedIndexChange).not.toHaveBeenCalled()
    })
  })

  describe('onIsOpenChange', () => {
    test('is called at each isOpen change', () => {
      const onIsOpenChange = jest.fn()
      const wrapper = setup({initialIsOpen: true, onIsOpenChange})
      const input = wrapper.getByTestId(dataTestIds.input)

      fireEvent.keyDown(input, {key: 'Escape'})
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
      const input = wrapper.getByTestId(dataTestIds.input)
      const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

      fireEvent.click(toggleButton)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: true,
        }),
      )

      fireEvent.keyDown(input, {key: 'ArrowDown'})
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
        }),
      )

      fireEvent.change(input, {target: {value: 'ArrowDown'}})
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          inputValue: 'ArrowDown',
        }),
      )

      const item = wrapper.getByTestId(dataTestIds.item(0))
      fireEvent.click(item)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[0],
        }),
      )
    })
  })
})
