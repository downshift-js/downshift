import React from 'react'
import {renderHook, act as hooksAct} from '@testing-library/react-hooks'
import {act} from '@testing-library/react'
import {renderCombobox, renderUseCombobox} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import {
  items,
  defaultIds,
  waitForDebouncedA11yStatusUpdate,
} from '../../testUtils'
import useCombobox from '..'

describe('props', () => {
  test('if falsy then prop types error is thrown', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => useCombobox())

    expect(global.console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Warning: Failed prop type: The prop \`items\` is marked as required in \`useCombobox\`, but its value is \`undefined\`."`,
    )
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
      jest.useFakeTimers()
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
      jest.useFakeTimers()
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
    beforeEach(jest.useFakeTimers)
    afterEach(() => {
      act(jest.runAllTimers)
    })
    afterAll(jest.useRealTimers)

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
      jest.runAllTimers()

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
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
    beforeEach(jest.useFakeTimers)
    afterEach(() => {
      act(jest.runAllTimers)
    })
    afterAll(jest.useRealTimers)

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

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
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

    test('is called when isOpen, highlightedIndex, inputValue or items change', () => {
      const getA11yStatusMessage = jest.fn()
      const inputItems = ['aaa', 'bbb']
      const {
        clickOnToggleButton,
        rerender,
        keyDownOnInput,
        changeInputValue,
      } = renderCombobox({
        getA11yStatusMessage,
        items,
      })

      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).not.toHaveBeenCalled()

      // should not be called when any other prop is changed.
      rerender({getA11yStatusMessage, items, circularNavigation: false})
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

      changeInputValue('b')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({inputValue: 'b'}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(3)

      keyDownOnInput('ArrowDown')
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

      expect(input).toHaveValue('Dohn Joe')

      clickOnItemAtIndex(0)

      expect(input).toHaveValue('Dohn Joe')

      keyDownOnInput('ArrowUp')
      keyDownOnInput('Enter')

      expect(input).toHaveValue('Dohn Joe')

      blurInput()

      expect(input).toHaveValue('Dohn Joe')
    })

    test('is changed once a new selectedItem comes from props', () => {
      const initialSelectedItem = 'John Doe'
      const finalSelectedItem = 'John Wick'
      const {rerender, input} = renderCombobox({
        isOpen: true,
        selectedItem: initialSelectedItem,
      })

      expect(input).toHaveValue(initialSelectedItem)

      rerender({selectedItem: finalSelectedItem, isOpen: true})

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
    beforeEach(jest.useFakeTimers)
    afterEach(() => {
      hooksAct(() => jest.runAllTimers())
    })
    afterAll(jest.useRealTimers)

    test('is called at each state change with the function change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {result} = renderUseCombobox({stateReducer})

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
        changeInputValue,
        clickOnItemAtIndex,
        mouseLeaveMenu,
        mouseMoveItemAtIndex,
        keyDownOnInput,
        blurInput,
      } = renderCombobox({stateReducer})
      const initialState = {
        isOpen: false,
        highlightedIndex: -1,
        inputValue: '',
        selectedItem: null,
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
          step: mouseMoveItemAtIndex,
          args: 2,
          state: {
            isOpen: true,
            highlightedIndex: 2,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.ItemMouseMove,
        },
        {
          step: mouseLeaveMenu,
          state: {
            isOpen: true,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.MenuMouseLeave,
        },
        {
          step: blurInput,
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputBlur,
        },
        {
          step: changeInputValue,
          args: 'c',
          state: {
            isOpen: true,
            highlightedIndex: -1,
            inputValue: 'c',
            selectedItem: null,
          },
          type: stateChangeTypes.InputChange,
        },
        {
          step: keyDownOnInput,
          args: 'ArrowDown',
          state: {
            isOpen: true,
            highlightedIndex: 0,
            inputValue: 'c',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownArrowDown,
        },
        {
          step: keyDownOnInput,
          args: 'Enter',
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: items[0],
            selectedItem: items[0],
          },
          type: stateChangeTypes.InputKeyDownEnter,
        },
        {
          step: keyDownOnInput,
          args: 'Escape',
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownEscape,
        },
        {
          step: keyDownOnInput,
          args: 'ArrowDown',
          state: {
            isOpen: true,
            highlightedIndex: 0,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownArrowDown,
        },
        {
          step: keyDownOnInput,
          args: 'ArrowUp',
          state: {
            isOpen: true,
            highlightedIndex: items.length - 1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownArrowUp,
        },
        {
          step: keyDownOnInput,
          args: 'Home',
          state: {
            isOpen: true,
            highlightedIndex: 0,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownHome,
        },
        {
          step: keyDownOnInput,
          args: 'End',
          state: {
            isOpen: true,
            highlightedIndex: items.length - 1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownEnd,
        },
        {
          step: clickOnItemAtIndex,
          args: 3,
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: items[3],
            selectedItem: items[3],
          },
          type: stateChangeTypes.ItemClick,
        },
        {
          step: keyDownOnInput,
          args: 'ArrowUp',
          state: {
            isOpen: true,
            highlightedIndex: 2,
            inputValue: items[3],
            selectedItem: items[3],
          },
          type: stateChangeTypes.InputKeyDownArrowUp,
        },
        {
          step: keyDownOnInput,
          args: 'Escape',
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: items[3],
            selectedItem: items[3],
          },
          type: stateChangeTypes.InputKeyDownEscape,
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

    test('replaces prop values with user defined', () => {
      const inputValue = 'Robin Hood'
      const stateReducer = jest.fn((s, a) => {
        const changes = a.changes
        changes.inputValue = inputValue
        return changes
      })
      const {clickOnToggleButton, input} = renderCombobox({stateReducer})

      clickOnToggleButton()

      expect(input).toHaveValue('Robin Hood')
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

  describe('onInputValueChange', () => {
    test('is called at inputValue change', () => {
      const inputValue = 'test'
      const onInputValueChange = jest.fn()
      const {changeInputValue} = renderCombobox({
        onInputValueChange,
      })

      changeInputValue(inputValue)

      expect(onInputValueChange).toHaveBeenCalledWith(
        expect.objectContaining({
          inputValue,
        }),
      )
    })

    test('is not called at if inputValue is the same', () => {
      const inputValue = items[0]
      const onInputValueChange = jest.fn()
      const {clickOnItemAtIndex} = renderCombobox({
        initialInputValue: inputValue,
        initialIsOpen: true,
        onInputValueChange,
      })

      clickOnItemAtIndex(0)

      expect(onInputValueChange).not.toHaveBeenCalled()
    })

    test('works correctly with the corresponding control prop', () => {
      let inputValue = 'nep'
      const {changeInputValue, input, rerender} = renderCombobox({
        inputValue,
        onSelectedItemChange: changes => {
          inputValue = changes.inputValue
        },
      })

      changeInputValue('nept')
      rerender({inputValue})

      expect(input).toHaveValue(inputValue)
    })

    test('can have downshift actions executed', () => {
      const highlightedIndex = 3
      const {result} = renderUseCombobox({
        onInputValueChange: () => {
          result.current.setHighlightedIndex(highlightedIndex)
        },
      })

      hooksAct(() => {
        result.current.getInputProps().onChange({target: {value: 'ala'}})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
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
          type: stateChangeTypes.ItemClick,
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

    test('works correctly with the corresponding control prop', () => {
      let selectedItem = items[2]
      const selectionIndex = 3
      const {clickOnItemAtIndex, input, rerender} = renderCombobox({
        initialIsOpen: true,
        selectedItem,
        onSelectedItemChange: changes => {
          selectedItem = changes.selectedItem
        },
      })

      clickOnItemAtIndex(selectionIndex)
      rerender({selectedItem})

      expect(input).toHaveValue(items[selectionIndex])
    })

    test('works correctly with the corresponding control prop in strict mode', () => {
      const onSelectedItemChange = jest.fn()
      const itemIndex = 0
      const {clickOnItemAtIndex} = renderCombobox(
        {selectedItem: null, initialIsOpen: true, onSelectedItemChange},
        ui => <React.StrictMode>{ui}</React.StrictMode>,
      )

      clickOnItemAtIndex(itemIndex)

      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[itemIndex],
        }),
      )
    })

    test('can have downshift actions executed', () => {
      const {result} = renderUseCombobox({
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
      const {keyDownOnInput} = renderCombobox({
        initialIsOpen: true,
        onHighlightedIndexChange,
      })

      keyDownOnInput('ArrowDown')

      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          type: stateChangeTypes.InputKeyDownArrowDown,
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

    test('is called on first open when initialSelectedItem is set', () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      const {clickOnToggleButton} = renderCombobox({
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
      const {clickOnToggleButton} = renderCombobox({
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
      const {clickOnToggleButton} = renderCombobox({
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
      const {keyDownOnInput, input, rerender} = renderCombobox({
        isOpen: true,
        highlightedIndex,
        onHighlightedIndexChange: changes => {
          highlightedIndex = changes.highlightedIndex
        },
      })

      keyDownOnInput('ArrowDown')
      rerender({highlightedIndex, isOpen: true})

      expect(input).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(3),
      )
    })

    test('can have downshift actions executed', () => {
      const highlightedIndex = 3
      const {result} = renderUseCombobox({
        initialIsOpen: true,
        onHighlightedIndexChange: () => {
          result.current.setHighlightedIndex(highlightedIndex)
        },
      })

      hooksAct(() => {
        result.current
          .getInputProps()
          .onKeyDown({key: 'ArrowDown', preventDefault: jest.fn()})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
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
          type: stateChangeTypes.InputKeyDownEscape,
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

    test('works correctly with the corresponding control prop', () => {
      let isOpen = true
      const {keyDownOnInput, getItems, rerender} = renderCombobox({
        isOpen,
        onIsOpenChange: changes => {
          isOpen = changes.isOpen
        },
      })

      keyDownOnInput('Escape')
      rerender({isOpen})

      expect(getItems()).toHaveLength(0)
    })

    test('can have downshift actions executed', () => {
      const highlightedIndex = 3
      const {result} = renderUseCombobox({
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

    test('can have downshift actions executed', () => {
      const {result} = renderUseCombobox({
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

  test('that are uncontrolled should not become controlled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderCombobox()

    rerender({selectedItem: 'controlled'})

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `"downshift: A component has changed the uncontrolled prop \\"selectedItem\\" to be controlled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props"`,
    )
  })

  test('that are controlled should not become uncontrolled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderCombobox({inputValue: 'controlled value'})

    rerender({})

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `"downshift: A component has changed the controlled prop \\"inputValue\\" to be uncontrolled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props"`,
    )
  })
})
