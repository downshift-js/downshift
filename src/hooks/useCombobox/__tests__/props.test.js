import {renderHook} from '@testing-library/react-hooks'
import {cleanup, act} from '@testing-library/react'
import {renderCombobox, renderUseCombobox} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import {items, defaultIds} from '../../testUtils'
import useCombobox from '..'

jest.useFakeTimers()

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
      const {toggleButton, menu, label, input} = renderCombobox({
        id: 'my-custom-little-id',
      })

      ;[(toggleButton, menu, label, input)].forEach(element => {
        expect(element).toHaveAttribute(
          'id',
          expect.stringContaining('my-custom-little-id'),
        )
      })
    })
  })

  describe('items', () => {
    test('if passed as empty then menu will not open', () => {
      const {getItems} = renderCombobox({items: [], isOpen: true})

      expect(getItems()).toHaveLength(0)
    })

    test('passed as objects should work with custom itemToString', () => {
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderCombobox({
        items: [{str: 'aaa'}, {str: 'bbb'}],
        itemToString: item => item.str,
        initialIsOpen: true,
      })

      clickOnItemAtIndex(0)

      expect(getA11yStatusContainer()).toHaveTextContent(
        'aaa has been selected.',
      )
    })
  })

  describe('itemToString', () => {
    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('should provide string version to a11y status message', () => {
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderCombobox({
        itemToString: () => 'custom-item',
        initialIsOpen: true,
      })

      clickOnItemAtIndex(0)

      expect(getA11yStatusContainer()).toHaveTextContent(
        'custom-item has been selected.',
      )
    })
  })

  describe('getA11ySelectionMessage', () => {
    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('is called with isOpen, resultCount, itemToString and selectedItem at selection', () => {
      const getA11ySelectionMessage = jest.fn()
      const {clickOnItemAtIndex} = renderCombobox({
        getA11ySelectionMessage,
        isOpen: true,
        items: [{str: 'ala'}],
      })

      clickOnItemAtIndex(0)

      expect(getA11ySelectionMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          itemToString: expect.any(Function),
          selectedItem: expect.any(Object),
          resultCount: expect.any(Number),
          isOpen: expect.any(Boolean),
        }),
      )
    })

    test('is replaced with the user provided one', () => {
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderCombobox({
        isOpen: true,
        getA11ySelectionMessage: () => 'custom message',
      })

      clickOnItemAtIndex(3)

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })
  })

  describe('getA11yStatusMessage', () => {
    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('reports that no results are available if items list is empty', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        items: [],
      })

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(100))

      expect(getA11yStatusContainer()).toHaveTextContent(
        'No results are available',
      )
    })

    test('reports that one result is available if one item is shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        items: ['bla'],
      })

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(100))

      expect(getA11yStatusContainer()).toHaveTextContent(
        '1 result is available, use up and down arrow keys to navigate. Press Enter key to select.',
      )
    })

    test('reports the number of results available if more than one item are shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        items: ['bla', 'blabla'],
      })

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(100))

      expect(getA11yStatusContainer()).toHaveTextContent(
        '2 results are available, use up and down arrow keys to navigate. Press Enter key to select.',
      )
    })

    test('is empty on menu close', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        items: ['bla', 'blabla'],
        initialIsOpen: true,
      })

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(100))

      expect(getA11yStatusContainer()).toHaveTextContent('')
    })

    test('is removed after 500ms as a cleanup', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox()

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(500))

      expect(getA11yStatusContainer()).toHaveTextContent('')
    })

    test('is replaced with the user provided one', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        getA11yStatusMessage: () => 'custom message',
      })

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(100))

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })

    test('is called with isOpen, resultCount, itemToString and selectedItem at toggle', () => {
      const getA11yStatusMessage = jest.fn()
      const {clickOnToggleButton} = renderCombobox({
        getA11yStatusMessage,
      })

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(100))

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          resultCount: expect.any(Number),
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
      const {clickOnToggleButton} = renderCombobox({items: [], environment})

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(100))

      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
    })
  })

  describe('highlightedIndex', () => {
    test('controls the state property if passed', () => {
      const highlightedIndex = 1
      const {keyDownOnInput, input} = renderCombobox({
        isOpen: true,
        highlightedIndex,
      })

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnInput('ArrowDown')

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnInput('End')

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnInput('ArrowUp')

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )
    })
  })

  describe('inputValue', () => {
    test('controls the state property if passed', () => {
      const {
        keyDownOnInput,
        input,
        blurInput,
        clickOnItemAtIndex,
      } = renderCombobox({isOpen: true, inputValue: 'Dohn Joe'})

      keyDownOnInput('ArrowDown')
      keyDownOnInput('Enter')

      expect(input.value).toBe('Dohn Joe')

      clickOnItemAtIndex(0)

      expect(input.value).toBe('Dohn Joe')

      keyDownOnInput('ArrowUp')
      keyDownOnInput('Enter')

      expect(input.value).toBe('Dohn Joe')

      blurInput()

      expect(input.value).toBe('Dohn Joe')
    })
  })

  describe('isOpen', () => {
    test('controls the state property if passed', () => {
      const {
        clickOnToggleButton,
        getItems,
        blurInput,
        keyDownOnInput,
      } = renderCombobox({isOpen: true})

      expect(getItems()).toHaveLength(items.length)

      clickOnToggleButton()

      expect(getItems()).toHaveLength(items.length)

      keyDownOnInput('Escape')

      expect(getItems()).toHaveLength(items.length)

      blurInput()

      expect(getItems()).toHaveLength(items.length)
    })
  })

  describe('selectedItem', () => {
    test('controls the state property if passed', () => {
      const highlightedIndex = 2
      const selectedItem = items[highlightedIndex]
      const {keyDownOnInput, input, clickOnToggleButton} = renderCombobox({
        selectedItem,
        initialIsOpen: true,
      })

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnInput('ArrowDown')
      keyDownOnInput('Enter')
      clickOnToggleButton()

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnInput('ArrowUp')
      keyDownOnInput('Enter')
      clickOnToggleButton()

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnInput('Escape')
      clickOnToggleButton()

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )
    })
  })

  describe('stateReducer', () => {
    test('is called at each state change with the function change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {result} = renderUseCombobox({stateReducer})

      result.current.toggleMenu()

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionToggleMenu}),
      )

      result.current.openMenu()

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionOpenMenu}),
      )

      result.current.closeMenu()

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionCloseMenu}),
      )

      result.current.reset()

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionReset}),
      )

      result.current.selectItem({})

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionSelectItem}),
      )

      result.current.setHighlightedIndex(5)

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.FunctionSetHighlightedIndex,
        }),
      )

      result.current.setInputValue({})

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionSetInputValue}),
      )
    })

    // eslint-disable-next-line max-statements
    test('is called at each state change with the appropriate change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {
        clickOnToggleButton,
        changeInputValue,
        clickOnItemAtIndex,
        mouseLeaveMenu,
        mouseMoveItemAtIndex,
        keyDownOnInput,
        blurInput,
      } = renderCombobox({stateReducer})

      expect(stateReducer).not.toHaveBeenCalled()

      clickOnToggleButton()

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ToggleButtonClick}),
      )

      changeInputValue('c')

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputChange}),
      )

      clickOnItemAtIndex(1)

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ItemClick}),
      )

      keyDownOnInput('ArrowDown')

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownArrowDown}),
      )

      keyDownOnInput('End')

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownEnd}),
      )

      keyDownOnInput('Home')

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownHome}),
      )

      mouseMoveItemAtIndex(2)

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ItemMouseMove}),
      )

      mouseLeaveMenu()

      expect(stateReducer).toHaveBeenCalledTimes(8)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.MenuMouseLeave}),
      )

      keyDownOnInput('Enter')

      expect(stateReducer).toHaveBeenCalledTimes(9)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownEnter}),
      )

      keyDownOnInput('Escape')

      expect(stateReducer).toHaveBeenCalledTimes(10)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownEscape}),
      )

      keyDownOnInput('ArrowUp')

      expect(stateReducer).toHaveBeenCalledTimes(11)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputKeyDownArrowUp}),
      )

      blurInput()

      expect(stateReducer).toHaveBeenCalledTimes(12)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.InputBlur}),
      )
    })

    test('replaces prop values with user defined', () => {
      const inputValue = 'Robin Hood'
      const stateReducer = jest.fn((s, a) => {
        const changes = a.changes
        changes.inputValue = inputValue
        return changes
      })
      const {clickOnToggleButton, input} = renderCombobox({stateReducer})

      clickOnToggleButton()
      expect(input.value).toBe('Robin Hood')
    })

    test('receives a downshift action type', () => {
      const stateReducer = jest.fn((s, a) => {
        expect(a.type).toBe(useCombobox.stateChangeTypes.ToggleButtonClick)
        return a.changes
      })
      const {clickOnToggleButton} = renderCombobox({stateReducer})

      clickOnToggleButton()
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
      const {clickOnToggleButton} = renderCombobox({stateReducer})

      clickOnToggleButton()
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
      const {clickOnToggleButton} = renderCombobox({
        stateReducer,
        onStateChange,
        onSelectedItemChange,
        onHighlightedIndexChange,
        onIsOpenChange,
      })

      clickOnToggleButton()

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
      const itemIndex = 0
      const onSelectedItemChange = jest.fn()
      const {clickOnItemAtIndex} = renderCombobox({
        initialIsOpen: true,
        onSelectedItemChange,
      })

      clickOnItemAtIndex(itemIndex)

      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[itemIndex],
        }),
      )
    })

    test('is not called at if selectedItem is the same', () => {
      const itemIndex = 0
      const onSelectedItemChange = jest.fn()
      const {clickOnItemAtIndex} = renderCombobox({
        initialIsOpen: true,
        initialSelectedItem: items[itemIndex],
        onSelectedItemChange,
      })

      clickOnItemAtIndex(itemIndex)

      expect(onSelectedItemChange).not.toHaveBeenCalled()
    })
  })

  describe('onHighlightedIndexChange', () => {
    test('is called at each highlightedIndex change', () => {
      const onHighlightedIndexChange = jest.fn()
      const {keyDownOnInput} = renderCombobox({
        initialIsOpen: true,
        onHighlightedIndexChange,
      })

      keyDownOnInput('ArrowDown')

      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
        }),
      )
    })

    test('is not called if highlightedIndex is the same', () => {
      const onHighlightedIndexChange = jest.fn()
      const {keyDownOnInput, mouseMoveItemAtIndex} = renderCombobox({
        initialIsOpen: true,
        initialHighlightedIndex: 0,
        onHighlightedIndexChange,
        circularNavigation: false,
      })

      keyDownOnInput('ArrowUp')

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()

      keyDownOnInput('Home')

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()

      mouseMoveItemAtIndex(0)

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()
    })
  })

  describe('onIsOpenChange', () => {
    test('is called at each isOpen change', () => {
      const onIsOpenChange = jest.fn()
      const {keyDownOnInput} = renderCombobox({
        initialIsOpen: true,
        onIsOpenChange,
      })

      keyDownOnInput('Escape')

      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: false,
        }),
      )
    })

    test('is not called at if isOpen is the same', () => {
      const onIsOpenChange = jest.fn()
      const {clickOnItemAtIndex} = renderCombobox({
        defaultIsOpen: true,
        onIsOpenChange,
      })

      clickOnItemAtIndex(0)

      expect(onIsOpenChange).not.toHaveBeenCalledWith()
    })
  })

  describe('onStateChange', () => {
    test('is called at each state property change', () => {
      const onStateChange = jest.fn()
      const inputChange = 'test input'
      const itemClickIndex = 0
      const {
        clickOnToggleButton,
        changeInputValue,
        keyDownOnInput,
        clickOnItemAtIndex,
      } = renderCombobox({onStateChange})

      clickOnToggleButton()

      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: true,
        }),
      )

      keyDownOnInput('ArrowDown')

      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
        }),
      )

      changeInputValue(inputChange)

      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          inputValue: inputChange,
        }),
      )

      clickOnItemAtIndex(itemClickIndex)

      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[itemClickIndex],
        }),
      )
    })
  })
})
