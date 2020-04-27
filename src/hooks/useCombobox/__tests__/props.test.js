import {renderHook} from '@testing-library/react-hooks'
import {cleanup, act} from '@testing-library/react'
import {renderCombobox, renderUseCombobox} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import {
  items,
  defaultIds,
  waitForDebouncedA11yStatusUpdate,
} from '../../testUtils'
import useCombobox from '..'

jest.useFakeTimers()

describe('props', () => {
  beforeEach(jest.runAllTimers)
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
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'aaa has been selected.',
      )
    })
  })

  describe('itemToString', () => {
    test('should provide string version to a11y status message', () => {
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderCombobox({
        itemToString: () => 'custom-item',
        initialIsOpen: true,
      })

      clickOnItemAtIndex(0)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'custom-item has been selected.',
      )
    })
  })

  describe('getA11ySelectionMessage', () => {
    test('reports that an item has been selected', () => {
      const itemIndex = 0
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderCombobox({
        initialIsOpen: true,
      })

      clickOnItemAtIndex(itemIndex)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        `${items[itemIndex]} has been selected.`,
      )
    })

    test('reports nothing if item is removed', () => {
      const {keyDownOnInput, getA11yStatusContainer} = renderCombobox({
        initialSelectedItem: items[0],
      })

      keyDownOnInput('Escape')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent('')
    })

    test('is called with object that contains specific props', () => {
      const getA11ySelectionMessage = jest.fn()
      const inputValue = 'a'
      const isOpen = true
      const highlightedIndex = 0
      const {clickOnItemAtIndex} = renderCombobox({
        inputValue,
        isOpen,
        highlightedIndex,
        items,
        getA11ySelectionMessage,
      })

      clickOnItemAtIndex(0)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11ySelectionMessage).toHaveBeenCalledWith({
        inputValue,
        isOpen,
        highlightedIndex,
        resultCount: items.length,
        highlightedItem: items[0],
        itemToString: expect.any(Function),
        selectedItem: items[0],
        previousResultCount: undefined,
      })
    })

    test('is replaced with the user provided one', () => {
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderCombobox({
        isOpen: true,
        getA11ySelectionMessage: () => 'custom message',
      })

      clickOnItemAtIndex(3)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })
  })

  describe('getA11yStatusMessage', () => {
    test('reports that no results are available if items list is empty', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        items: [],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'No results are available',
      )
    })

    test('reports that one result is available if one item is shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        items: ['bla'],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        '1 result is available, use up and down arrow keys to navigate. Press Enter key to select.',
      )
    })

    test('reports the number of results available if more than one item are shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        items: ['bla', 'blabla'],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

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
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent('')
    })

    test('is removed after 500ms as a cleanup', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox()

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()
      act(() => jest.advanceTimersByTime(500))

      expect(getA11yStatusContainer()).toHaveTextContent('')
    })

    test('is replaced with the user provided one', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderCombobox({
        getA11yStatusMessage: () => 'custom message',
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })

    test('is called with previousResultCount that gets updated correctly', () => {
      const getA11yStatusMessage = jest.fn()
      const inputItems = ['aaa', 'bbb']
      const {clickOnToggleButton, changeInputValue} = renderCombobox({
        getA11yStatusMessage,
        items: inputItems,
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          previousResultCount: undefined,
          resultCount: inputItems.length,
        }),
      )

      inputItems.pop()
      changeInputValue('a')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledTimes(2)
      expect(getA11yStatusMessage).toHaveBeenLastCalledWith(
        expect.objectContaining({
          previousResultCount: inputItems.length + 1,
          resultCount: inputItems.length,
        }),
      )
    })

    test('is called with object that contains specific props at toggle', () => {
      const getA11yStatusMessage = jest.fn()
      const inputValue = 'a'
      const highlightedIndex = 1
      const initialSelectedItem = items[highlightedIndex]
      const {clickOnToggleButton} = renderCombobox({
        inputValue,
        initialSelectedItem,
        items,
        getA11yStatusMessage,
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith({
        highlightedIndex,
        inputValue,
        isOpen: true,
        itemToString: expect.any(Function),
        previousResultCount: undefined,
        resultCount: items.length,
        highlightedItem: items[highlightedIndex],
        selectedItem: items[highlightedIndex],
      })
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
      waitForDebouncedA11yStatusUpdate()

      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
    })
  })

  describe('highlightedIndex', () => {
    test('controls the state property if passed', () => {
      const highlightedIndex = 1
      const expectedItemId = defaultIds.getItemId(highlightedIndex)
      const {keyDownOnInput, input} = renderCombobox({
        isOpen: true,
        highlightedIndex,
      })

      expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)

      keyDownOnInput('ArrowDown')

      expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)

      keyDownOnInput('End')

      expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)

      keyDownOnInput('ArrowUp')

      expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)
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

    test('is changed once a new selectedItem comes from props', () => {
      const initialSelectedItem = 'John Doe'
      const finalSelectedItem = 'John Wick'
      const {rerenderWithProps, input} = renderCombobox({
        isOpen: true,
        selectedItem: initialSelectedItem,
      })

      expect(input).toHaveValue(initialSelectedItem)

      rerenderWithProps({selectedItem: finalSelectedItem})

      expect(input).toHaveValue(finalSelectedItem)
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
      const selectedItem = items[2]
      const {
        keyDownOnInput,
        input,
        clickOnItemAtIndex,
        clickOnToggleButton,
      } = renderCombobox({
        selectedItem,
        initialIsOpen: true,
      })

      expect(input).toHaveValue(selectedItem)

      keyDownOnInput('ArrowDown')
      keyDownOnInput('Enter')
      clickOnToggleButton()

      expect(input).toHaveValue(selectedItem)

      keyDownOnInput('ArrowUp')
      keyDownOnInput('Enter')
      clickOnToggleButton()

      expect(input).toHaveValue(selectedItem)

      keyDownOnInput('Escape')
      clickOnToggleButton()

      expect(input).toHaveValue(selectedItem)

      clickOnItemAtIndex(1)
      clickOnToggleButton()

      expect(input).toHaveValue(selectedItem)
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
        expect.objectContaining({isOpen: false}),
        expect.objectContaining({
          changes: expect.objectContaining({
            isOpen: true,
          }),
          type: stateChangeTypes.ToggleButtonClick,
        }),
      )

      changeInputValue('c')

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          inputValue: '',
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            inputValue: 'c',
          }),
          type: stateChangeTypes.InputChange,
        }),
      )

      mouseMoveItemAtIndex(1)

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            highlightedIndex: 1,
          }),
          type: stateChangeTypes.ItemMouseMove,
        }),
      )

      clickOnItemAtIndex(1)

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 1,
          isOpen: true,
          selectedItem: null,
          inputValue: 'c',
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            isOpen: false,
            highlightedIndex: -1,
            selectedItem: items[1],
            inputValue: items[1],
          }),
          type: stateChangeTypes.ItemClick,
        }),
      )

      keyDownOnInput('ArrowDown')

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          highlightedIndex: -1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({isOpen: true, highlightedIndex: 2}),
          type: stateChangeTypes.InputKeyDownArrowDown,
        }),
      )

      keyDownOnInput('End')

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 2,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            highlightedIndex: items.length - 1,
          }),
          type: stateChangeTypes.InputKeyDownEnd,
        }),
      )

      mouseLeaveMenu()

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: items.length - 1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            highlightedIndex: -1,
          }),
          type: stateChangeTypes.MenuMouseLeave,
        }),
      )

      keyDownOnInput('Home')

      expect(stateReducer).toHaveBeenCalledTimes(8)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            highlightedIndex: 0,
          }),
          type: stateChangeTypes.InputKeyDownHome,
        }),
      )

      keyDownOnInput('Enter')

      expect(stateReducer).toHaveBeenCalledTimes(9)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          selectedItem: items[1],
          isOpen: true,
          inputValue: items[1],
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            highlightedIndex: -1,
            isOpen: false,
            inputValue: items[0],
            selectedItem: items[0],
          }),
          type: stateChangeTypes.InputKeyDownEnter,
        }),
      )

      keyDownOnInput('Escape')

      expect(stateReducer).toHaveBeenCalledTimes(10)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          inputValue: items[0],
          selectedItem: items[0],
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            inputValue: '',
            selectedItem: null,
          }),
          type: stateChangeTypes.InputKeyDownEscape,
        }),
      )

      keyDownOnInput('ArrowUp')

      expect(stateReducer).toHaveBeenCalledTimes(11)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          highlightedIndex: -1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            highlightedIndex: items.length - 1,
            isOpen: true,
          }),
          type: stateChangeTypes.InputKeyDownArrowUp,
        }),
      )

      blurInput()

      expect(stateReducer).toHaveBeenCalledTimes(12)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: items.length - 1,
          isOpen: true,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItem: items[items.length - 1],
            inputValue: items[items.length - 1],
            isOpen: false,
            highlightedIndex: -1,
          }),
          type: stateChangeTypes.InputBlur,
        }),
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
      const inputValue = 'test'
      const stateReducer = jest.fn(() => ({
        highlightedIndex,
        isOpen,
        selectedItem,
        inputValue,
      }))
      const onInputValueChange = jest.fn()
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
        onInputValueChange,
      })

      clickOnToggleButton()

      expect(onInputValueChange).toHaveBeenCalledTimes(1)
      expect(onInputValueChange).toHaveBeenCalledWith(
        expect.objectContaining({
          inputValue,
        }),
      )
      expect(onHighlightedIndexChange).toHaveBeenCalledTimes(1)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex,
        }),
      )
      expect(onSelectedItemChange).toHaveBeenCalledTimes(1)
      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem,
        }),
      )
      expect(onIsOpenChange).toHaveBeenCalledTimes(1)
      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen,
        }),
      )
      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen,
          type: stateChangeTypes.ToggleButtonClick,
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
      const {
        clickOnToggleButton,
        changeInputValue,
        clickOnItemAtIndex,
        mouseLeaveMenu,
        mouseMoveItemAtIndex,
        keyDownOnInput,
        blurInput,
      } = renderCombobox({onStateChange})

      clickOnToggleButton()

      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: true,
          type: stateChangeTypes.ToggleButtonClick,
        }),
      )

      changeInputValue('t')

      expect(onStateChange).toHaveBeenCalledTimes(2)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          inputValue: 't',
          type: stateChangeTypes.InputChange,
        }),
      )

      mouseMoveItemAtIndex(1)

      expect(onStateChange).toHaveBeenCalledTimes(3)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 1,
          type: stateChangeTypes.ItemMouseMove,
        }),
      )

      clickOnItemAtIndex(2)

      expect(onStateChange).toHaveBeenCalledTimes(4)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItem: items[2],
          highlightedIndex: -1,
          inputValue: items[2],
          type: stateChangeTypes.ItemClick,
        }),
      )

      keyDownOnInput('ArrowDown')

      expect(onStateChange).toHaveBeenCalledTimes(5)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 3,
          type: stateChangeTypes.InputKeyDownArrowDown,
        }),
      )

      keyDownOnInput('End')

      expect(onStateChange).toHaveBeenCalledTimes(6)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: items.length - 1,
          type: stateChangeTypes.InputKeyDownEnd,
        }),
      )

      keyDownOnInput('Home')

      expect(onStateChange).toHaveBeenCalledTimes(7)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          type: stateChangeTypes.InputKeyDownHome,
        }),
      )

      keyDownOnInput('Enter')

      expect(onStateChange).toHaveBeenCalledTimes(8)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
          selectedItem: items[0],
          inputValue: items[0],
          type: stateChangeTypes.InputKeyDownEnter,
        }),
      )

      keyDownOnInput('Escape')

      expect(onStateChange).toHaveBeenCalledTimes(9)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItem: null,
          inputValue: '',
          type: stateChangeTypes.InputKeyDownEscape,
        }),
      )

      keyDownOnInput('ArrowUp')

      expect(onStateChange).toHaveBeenCalledTimes(10)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 25,
          isOpen: true,
          type: stateChangeTypes.InputKeyDownArrowUp,
        }),
      )

      mouseLeaveMenu()

      expect(onStateChange).toHaveBeenCalledTimes(11)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
          type: stateChangeTypes.MenuMouseLeave,
        }),
      )

      blurInput()

      expect(onStateChange).toHaveBeenCalledTimes(12)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.InputBlur,
        }),
      )
    })
  })
})
