/* eslint-disable no-console */
import {renderHook, act as hooksAct} from '@testing-library/react-hooks'
import {act} from '@testing-library/react'
import {renderSelect, renderUseSelect} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import {
  items,
  defaultIds,
  waitForDebouncedA11yStatusUpdate,
} from '../../testUtils'
import useSelect from '..'

describe('props', () => {
  test('if falsy then prop types error is thrown', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => useSelect())

    expect(global.console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Warning: Failed prop type: The prop \`items\` is marked as required in \`useSelect\`, but its value is \`undefined\`."`,
    )
  })

  describe('id', () => {
    test('if passed will override downshift default', () => {
      const {toggleButton, menu, label} = renderSelect({
        id: 'my-custom-little-id',
      })

      ;[(toggleButton, menu, label)].forEach(element => {
        expect(element).toHaveAttribute(
          'id',
          expect.stringContaining('my-custom-little-id'),
        )
      })
    })
  })

  describe('items', () => {
    test('if passed as empty then menu will not open', () => {
      const {getItems} = renderSelect({items: [], isOpen: true})

      expect(getItems()).toHaveLength(0)
    })

    test('passed as objects should work with custom itemToString', () => {
      jest.useFakeTimers()
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderSelect({
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
      jest.useFakeTimers()
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderSelect({
        itemToString: () => 'custom-item',
        initialIsOpen: true,
      })

      clickOnItemAtIndex(0)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'custom-item has been selected.',
      )
      jest.useRealTimers()
    })
  })

  describe('getA11ySelectionMessage', () => {
    beforeEach(jest.useFakeTimers)
    beforeEach(jest.clearAllTimers)
    afterAll(jest.useRealTimers)

    test('reports that an item has been selected', () => {
      const itemIndex = 0
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderSelect({
        initialIsOpen: true,
      })

      clickOnItemAtIndex(itemIndex)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        `${items[itemIndex]} has been selected.`,
      )
    })

    test('is called with object that contains specific props', () => {
      const getA11ySelectionMessage = jest.fn()
      const inputValue = 'a'
      const isOpen = true
      const highlightedIndex = 0
      const {clickOnItemAtIndex} = renderSelect({
        getA11ySelectionMessage,
        inputValue,
        isOpen,
        highlightedIndex,
        items,
      })

      clickOnItemAtIndex(0)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11ySelectionMessage).toHaveBeenCalledTimes(1)
      expect(getA11ySelectionMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          inputValue,
          isOpen,
          highlightedIndex,
          resultCount: items.length,
          previousResultCount: undefined,
          highlightedItem: items[0],
          itemToString: expect.any(Function),
          selectedItem: items[0],
        }),
      )
    })

    test('is replaced with the user provided one', () => {
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderSelect({
        getA11ySelectionMessage: () => 'custom message',
        initialIsOpen: true,
      })

      clickOnItemAtIndex(3)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })
  })

  describe('getA11yStatusMessage', () => {
    beforeEach(jest.useFakeTimers)
    afterEach(() => {
      act(jest.runAllTimers)
    })
    afterAll(jest.useRealTimers)

    test('reports that no results are available if items list is empty', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: [],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'No results are available',
      )
    })

    test('reports that one result is available if one item is shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: ['item1'],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        '1 result is available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.',
      )
    })

    test('reports the number of results available if more than one item are shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: ['item1', 'item2'],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        '2 results are available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.',
      )
    })

    test('is empty on menu close', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: ['item1', 'item2'],
        initialIsOpen: true,
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
    })

    test('is removed after 500ms as a cleanup', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: ['item1', 'item2'],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()
      act(() => jest.advanceTimersByTime(500))

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
    })

    test('is replaced with the user provided one', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        getA11yStatusMessage: () => 'custom message',
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })

    test('is called with previousResultCount that gets updated correctly', () => {
      const getA11yStatusMessage = jest.fn()
      const inputItems = ['aaa', 'bbb']
      const {clickOnToggleButton, keyDownOnMenu} = renderSelect({
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
      keyDownOnMenu('ArrowDown')
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
      const {clickOnToggleButton} = renderSelect({
        getA11yStatusMessage,
        inputValue,
        initialSelectedItem,
        selectedItem: items[highlightedIndex],
      })

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex,
          inputValue,
          isOpen: true,
          itemToString: expect.any(Function),
          previousResultCount: undefined,
          resultCount: items.length,
          highlightedItem: items[highlightedIndex],
          selectedItem: items[highlightedIndex],
        }),
      )
    })

    test('is added to the document provided by the user as prop', () => {
      const environment = {
        document: {
          getElementById: jest.fn(() => ({setAttribute: jest.fn(), style: {}})),
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }
      const {clickOnToggleButton} = renderSelect({items: [], environment})

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
    })

    test('is called when isOpen, highlightedIndex, inputValue or items change', () => {
      const getA11yStatusMessage = jest.fn()
      const inputItems = ['aaa', 'bbb']
      const {clickOnToggleButton, rerender, keyDownOnMenu} = renderSelect({
        getA11yStatusMessage,
        items,
      })

      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).not.toHaveBeenCalled()

      // should not be called when any other prop is changed.
      rerender({getA11yStatusMessage, items, circularNavigation: true})
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).not.toHaveBeenCalled()

      rerender({getA11yStatusMessage, items: inputItems})
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({resultCount: inputItems.length}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)

      clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({isOpen: true}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(2)

      keyDownOnMenu('b')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({inputValue: 'b', highlightedIndex: 1}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(3)

      keyDownOnMenu('ArrowUp')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({highlightedIndex: 0}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(4)
    })
  })

  describe('highlightedIndex', () => {
    test('controls the state property if passed', () => {
      const highlightedIndex = 1
      const {keyDownOnToggleButton, keyDownOnMenu, menu} = renderSelect({
        isOpen: true,
        highlightedIndex,
      })

      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnToggleButton('ArrowDown')
      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnMenu('End')
      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnMenu('ArrowUp')
      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )

      keyDownOnMenu('c')
      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )
    })
  })

  describe('isOpen', () => {
    test('controls the state property if passed', () => {
      const {
        clickOnToggleButton,
        keyDownOnMenu,
        blurMenu,
        getItems,
      } = renderSelect({isOpen: true})
      expect(getItems()).toHaveLength(items.length)

      clickOnToggleButton()
      expect(getItems()).toHaveLength(items.length)

      keyDownOnMenu('Escape')
      expect(getItems()).toHaveLength(items.length)

      blurMenu()
      expect(getItems()).toHaveLength(items.length)
    })
  })

  describe('selectedItem', () => {
    test('controls the state property if passed', () => {
      const selectedItem = items[2]
      const {
        toggleButton,
        keyDownOnToggleButton,
        clickOnItemAtIndex,
      } = renderSelect({selectedItem, isOpen: true})

      expect(toggleButton).toHaveTextContent(items[2])

      keyDownOnToggleButton('ArrowDown')
      keyDownOnToggleButton('Enter')

      expect(toggleButton).toHaveTextContent(items[2])

      clickOnItemAtIndex(4)

      expect(toggleButton).toHaveTextContent(items[2])
    })

    test('highlightedIndex on open gets computed based on the selectedItem prop value', () => {
      const expectedHighlightedIndex = 2
      const selectedItem = items[expectedHighlightedIndex]
      const {
        clickOnToggleButton,
        clickOnItemAtIndex,
        keyDownOnToggleButton,
        toggleButton,
        menu,
        keyDownOnMenu,
      } = renderSelect({selectedItem})

      clickOnToggleButton()

      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(expectedHighlightedIndex),
      )

      keyDownOnToggleButton('ArrowDown')
      keyDownOnMenu('Enter')

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])

      clickOnToggleButton()
      clickOnItemAtIndex(3)

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])
    })

    test('highlightedIndex computed based on the selectedItem prop value in initial state as well', () => {
      const expectedHighlightedIndex = 2
      const selectedItem = items[expectedHighlightedIndex]
      // open dropdown in the initial state to check highlighted index.
      const {
        clickOnItemAtIndex,
        clickOnToggleButton,
        keyDownOnMenu,
        toggleButton,
        menu,
      } = renderSelect({selectedItem, initialIsOpen: true})

      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(expectedHighlightedIndex),
      )

      keyDownOnMenu('ArrowDown')
      keyDownOnMenu('Enter')

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])
      clickOnToggleButton()
      clickOnItemAtIndex(3)

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])
    })
  })

  describe('stateReducer', () => {
    beforeEach(jest.useFakeTimers)
    afterEach(() => {
      hooksAct(() => jest.runAllTimers())
    })
    afterAll(jest.useRealTimers)

    test('is called at each state change with the function change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {result} = renderUseSelect({stateReducer})

      hooksAct(() => {
        result.current.toggleMenu()
      })

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionToggleMenu}),
      )

      hooksAct(() => {
        result.current.openMenu()
      })

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionOpenMenu}),
      )

      hooksAct(() => {
        result.current.closeMenu()
      })

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionCloseMenu}),
      )

      hooksAct(() => {
        result.current.reset()
      })

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionReset}),
      )

      hooksAct(() => {
        result.current.selectItem({})
      })

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionSelectItem}),
      )

      hooksAct(() => {
        result.current.setHighlightedIndex(5)
      })

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.FunctionSetHighlightedIndex,
        }),
      )

      hooksAct(() => {
        result.current.setInputValue({})
      })

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionSetInputValue}),
      )
    })

    test('is called at each state change with the appropriate change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {
        clickOnToggleButton,
        blurMenu,
        mouseLeaveMenu,
        keyDownOnToggleButton,
        keyDownOnMenu,
        mouseMoveItemAtIndex,
        clickOnItemAtIndex,
      } = renderSelect({stateReducer})
      const initialState = {
        isOpen: false,
        highlightedIndex: -1,
        selectedItem: null,
        inputValue: '',
      }
      const testCases = [
        {
          step: clickOnToggleButton,
          state: {
            isOpen: true,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.ToggleButtonClick,
        },
        {
          step: keyDownOnMenu,
          args: 'c',
          state: {
            isOpen: true,
            highlightedIndex: 3,
            inputValue: 'c',
            selectedItem: null,
          },
          type: stateChangeTypes.MenuKeyDownCharacter,
        },
        {
          step: keyDownOnMenu,
          args: 'ArrowDown',
          state: {
            isOpen: true,
            highlightedIndex: 4,
            inputValue: 'c',
            selectedItem: null,
          },
          type: stateChangeTypes.MenuKeyDownArrowDown,
        },
        {
          step: keyDownOnMenu,
          args: 'ArrowUp',
          state: {
            isOpen: true,
            highlightedIndex: 3,
            inputValue: 'c',
            selectedItem: null,
          },
          type: stateChangeTypes.MenuKeyDownArrowUp,
        },
        {
          step: keyDownOnMenu,
          args: 'End',
          state: {
            isOpen: true,
            highlightedIndex: items.length - 1,
            inputValue: 'c',
            selectedItem: null,
          },
          type: stateChangeTypes.MenuKeyDownEnd,
        },
        {
          step: keyDownOnMenu,
          args: 'Home',
          state: {
            isOpen: true,
            highlightedIndex: 0,
            inputValue: 'c',
            selectedItem: null,
          },
          type: stateChangeTypes.MenuKeyDownHome,
        },
        {
          step: keyDownOnMenu,
          args: 'Enter',
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: 'c',
            selectedItem: items[0],
          },
          type: stateChangeTypes.MenuKeyDownEnter,
        },
        {
          step: keyDownOnToggleButton,
          args: 'o',
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: 'co',
            selectedItem: items[19],
          },
          type: stateChangeTypes.ToggleButtonKeyDownCharacter,
        },
        {
          step: keyDownOnToggleButton,
          args: 'ArrowDown',
          state: {
            isOpen: true,
            highlightedIndex: 20,
            inputValue: 'co',
            selectedItem: items[19],
          },
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        },
        {
          step: clickOnItemAtIndex,
          args: 10,
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: 'co',
            selectedItem: items[10],
          },
          type: stateChangeTypes.ItemClick,
        },
        {
          step: keyDownOnToggleButton,
          args: 'ArrowUp',
          state: {
            isOpen: true,
            highlightedIndex: 9,
            inputValue: 'co',
            selectedItem: items[10],
          },
          type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
        },
        {
          step: mouseMoveItemAtIndex,
          args: 6,
          state: {
            isOpen: true,
            highlightedIndex: 6,
            inputValue: 'co',
            selectedItem: items[10],
          },
          type: stateChangeTypes.ItemMouseMove,
        },
        {
          step: mouseLeaveMenu,
          state: {
            isOpen: true,
            highlightedIndex: -1,
            inputValue: 'co',
            selectedItem: items[10],
          },
          type: stateChangeTypes.MenuMouseLeave,
        },
        {
          step: blurMenu,
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: 'co',
            selectedItem: items[10],
          },
          type: stateChangeTypes.MenuBlur,
        },
        {
          step: keyDownOnToggleButton,
          args: 'ArrowUp',
          state: {
            isOpen: true,
            highlightedIndex: 9,
            inputValue: 'co',
            selectedItem: items[10],
          },
          type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
        },
        {
          step: keyDownOnMenu,
          args: ' ',
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: 'co',
            selectedItem: items[9],
          },
          type: stateChangeTypes.MenuKeyDownSpaceButton,
        },
        {
          step: () => act(() => jest.runAllTimers()),
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: items[9],
          },
          type: stateChangeTypes.FunctionSetInputValue,
        },
      ]

      expect(stateReducer).not.toHaveBeenCalled()

      for (let index = 0; index < testCases.length; index++) {
        const {step, state, args, type} = testCases[index]
        const previousState = testCases[index - 1]?.state ?? initialState

        step(args)

        expect(stateReducer).toHaveBeenCalledTimes(index + 1)
        expect(stateReducer).toHaveBeenLastCalledWith(
          previousState,
          expect.objectContaining({changes: state, type}),
        )
      }
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
      const {clickOnToggleButton} = renderSelect({stateReducer})

      clickOnToggleButton()
    })

    // should check that no blur state change occurs after item selection.
    // https://github.com/downshift-js/downshift/issues/965
    test('is called only once on item selection', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {
        clickOnToggleButton,
        keyDownOnMenu,
        clickOnItemAtIndex,
      } = renderSelect({stateReducer, initialIsOpen: true})

      clickOnItemAtIndex(0)

      expect(stateReducer).toHaveBeenCalledTimes(1)

      clickOnToggleButton()
      keyDownOnMenu('ArrowDown')
      keyDownOnMenu('Enter')

      expect(stateReducer).toHaveBeenCalledTimes(4)

      clickOnToggleButton()
      keyDownOnMenu('ArrowDown')
      keyDownOnMenu(' ')

      expect(stateReducer).toHaveBeenCalledTimes(7)
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
      const {clickOnToggleButton} = renderSelect({
        stateReducer,
        onStateChange,
        onSelectedItemChange,
        onHighlightedIndexChange,
        onIsOpenChange,
      })

      clickOnToggleButton()

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
      const onSelectedItemChange = jest.fn()
      const index = 2
      const {clickOnItemAtIndex} = renderSelect({
        initialIsOpen: true,
        onSelectedItemChange,
      })

      clickOnItemAtIndex(index)

      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[index],
          type: stateChangeTypes.ItemClick,
        }),
      )
    })

    test('is not called at if selectedItem is the same', () => {
      const index = 1
      const onSelectedItemChange = jest.fn()
      const {clickOnItemAtIndex} = renderSelect({
        initialIsOpen: true,
        initialSelectedItem: items[index],
        onSelectedItemChange,
      })

      clickOnItemAtIndex(index)

      expect(onSelectedItemChange).not.toHaveBeenCalled()
    })

    test('works correctly with the corresponding control prop', () => {
      let selectedItem = items[2]
      const selectionIndex = 3
      const {clickOnItemAtIndex, toggleButton, rerender} = renderSelect({
        initialIsOpen: true,
        selectedItem,
        onSelectedItemChange: changes => {
          selectedItem = changes.selectedItem
        },
      })

      clickOnItemAtIndex(selectionIndex)
      rerender({selectedItem})

      expect(toggleButton).toHaveTextContent(items[selectionIndex])
    })

    test('can have downshift actions executed', () => {
      const {result} = renderUseSelect({
        initialIsOpen: true,
        onSelectedItemChange: () => {
          result.current.openMenu()
        },
      })

      hooksAct(() => {
        result.current.getItemProps({index: 2}).onClick({})
      })

      expect(result.current.isOpen).toEqual(true)
    })
  })

  describe('onHighlightedIndexChange', () => {
    test('is called at each highlightedIndex change', () => {
      const onHighlightedIndexChange = jest.fn()
      const {keyDownOnToggleButton} = renderSelect({
        initialIsOpen: true,
        onHighlightedIndexChange,
      })

      keyDownOnToggleButton('ArrowDown')

      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        }),
      )
    })

    test('is not called if highlightedIndex is the same', () => {
      const onHighlightedIndexChange = jest.fn()
      const {keyDownOnMenu} = renderSelect({
        initialIsOpen: true,
        initialHighlightedIndex: 0,
        onHighlightedIndexChange,
      })

      keyDownOnMenu('ArrowUp')

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()

      keyDownOnMenu('Home')

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()
    })

    test('is called on first open when initialSelectedItem is set', () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      const {clickOnToggleButton} = renderSelect({
        initialSelectedItem: items[index],
        onHighlightedIndexChange,
      })

      clickOnToggleButton()

      expect(onHighlightedIndexChange).toHaveBeenCalledTimes(1)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: index,
        }),
      )
    })

    test('is called on first open when selectedItem is set', () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      const {clickOnToggleButton} = renderSelect({
        selectedItem: items[index],
        onHighlightedIndexChange,
      })

      clickOnToggleButton()

      expect(onHighlightedIndexChange).toHaveBeenCalledTimes(1)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: index,
        }),
      )
    })

    test('is called on first open when defaultSelectedItem is set', () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      const {clickOnToggleButton} = renderSelect({
        defaultSelectedItem: items[index],
        onHighlightedIndexChange,
      })

      clickOnToggleButton()

      expect(onHighlightedIndexChange).toHaveBeenCalledTimes(1)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: index,
        }),
      )
    })

    test('works correctly with the corresponding control prop', () => {
      let highlightedIndex = 2
      const {keyDownOnMenu, menu, rerender} = renderSelect({
        isOpen: true,
        highlightedIndex,
        onHighlightedIndexChange: changes => {
          highlightedIndex = changes.highlightedIndex
        },
      })

      keyDownOnMenu('ArrowDown')
      rerender({isOpen: true, highlightedIndex})

      expect(menu).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(3),
      )
    })

    test('can have downshift actions executed', () => {
      const highlightedIndex = 3
      const {result} = renderUseSelect({
        initialIsOpen: true,
        onHighlightedIndexChange: () => {
          result.current.setHighlightedIndex(highlightedIndex)
        },
      })

      hooksAct(() => {
        result.current
          .getToggleButtonProps()
          .onKeyDown({key: 'ArrowDown', preventDefault: jest.fn()})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onIsOpenChange', () => {
    test('is called at each isOpen change', () => {
      const onIsOpenChange = jest.fn()
      const {keyDownOnMenu} = renderSelect({
        initialIsOpen: true,
        onIsOpenChange,
      })

      keyDownOnMenu('Escape')

      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.MenuKeyDownEscape,
        }),
      )
    })

    test('is not called at if isOpen is the same', () => {
      const onIsOpenChange = jest.fn()
      const {clickOnItemAtIndex} = renderSelect({
        defaultIsOpen: true,
        onIsOpenChange,
      })

      clickOnItemAtIndex(0)

      expect(onIsOpenChange).not.toHaveBeenCalledWith()
    })

    test('works correctly with the corresponding control prop', () => {
      let isOpen = true
      const {keyDownOnMenu, getItems, rerender} = renderSelect({
        isOpen,
        onIsOpenChange: changes => {
          isOpen = changes.isOpen
        },
      })

      keyDownOnMenu('Escape')
      rerender({isOpen})

      expect(getItems()).toHaveLength(0)
    })

    test('can have downshift actions executed', () => {
      const highlightedIndex = 3
      const {result} = renderUseSelect({
        onIsOpenChange: () => {
          result.current.setHighlightedIndex(highlightedIndex)
        },
      })

      hooksAct(() => {
        result.current.getToggleButtonProps().onClick({})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onStateChange', () => {
    // eslint-disable-next-line max-statements
    test('is called at each state property change but only with changed props', () => {
      const onStateChange = jest.fn()
      const {
        clickOnToggleButton,
        tab,
        mouseLeaveMenu,
        keyDownOnToggleButton,
        keyDownOnMenu,
        mouseMoveItemAtIndex,
        clickOnItemAtIndex,
      } = renderSelect({onStateChange, isOpen: true})

      clickOnToggleButton()

      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.ToggleButtonClick,
        }),
      )

      keyDownOnMenu('c')

      expect(onStateChange).toHaveBeenCalledTimes(2)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          inputValue: 'c',
          highlightedIndex: 3, // 4th item starts with C.
          type: stateChangeTypes.MenuKeyDownCharacter,
        }),
      )

      keyDownOnMenu('ArrowDown')

      expect(onStateChange).toHaveBeenCalledTimes(3)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 4,
          type: stateChangeTypes.MenuKeyDownArrowDown,
        }),
      )

      keyDownOnMenu('ArrowUp')

      expect(onStateChange).toHaveBeenCalledTimes(4)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 3,
          type: stateChangeTypes.MenuKeyDownArrowUp,
        }),
      )

      keyDownOnMenu('End')

      expect(onStateChange).toHaveBeenCalledTimes(5)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: items.length - 1,
          type: stateChangeTypes.MenuKeyDownEnd,
        }),
      )

      keyDownOnMenu('Home')

      expect(onStateChange).toHaveBeenCalledTimes(6)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          type: stateChangeTypes.MenuKeyDownHome,
        }),
      )

      keyDownOnMenu('Enter')

      expect(onStateChange).toHaveBeenCalledTimes(7)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          selectedItem: items[0],
          type: stateChangeTypes.MenuKeyDownEnter,
        }),
      )

      mouseMoveItemAtIndex(3)

      expect(onStateChange).toHaveBeenCalledTimes(8)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 3,
          type: stateChangeTypes.ItemMouseMove,
        }),
      )

      mouseLeaveMenu()

      expect(onStateChange).toHaveBeenCalledTimes(9)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
          type: stateChangeTypes.MenuMouseLeave,
        }),
      )

      keyDownOnMenu('Escape')

      expect(onStateChange).toHaveBeenCalledTimes(10)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.MenuKeyDownEscape,
        }),
      )

      keyDownOnToggleButton('ArrowDown')

      expect(onStateChange).toHaveBeenCalledTimes(11)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 1,
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        }),
      )

      keyDownOnMenu(' ')

      expect(onStateChange).toHaveBeenCalledTimes(12)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
          selectedItem: items[1],
          isOpen: false,
          type: stateChangeTypes.MenuKeyDownSpaceButton,
        }),
      )

      keyDownOnToggleButton('ArrowDown')

      expect(onStateChange).toHaveBeenCalledTimes(13)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 2,
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        }),
      )

      clickOnItemAtIndex(3)

      expect(onStateChange).toHaveBeenCalledTimes(14)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItem: items[3],
          isOpen: false,
          highlightedIndex: -1,
          type: stateChangeTypes.ItemClick,
        }),
      )

      keyDownOnToggleButton('a')

      expect(onStateChange).toHaveBeenCalledTimes(15)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          inputValue: 'ca',
          selectedItem: items[5], // 5 item starts with CA.
          type: stateChangeTypes.ToggleButtonKeyDownCharacter,
        }),
      )

      tab()

      expect(onStateChange).toHaveBeenCalledTimes(16)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.MenuBlur,
        }),
      )
    })

    test('can have downshift actions executed', () => {
      const {result} = renderUseSelect({
        initialIsOpen: true,
        onStateChange: () => {
          result.current.openMenu()
        },
      })

      hooksAct(() => {
        result.current.getItemProps({index: 2}).onClick({})
      })

      expect(result.current.isOpen).toEqual(true)
    })
  })

  it('that are uncontrolled should not become controlled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderSelect()

    rerender({isOpen: true})

    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `"downshift: A component has changed the uncontrolled prop \\"isOpen\\" to be controlled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props"`,
    )
  })

  it('that are controlled should not become uncontrolled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderSelect({highlightedIndex: 3})

    rerender({})

    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `"downshift: A component has changed the controlled prop \\"highlightedIndex\\" to be uncontrolled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props"`,
    )
  })
})
