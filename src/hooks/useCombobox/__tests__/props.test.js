import React from 'react'
import {renderHook, act} from '@testing-library/react'
import {
  renderCombobox,
  renderUseCombobox,
  items,
  defaultIds,
  waitForDebouncedA11yStatusUpdate,
  getToggleButton,
  getMenu,
  getLabel,
  getInput,
  getItems,
  clickOnItemAtIndex,
  getA11yStatusContainer,
  keyDownOnInput,
  clickOnToggleButton,
  changeInputValue,
  mouseMoveItemAtIndex,
  mouseLeaveItemAtIndex,
  tab,
  clickOnInput,
} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import useCombobox from '..'

describe('props', () => {
  test('if falsy then prop types error is thrown', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    renderHook(() => useCombobox())

    expect(global.console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `Warning: Failed prop type: The prop \`items\` is marked as required in \`useCombobox\`, but its value is \`undefined\`.`,
    )
  })

  describe('id', () => {
    test('if passed will override downshift default', () => {
      renderCombobox({
        id: 'my-custom-little-id',
      })
      const elements = [getToggleButton(), getMenu(), getLabel(), getInput()]

      elements.forEach(element => {
        expect(element).toHaveAttribute(
          'id',
          expect.stringContaining('my-custom-little-id'),
        )
      })
    })
  })

  describe('items', () => {
    test('if passed as empty then menu will not open', () => {
      renderCombobox({items: [], isOpen: true})

      expect(getItems()).toHaveLength(0)
    })

    test('passed as objects should work with custom itemToString', async () => {
      jest.useFakeTimers()
      renderCombobox({
        items: [{str: 'aaa'}, {str: 'bbb'}],
        itemToString: item => item.str,
        initialIsOpen: true,
      })

      await clickOnItemAtIndex(0)

      expect(getInput()).toHaveValue('aaa')
    })
  })

  describe('itemToKey', () => {
    test('props update of selectedItem will update inputValue state with default itemToKey referential equality check', () => {
      const initialSelectedItem = {id: 3, value: 'init'}
      const selectedItem = {id: 1, value: 'wow'}
      const newSelectedItem = {id: 1, value: 'not wow'}
      function itemToString(item) {
        return item.value
      }
      const stateReducer = jest
        .fn()
        .mockImplementation((_state, {changes}) => changes)

      const {rerender} = renderCombobox({
        stateReducer,
        itemToString,
        selectedItem: initialSelectedItem,
      })

      expect(stateReducer).not.toHaveBeenCalled() // won't get called on first render

      rerender({
        stateReducer,
        itemToString,
        selectedItem,
      })

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenCalledWith(
        {
          inputValue: itemToString(initialSelectedItem),
          selectedItem,
          highlightedIndex: -1,
          isOpen: false,
        },
        expect.objectContaining({
          type: useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem,
          changes: {
            inputValue: itemToString(selectedItem),
            selectedItem,
            highlightedIndex: -1,
            isOpen: false,
          },
        }),
      )

      stateReducer.mockClear()
      rerender({
        stateReducer,
        selectedItem: newSelectedItem,
        itemToString,
      })

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenCalledWith(
        {
          inputValue: itemToString(selectedItem),
          selectedItem: newSelectedItem,
          highlightedIndex: -1,
          isOpen: false,
        },
        expect.objectContaining({
          changes: {
            inputValue: itemToString(newSelectedItem),
            selectedItem: newSelectedItem,
            highlightedIndex: -1,
            isOpen: false,
          },
          type: useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem,
        }),
      )
      expect(getInput()).toHaveValue(itemToString(newSelectedItem))
    })

    test('props update of selectedItem will not update inputValue state if itemToKey returns equal values', () => {
      const initialSelectedItem = {id: 1, value: 'hmm'}
      const selectedItem = {id: 1, value: 'wow'}
      function itemToString(item) {
        return item.value
      }
      const itemToKey = jest.fn().mockImplementation(item => item.id)
      const stateReducer = jest
        .fn()
        .mockImplementation((_state, {changes}) => changes)

      const {rerender} = renderCombobox({
        itemToKey,
        stateReducer,
        selectedItem: initialSelectedItem,
        itemToString,
      })

      rerender({
        itemToKey,
        stateReducer,
        selectedItem,
        itemToString,
      })

      expect(getInput()).toHaveValue(itemToString(initialSelectedItem))
      expect(itemToKey).toHaveBeenCalledTimes(2)
      expect(itemToKey).toHaveBeenNthCalledWith(1, selectedItem)
      expect(itemToKey).toHaveBeenNthCalledWith(2, initialSelectedItem)
    })
  })

  describe('getA11yStatusMessage', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => {
      act(() => jest.runAllTimers())
    })
    afterAll(() => jest.useRealTimers())

    test('adds no status message element to the DOM if not passed', async () => {
      renderCombobox({
        items,
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).not.toBeInTheDocument()
    })

    test('adds a status message element with the text returned', async () => {
      const a11yStatusMessage1 = 'Dropdown is open'
      const a11yStatusMessage2 = 'Dropdown is still open'
      const getA11yStatusMessage = jest
        .fn()
        .mockReturnValueOnce(a11yStatusMessage1)
        .mockReturnValueOnce(a11yStatusMessage2)
      renderCombobox({
        items,
        getA11yStatusMessage,
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(a11yStatusMessage1)
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith({
        highlightedIndex: -1,
        inputValue: '',
        isOpen: true,
        selectedItem: null,
      })

      getA11yStatusMessage.mockClear()

      await keyDownOnInput('{ArrowDown}')

      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(a11yStatusMessage2)
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith({
        highlightedIndex: 0,
        inputValue: '',
        isOpen: true,
        selectedItem: null,
      })
    })

    test('clears the text content after 500ms', async () => {
      renderCombobox({
        items,
        getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate(true)

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
    })

    test('removes the message element from the DOM on unmount', async () => {
      const {unmount} = renderCombobox({
        items,
        getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate(true)
      unmount()

      expect(getA11yStatusContainer()).not.toBeInTheDocument()
    })

    test('is added to the document provided by the user as prop', async () => {
      const environment = {
        document: {
          getElementById: jest.fn().mockReturnValue({remove: jest.fn()}),
          createElement: jest.fn(),
          activeElement: {},
          body: {},
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        Node,
      }
      renderCombobox({
        items,
        environment,
        getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
      expect(environment.document.getElementById).toHaveBeenCalledWith(
        'a11y-status-message',
      )
    })
  })

  test('highlightedIndex controls the state property if passed', async () => {
    const highlightedIndex = 1
    const expectedItemId = defaultIds.getItemId(highlightedIndex)
    renderCombobox({
      isOpen: true,
      highlightedIndex,
    })
    const input = getInput()

    expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)

    await keyDownOnInput('{ArrowDown}')

    expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)

    await keyDownOnInput('{End}')

    expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)

    await keyDownOnInput('{ArrowUp}')

    expect(input).toHaveAttribute('aria-activedescendant', expectedItemId)
  })

  describe('inputValue', () => {
    test('controls the state property if passed', async () => {
      renderCombobox({isOpen: true, inputValue: 'Dohn Joe'})
      const input = getInput()

      await keyDownOnInput('{ArrowDown}')
      await keyDownOnInput('{Enter}')

      expect(input).toHaveValue('Dohn Joe')

      await clickOnItemAtIndex(0)

      expect(input).toHaveValue('Dohn Joe')

      await keyDownOnInput('{ArrowUp}')
      await keyDownOnInput('{Enter}')

      expect(input).toHaveValue('Dohn Joe')

      await tab()

      expect(input).toHaveValue('Dohn Joe')
    })

    test('is changed once a new selectedItem comes from props', () => {
      const initialSelectedItem = 'John Doe'
      const finalSelectedItem = 'John Wick'
      const {rerender} = renderCombobox({
        isOpen: true,
        selectedItem: initialSelectedItem,
      })
      const input = getInput()

      expect(input).toHaveValue(initialSelectedItem)

      rerender({selectedItem: finalSelectedItem, isOpen: true})

      expect(input).toHaveValue(finalSelectedItem)
    })
  })

  test('isOpen controls the state property if passed', async () => {
    renderCombobox({isOpen: true})

    expect(getItems()).toHaveLength(items.length)

    await clickOnToggleButton()

    expect(getItems()).toHaveLength(items.length)

    await keyDownOnInput('{Escape}')

    expect(getItems()).toHaveLength(items.length)

    await tab()

    expect(getItems()).toHaveLength(items.length)
  })

  test('selectedItem controls the state property if passed', async () => {
    const selectedItem = items[2]

    renderCombobox({
      selectedItem,
      initialIsOpen: true,
    })
    const input = getInput()

    expect(input).toHaveValue(selectedItem)

    await keyDownOnInput('{ArrowDown}')
    await keyDownOnInput('{Enter}')
    await clickOnToggleButton()

    expect(input).toHaveValue(selectedItem)

    await keyDownOnInput('{ArrowUp}')
    await keyDownOnInput('{Enter}')
    await clickOnToggleButton()

    expect(input).toHaveValue(selectedItem)

    await keyDownOnInput('{Escape}')
    await clickOnToggleButton()

    expect(input).toHaveValue(selectedItem)

    await clickOnItemAtIndex(1)
    await clickOnToggleButton()

    expect(input).toHaveValue(selectedItem)
  })

  test('selectedItem change updates the input value', async () => {
    const selectedItem = items[2]
    const newSelectedItem = items[4]
    const nullSelectedItem = null
    const lastSelectedItem = items[1]
    const stateReducer = jest.fn().mockImplementation((s, a) => a.changes)

    const {rerender} = renderCombobox({
      selectedItem,
      stateReducer,
    })
    const input = getInput()

    expect(input).toHaveValue(selectedItem)
    expect(stateReducer).not.toHaveBeenCalled() // don't call on first render.

    rerender({
      selectedItem: newSelectedItem,
      stateReducer,
    })

    expect(stateReducer).toHaveBeenCalledTimes(1)
    expect(stateReducer).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        type: useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem,
      }),
    )
    expect(input).toHaveValue(newSelectedItem)

    stateReducer.mockClear()
    rerender({
      selectedItem: nullSelectedItem,
      stateReducer,
    })

    expect(stateReducer).toHaveBeenCalledTimes(1)
    expect(stateReducer).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        type: useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem,
      }),
    )
    expect(input).toHaveValue('')

    stateReducer.mockClear()
    rerender({
      selectedItem: lastSelectedItem,
      stateReducer,
    })

    expect(stateReducer).toHaveBeenCalledTimes(1)
    expect(stateReducer).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        type: useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem,
      }),
    )
    expect(input).toHaveValue(lastSelectedItem)
  })

  describe('stateReducer', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => {
      act(() => jest.runAllTimers())
    })
    afterAll(jest.useRealTimers)

    test('is called at each state change with the function change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {result} = renderUseCombobox({stateReducer})

      act(() => {
        result.current.toggleMenu()
      })

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionToggleMenu}),
      )

      act(() => {
        result.current.openMenu()
      })

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionOpenMenu}),
      )

      act(() => {
        result.current.closeMenu()
      })

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionCloseMenu}),
      )

      act(() => {
        result.current.reset()
      })

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionReset}),
      )

      act(() => {
        result.current.selectItem({})
      })

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionSelectItem}),
      )

      act(() => {
        result.current.setHighlightedIndex(5)
      })

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.FunctionSetHighlightedIndex,
        }),
      )

      act(() => {
        result.current.setInputValue({})
      })

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.FunctionSetInputValue}),
      )
    })

    test('is called at each state change with the appropriate change type', async () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      renderCombobox({stateReducer})
      const initialState = {
        isOpen: false,
        highlightedIndex: -1,
        inputValue: '',
        selectedItem: null,
      }
      const testCases = [
        {
          step: clickOnInput,
          state: {
            isOpen: true,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputClick,
        },
        {
          step: tab,
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputBlur,
        },
        {
          step: clickOnInput,
          state: {
            isOpen: true,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputClick,
        },
        {
          step: keyDownOnInput,
          args: '{Enter}',
          state: {
            isOpen: false,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownEnter,
        },
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
          step: mouseLeaveItemAtIndex,
          args: 2,
          state: {
            isOpen: true,
            highlightedIndex: -1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.MenuMouseLeave,
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
          args: '{ArrowDown}',
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
          args: '{Enter}',
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
          args: '{Escape}',
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
          args: '{ArrowDown}',
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
          args: '{ArrowUp}',
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
          args: '{Home}',
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
          args: '{End}',
          state: {
            isOpen: true,
            highlightedIndex: items.length - 1,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownEnd,
        },
        {
          step: mouseMoveItemAtIndex,
          args: 3,
          state: {
            isOpen: true,
            highlightedIndex: 3,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.ItemMouseMove,
        },
        {
          step: keyDownOnInput,
          args: '{PageDown}',
          state: {
            isOpen: true,
            highlightedIndex: 13,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownPageDown,
        },
        {
          step: keyDownOnInput,
          args: '{PageUp}',
          state: {
            isOpen: true,
            highlightedIndex: 3,
            inputValue: '',
            selectedItem: null,
          },
          type: stateChangeTypes.InputKeyDownPageUp,
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
          args: '{ArrowUp}',
          state: {
            isOpen: true,
            highlightedIndex: 3,
            inputValue: items[3],
            selectedItem: items[3],
          },
          type: stateChangeTypes.InputKeyDownArrowUp,
        },
        {
          step: keyDownOnInput,
          args: '{Escape}',
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
        // eslint-disable-next-line jest/no-conditional-in-test
        const previousState = testCases[index - 1]?.state ?? initialState

        // eslint-disable-next-line no-await-in-loop
        await step(args)

        expect(stateReducer).toHaveBeenCalledTimes(index + 1)
        expect(stateReducer).toHaveBeenLastCalledWith(
          previousState,
          expect.objectContaining({changes: state, type}),
        )
      }
    })

    test('replaces prop values with user defined', async () => {
      const inputValue = 'Robin Hood'
      const stateReducer = jest.fn((s, a) => {
        const changes = a.changes
        changes.inputValue = inputValue
        return changes
      })
      renderCombobox({stateReducer})

      await clickOnToggleButton()

      expect(getInput()).toHaveValue('Robin Hood')
    })

    test('receives state, changes and type', async () => {
      const stateReducer = jest.fn((s, a) => {
        expect(a.type).not.toBeUndefined()
        expect(a.type).not.toBeNull()

        expect(s).not.toBeUndefined()
        expect(s).not.toBeNull()

        expect(a.changes).not.toBeUndefined()
        expect(a.changes).not.toBeNull()

        return a.changes
      })
      renderCombobox({stateReducer})

      await clickOnToggleButton()
    })

    test('changes are visible in onChange handlers', async () => {
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
      renderCombobox({
        stateReducer,
        onStateChange,
        onSelectedItemChange,
        onHighlightedIndexChange,
        onIsOpenChange,
        onInputValueChange,
      })

      await clickOnToggleButton()

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
    test('is called at inputValue change', async () => {
      const inputValue = 'test'
      const onInputValueChange = jest.fn()
      renderCombobox({
        onInputValueChange,
      })

      await changeInputValue(inputValue)

      expect(onInputValueChange).toHaveBeenCalledWith(
        expect.objectContaining({
          inputValue,
        }),
      )
    })

    test('is not called at if inputValue is the same', async () => {
      const inputValue = items[0]
      const onInputValueChange = jest.fn()
      renderCombobox({
        initialInputValue: inputValue,
        initialIsOpen: true,
        onInputValueChange,
      })

      await clickOnItemAtIndex(0)

      expect(onInputValueChange).not.toHaveBeenCalled()
    })

    test('works correctly with the corresponding control prop', async () => {
      let inputValue = 'nep'
      const {rerender} = renderCombobox({
        inputValue,
        onSelectedItemChange: changes => {
          inputValue = changes.inputValue
        },
      })

      await changeInputValue('nept')
      rerender({inputValue})

      expect(getInput()).toHaveValue(inputValue)
    })

    test('can have downshift actions executed', () => {
      const highlightedIndex = 3
      const {result} = renderUseCombobox({
        onInputValueChange: () => {
          result.current.setHighlightedIndex(highlightedIndex)
        },
      })

      act(() => {
        result.current.getInputProps().onChange({target: {value: 'ala'}})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onSelectedItemChange', () => {
    test('is called at selectedItem change', async () => {
      const itemIndex = 0
      const onSelectedItemChange = jest.fn()
      renderCombobox({
        initialIsOpen: true,
        onSelectedItemChange,
      })

      await clickOnItemAtIndex(itemIndex)

      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[itemIndex],
          type: stateChangeTypes.ItemClick,
        }),
      )
    })

    test('is not called at if selectedItem is the same', async () => {
      const itemIndex = 0
      const onSelectedItemChange = jest.fn()
      renderCombobox({
        initialIsOpen: true,
        initialSelectedItem: items[itemIndex],
        onSelectedItemChange,
      })

      await clickOnItemAtIndex(itemIndex)

      expect(onSelectedItemChange).not.toHaveBeenCalled()
    })

    test('works correctly with the corresponding control prop', async () => {
      let selectedItem = items[2]
      const selectionIndex = 3
      const {rerender} = renderCombobox({
        initialIsOpen: true,
        selectedItem,
        onSelectedItemChange: changes => {
          selectedItem = changes.selectedItem
        },
      })

      await clickOnItemAtIndex(selectionIndex)
      rerender({selectedItem})

      expect(getInput()).toHaveValue(items[selectionIndex])
    })

    test('works correctly with the corresponding control prop in strict mode', async () => {
      const onSelectedItemChange = jest.fn()
      const itemIndex = 0
      renderCombobox(
        {selectedItem: null, initialIsOpen: true, onSelectedItemChange},
        ui => <React.StrictMode>{ui}</React.StrictMode>,
      )

      await clickOnItemAtIndex(itemIndex)

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

      act(() => {
        result.current.getItemProps({index: 2}).onClick({})
      })

      expect(result.current.isOpen).toEqual(true)
    })
  })

  describe('onHighlightedIndexChange', () => {
    test('is called at each highlightedIndex change', async () => {
      const onHighlightedIndexChange = jest.fn()
      renderCombobox({
        initialIsOpen: true,
        onHighlightedIndexChange,
      })

      await keyDownOnInput('{ArrowDown}')

      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          type: stateChangeTypes.InputKeyDownArrowDown,
        }),
      )
    })

    test('is not called if highlightedIndex is the same', async () => {
      const onHighlightedIndexChange = jest.fn()
      renderCombobox({
        initialIsOpen: true,
        initialHighlightedIndex: 0,
        onHighlightedIndexChange,
      })

      await keyDownOnInput('{Home}')

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()

      await mouseMoveItemAtIndex(0)

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()
    })

    test('is called on first open when initialSelectedItem is set', async () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      renderCombobox({
        initialSelectedItem: items[index],
        onHighlightedIndexChange,
      })

      await clickOnToggleButton()

      expect(onHighlightedIndexChange).toHaveBeenCalledTimes(1)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: index,
        }),
      )
    })

    test('is called on first open when selectedItem is set', async () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      renderCombobox({
        selectedItem: items[index],
        onHighlightedIndexChange,
      })

      await clickOnToggleButton()

      expect(onHighlightedIndexChange).toHaveBeenCalledTimes(1)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: index,
        }),
      )
    })

    test('is called on first open when defaultSelectedItem is set', async () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      renderCombobox({
        defaultSelectedItem: items[index],
        onHighlightedIndexChange,
      })

      await clickOnToggleButton()

      expect(onHighlightedIndexChange).toHaveBeenCalledTimes(1)
      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: index,
        }),
      )
    })

    test('works correctly with the corresponding control prop', async () => {
      let highlightedIndex = 2
      const {rerender} = renderCombobox({
        isOpen: true,
        highlightedIndex,
        onHighlightedIndexChange: changes => {
          highlightedIndex = changes.highlightedIndex
        },
      })

      await keyDownOnInput('{ArrowDown}')
      rerender({highlightedIndex, isOpen: true})

      expect(getInput()).toHaveAttribute(
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

      act(() => {
        result.current
          .getInputProps()
          .onKeyDown({key: 'ArrowDown', preventDefault: jest.fn()})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onIsOpenChange', () => {
    test('is called at each isOpen change', async () => {
      const onIsOpenChange = jest.fn()
      renderCombobox({
        initialIsOpen: true,
        onIsOpenChange,
      })

      await keyDownOnInput('{Escape}')

      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.InputKeyDownEscape,
        }),
      )
    })

    test('is not called at if isOpen is the same', async () => {
      const onIsOpenChange = jest.fn()
      renderCombobox({
        defaultIsOpen: true,
        onIsOpenChange,
      })

      await clickOnItemAtIndex(0)

      expect(onIsOpenChange).not.toHaveBeenCalledWith()
    })

    test('works correctly with the corresponding control prop', async () => {
      let isOpen = true
      const {rerender} = renderCombobox({
        isOpen,
        onIsOpenChange: changes => {
          isOpen = changes.isOpen
        },
      })

      await keyDownOnInput('{Escape}')
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

      act(() => {
        result.current.getToggleButtonProps().onClick({})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onStateChange', () => {
    test('is called at each state property change', async () => {
      const onStateChange = jest.fn()
      renderCombobox({onStateChange})

      await clickOnToggleButton()

      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: true,
          type: stateChangeTypes.ToggleButtonClick,
        }),
      )

      await changeInputValue('t')

      expect(onStateChange).toHaveBeenCalledTimes(2)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          inputValue: 't',
          type: stateChangeTypes.InputChange,
        }),
      )

      await mouseMoveItemAtIndex(2)

      expect(onStateChange).toHaveBeenCalledTimes(3)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 2,
          type: stateChangeTypes.ItemMouseMove,
        }),
      )

      await clickOnItemAtIndex(2)

      expect(onStateChange).toHaveBeenCalledTimes(4)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItem: items[2],
          highlightedIndex: -1,
          inputValue: items[2],
          type: stateChangeTypes.ItemClick,
        }),
      )

      await keyDownOnInput('{ArrowDown}')

      expect(onStateChange).toHaveBeenCalledTimes(5)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 2,
          type: stateChangeTypes.InputKeyDownArrowDown,
        }),
      )

      await keyDownOnInput('{End}')

      expect(onStateChange).toHaveBeenCalledTimes(6)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: items.length - 1,
          type: stateChangeTypes.InputKeyDownEnd,
        }),
      )

      await keyDownOnInput('{Home}')

      expect(onStateChange).toHaveBeenCalledTimes(7)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          type: stateChangeTypes.InputKeyDownHome,
        }),
      )

      await keyDownOnInput('{Enter}')

      expect(onStateChange).toHaveBeenCalledTimes(8)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
          selectedItem: items[0],
          inputValue: items[0],
          type: stateChangeTypes.InputKeyDownEnter,
        }),
      )

      await keyDownOnInput('{Escape}')

      expect(onStateChange).toHaveBeenCalledTimes(9)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItem: null,
          inputValue: '',
          type: stateChangeTypes.InputKeyDownEscape,
        }),
      )

      await keyDownOnInput('{ArrowUp}')

      expect(onStateChange).toHaveBeenCalledTimes(10)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: 25,
          isOpen: true,
          type: stateChangeTypes.InputKeyDownArrowUp,
        }),
      )

      await mouseMoveItemAtIndex(25)
      await mouseLeaveItemAtIndex(25)

      expect(onStateChange).toHaveBeenCalledTimes(11)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          highlightedIndex: -1,
          type: stateChangeTypes.MenuMouseLeave,
        }),
      )

      await tab()

      expect(onStateChange).toHaveBeenCalledTimes(12)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.InputBlur,
        }),
      )

      await clickOnInput()

      expect(onStateChange).toHaveBeenCalledTimes(13)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: true,
          type: stateChangeTypes.InputClick,
        }),
      )

      await clickOnInput()

      expect(onStateChange).toHaveBeenCalledTimes(14)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.InputClick,
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

      act(() => {
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
      `downshift: A component has changed the uncontrolled prop "selectedItem" to be controlled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`,
    )
  })

  test('that are controlled should not become uncontrolled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderCombobox({inputValue: 'controlled value'})

    rerender({})

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `downshift: A component has changed the controlled prop "inputValue" to be uncontrolled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`,
    )
  })
})
