import {act, renderHook} from '@testing-library/react'
import {
  clickOnItemAtIndex,
  clickOnToggleButton,
  getA11yStatusContainer,
  getItems,
  getLabel,
  getMenu,
  getToggleButton,
  keyDownOnToggleButton,
  renderSelect,
  renderUseSelect,
  stateChangeTestCases,
  tab,
} from '../testUtils'
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
      `Warning: Failed prop type: The prop \`items\` is marked as required in \`useSelect\`, but its value is \`undefined\`.`,
    )
  })

  test('id if passed will override downshift default', () => {
    renderSelect({
      id: 'my-custom-little-id',
    })
    const elements = [getToggleButton(), getMenu(), getLabel()]

    elements.forEach(element => {
      expect(element).toHaveAttribute(
        'id',
        expect.stringContaining('my-custom-little-id'),
      )
    })
  })

  describe('items', () => {
    test('if passed as empty then menu will not open', () => {
      renderSelect({items: [], isOpen: true})

      expect(getItems()).toHaveLength(0)
    })

    test('passed as objects should work with custom itemToString', async () => {
      renderSelect({
        items: [{str: 'aaa'}, {str: 'bbb'}],
        itemToString: item => item.str,
        initialIsOpen: true,
      })

      await keyDownOnToggleButton('b')

      expect(getToggleButton()).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(1),
      )
    })
  })

  describe('getA11yStatusMessage', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => {
      act(() => jest.runAllTimers())
    })
    afterAll(() => jest.useRealTimers())

    test('adds no status message element to the DOM if not passed', async () => {
      renderSelect({
        items,
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).not.toBeInTheDocument()
    })

    test('calls the function only on state changes', async () => {
      const getA11yStatusMessage = jest.fn()
      const {rerender} = renderSelect({
        getA11yStatusMessage,
      })

      await keyDownOnToggleButton('h')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith({
        inputValue: 'h',
        highlightedIndex: 15,
        isOpen: true,
        selectedItem: null
      })
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)

      getA11yStatusMessage.mockClear()
      rerender({getA11yStatusMessage})

      expect(getA11yStatusMessage).not.toHaveBeenCalled()
    })

    test('adds a status message element with the text returned', async () => {
      const a11yStatusMessage1 = 'Dropdown is open'
      const a11yStatusMessage2 = 'Dropdown is still open'
      const getA11yStatusMessage = jest
        .fn()
        .mockReturnValueOnce(a11yStatusMessage1)
        .mockReturnValueOnce(a11yStatusMessage2)
      renderSelect({
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

      await keyDownOnToggleButton('{ArrowDown}')

      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith({
        highlightedIndex: 0,
        inputValue: '',
        isOpen: true,
        selectedItem: null,
      })
    })

    test('clears the text content after 500ms', async () => {
      renderSelect({
        items,
        getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate(true)

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
    })

    test('removes the message element from the DOM on unmount', async () => {
      const {unmount} = renderSelect({
        items,
        getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()
      act(() => jest.advanceTimersByTime(500))
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
      renderSelect({
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
    renderSelect({
      isOpen: true,
      highlightedIndex,
    })
    const toggleButton = getToggleButton()
    const keys = [
      '{ArrowDown}',
      '{End}',
      '{ArrowUp}',
      '{PageUp}',
      '{PageDown}',
      'c',
    ]

    expect(toggleButton).toHaveAttribute(
      'aria-activedescendant',
      defaultIds.getItemId(highlightedIndex),
    )

    for (const key of keys) {
      // eslint-disable-next-line no-await-in-loop
      await keyDownOnToggleButton(key)

      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(highlightedIndex),
      )
    }
  })

  test('controls the state property if passed', async () => {
    renderSelect({isOpen: true})
    expect(getItems()).toHaveLength(items.length)
    await tab() // focus toggle button

    await clickOnToggleButton()
    expect(getItems()).toHaveLength(items.length)

    await keyDownOnToggleButton('{Escape}')
    expect(getItems()).toHaveLength(items.length)

    await tab()
    expect(getItems()).toHaveLength(items.length)
  })

  describe('selectedItem', () => {
    test('controls the state property if passed', async () => {
      const selectedItem = items[2]
      renderSelect({selectedItem, isOpen: true})
      const toggleButton = getToggleButton()

      expect(toggleButton).toHaveTextContent(items[2])

      await keyDownOnToggleButton('{ArrowDown}')
      await keyDownOnToggleButton('{Enter}')

      expect(toggleButton).toHaveTextContent(items[2])

      await clickOnItemAtIndex(4)

      expect(toggleButton).toHaveTextContent(items[2])
    })

    test('highlightedIndex on open gets computed based on the selectedItem prop value', async () => {
      const expectedHighlightedIndex = 2
      const selectedItem = items[expectedHighlightedIndex]
      renderSelect({selectedItem})
      const toggleButton = getToggleButton()

      expect(toggleButton).toHaveAttribute('aria-activedescendant', '')

      await clickOnToggleButton()

      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(expectedHighlightedIndex),
      )

      await keyDownOnToggleButton('{ArrowDown}')
      await keyDownOnToggleButton('{Enter}')

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])

      await clickOnToggleButton()
      await clickOnItemAtIndex(3)

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])
    })

    test('highlightedIndex computed based on the selectedItem prop value in initial state as well', async () => {
      const expectedHighlightedIndex = 2
      const selectedItem = items[expectedHighlightedIndex]
      // open dropdown in the initial state to check highlighted index.
      renderSelect({selectedItem, initialIsOpen: true})
      const toggleButton = getToggleButton()

      expect(toggleButton).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(expectedHighlightedIndex),
      )

      await keyDownOnToggleButton('{ArrowDown}')
      await keyDownOnToggleButton('{Enter}')

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])
      await clickOnToggleButton()
      await clickOnItemAtIndex(3)

      expect(toggleButton).toHaveTextContent(items[expectedHighlightedIndex])
    })
  })

  describe('stateReducer', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => {
      act(() => jest.runAllTimers())
    })
    afterAll(jest.useRealTimers)

    test('is called at each state change with the function change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {result} = renderUseSelect({stateReducer})

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
      renderSelect({stateReducer})
      const initialState = {
        isOpen: false,
        highlightedIndex: -1,
        selectedItem: null,
        inputValue: '',
      }

      expect(stateReducer).not.toHaveBeenCalled()

      for (let index = 0; index < stateChangeTestCases.length; index++) {
        const {step, state, arg, type} = stateChangeTestCases[index]
        const previousState =
          // eslint-disable-next-line jest/no-conditional-in-test
          stateChangeTestCases[index - 1]?.state ?? initialState

        // eslint-disable-next-line no-await-in-loop
        await step(arg)

        expect(stateReducer).toHaveBeenCalledTimes(index + 1)
        expect(stateReducer).toHaveBeenLastCalledWith(
          previousState,
          expect.objectContaining({changes: state, type}),
        )
      }
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
      renderSelect({stateReducer})

      await clickOnToggleButton()
    })

    // should check that no blur state change occurs after item selection.
    // https://github.com/downshift-js/downshift/issues/965
    test('is called only once on item selection', async () => {
      const stateReducer = jest.fn((s, a) => a.changes)

      renderSelect({
        stateReducer,
        initialIsOpen: true,
        initialHighlightedIndex: 0,
      })

      await clickOnItemAtIndex(0)

      expect(stateReducer).toHaveBeenCalledTimes(1)

      await clickOnToggleButton()
      await keyDownOnToggleButton('{ArrowDown}')
      await keyDownOnToggleButton('{Enter}')

      expect(stateReducer).toHaveBeenCalledTimes(4)

      await clickOnToggleButton()
      await keyDownOnToggleButton('{ArrowDown}')
      await keyDownOnToggleButton(' ')

      expect(stateReducer).toHaveBeenCalledTimes(7)
    })

    test('changes are visible in onChange handlers', async () => {
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
      renderSelect({
        stateReducer,
        onStateChange,
        onSelectedItemChange,
        onHighlightedIndexChange,
        onIsOpenChange,
      })

      await clickOnToggleButton()

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
    test('is called at selectedItem change', async () => {
      const onSelectedItemChange = jest.fn()
      const index = 2
      renderSelect({
        initialIsOpen: true,
        onSelectedItemChange,
      })

      await clickOnItemAtIndex(index)

      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[index],
          type: stateChangeTypes.ItemClick,
        }),
      )
    })

    test('is not called at if selectedItem is the same', async () => {
      const index = 1
      const onSelectedItemChange = jest.fn()
      renderSelect({
        initialIsOpen: true,
        initialSelectedItem: items[index],
        onSelectedItemChange,
      })

      await clickOnItemAtIndex(index)

      expect(onSelectedItemChange).not.toHaveBeenCalled()
    })

    test('works correctly with the corresponding control prop', async () => {
      let selectedItem = items[2]
      const selectionIndex = 3
      const {rerender} = renderSelect({
        initialIsOpen: true,
        selectedItem,
        onSelectedItemChange: changes => {
          selectedItem = changes.selectedItem
        },
      })

      await clickOnItemAtIndex(selectionIndex)
      rerender({selectedItem})

      expect(getToggleButton()).toHaveTextContent(items[selectionIndex])
    })

    test('can have downshift actions executed', () => {
      const {result} = renderUseSelect({
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
      renderSelect({
        initialIsOpen: true,
        onHighlightedIndexChange,
      })

      await keyDownOnToggleButton('{ArrowDown}')

      expect(onHighlightedIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        }),
      )
    })

    test('is not called if highlightedIndex is the same', async () => {
      const onHighlightedIndexChange = jest.fn()
      renderSelect({
        initialIsOpen: true,
        initialHighlightedIndex: 0,
        onHighlightedIndexChange,
      })

      await keyDownOnToggleButton('{ArrowUp}')

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()

      await keyDownOnToggleButton('{Home}')

      expect(onHighlightedIndexChange).not.toHaveBeenCalled()
    })

    test('is called on first open when initialSelectedItem is set', async () => {
      const index = 2
      const onHighlightedIndexChange = jest.fn()
      renderSelect({
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
      renderSelect({
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
      renderSelect({
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
      const {rerender} = renderSelect({
        isOpen: true,
        highlightedIndex,
        onHighlightedIndexChange: changes => {
          highlightedIndex = changes.highlightedIndex
        },
      })

      await keyDownOnToggleButton('{ArrowDown}')
      rerender({isOpen: true, highlightedIndex})

      expect(getToggleButton()).toHaveAttribute(
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

      act(() => {
        result.current
          .getToggleButtonProps()
          .onKeyDown({key: 'ArrowDown', preventDefault: jest.fn()})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onIsOpenChange', () => {
    test('is called at each isOpen change', async () => {
      const onIsOpenChange = jest.fn()
      renderSelect({
        initialIsOpen: true,
        onIsOpenChange,
      })

      await keyDownOnToggleButton('{Escape}')

      expect(onIsOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: false,
          type: stateChangeTypes.ToggleButtonKeyDownEscape,
        }),
      )
    })

    test('is not called at if isOpen is the same', async () => {
      const onIsOpenChange = jest.fn()
      renderSelect({
        defaultIsOpen: true,
        onIsOpenChange,
      })

      await clickOnItemAtIndex(0)

      expect(onIsOpenChange).not.toHaveBeenCalledWith()
    })

    test('works correctly with the corresponding control prop', async () => {
      let isOpen = true
      const {rerender} = renderSelect({
        isOpen,
        onIsOpenChange: changes => {
          isOpen = changes.isOpen
        },
      })

      await keyDownOnToggleButton('{Escape}')
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

      act(() => {
        result.current.getToggleButtonProps().onClick({})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onStateChange', () => {
    beforeEach(() => jest.useFakeTimers())
    beforeEach(jest.clearAllTimers)
    afterAll(jest.useRealTimers)
    test('is called at each state property change but only with changed props', async () => {
      jest.useFakeTimers()
      const onStateChange = jest.fn()
      const initialState = {
        isOpen: false,
        highlightedIndex: -1,
        selectedItem: null,
        inputValue: '',
      }

      renderSelect({onStateChange})

      for (let index = 0; index < stateChangeTestCases.length; index++) {
        const {step, state, arg, type} = stateChangeTestCases[index]
        const previousState =
          // eslint-disable-next-line jest/no-conditional-in-test
          stateChangeTestCases[index - 1]?.state ?? initialState
        const newState = Object.keys(state).reduce(
          (acc, key) =>
            // eslint-disable-next-line jest/no-conditional-in-test
            state[key] === previousState[key]
              ? acc
              : {...acc, [key]: state[key]},
          {},
        )

        // eslint-disable-next-line no-await-in-loop
        await step(arg)

        expect(onStateChange).toHaveBeenCalledTimes(index + 1)
        expect(onStateChange).toHaveBeenLastCalledWith(
          expect.objectContaining({
            ...newState,
            type,
          }),
        )
      }

      jest.runAllTimers()
      jest.useRealTimers()
    })

    test('can have downshift actions executed', () => {
      const {result} = renderUseSelect({
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
    const {rerender} = renderSelect()

    rerender({isOpen: true})

    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `downshift: A component has changed the uncontrolled prop "isOpen" to be controlled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`,
    )
  })

  test('that are controlled should not become uncontrolled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderSelect({highlightedIndex: 3})

    rerender({})

    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `downshift: A component has changed the controlled prop "highlightedIndex" to be uncontrolled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`,
    )
  })
})
