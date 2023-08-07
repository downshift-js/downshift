import {renderHook, act as hooksAct} from '@testing-library/react-hooks'
import {act} from '@testing-library/react'
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
      jest.useFakeTimers()
      renderSelect({
        items: [{str: 'aaa'}, {str: 'bbb'}],
        itemToString: item => item.str,
        initialIsOpen: true,
      })

      await clickOnItemAtIndex(0)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'aaa has been selected.',
      )
    })
  })

  test('itemToString should provide string version to a11y status message', async () => {
    jest.useFakeTimers()
    renderSelect({
      itemToString: () => 'custom-item',
      initialIsOpen: true,
    })

    await clickOnItemAtIndex(0)
    waitForDebouncedA11yStatusUpdate()

    expect(getA11yStatusContainer()).toHaveTextContent(
      'custom-item has been selected.',
    )
    jest.useRealTimers()
  })

  describe('itemToKey', () => {
    const itemsAsObjects = items.reduce(
      (acc, item) => [...acc, {value: item, id: item}],
      [],
    )

    test('if passed, the initial highlightedIndex will have the value of the selectedItem index', () => {
      const itemIndex = 0
      const selectedItem = {...itemsAsObjects[itemIndex]}
      const itemToKey = jest.fn().mockReturnValue(item => item.id)

      renderSelect({
        itemToKey,
        selectedItem,
        initialIsOpen: true,
        items: itemsAsObjects,
      })

      expect(itemToKey).toHaveBeenCalledTimes(2) // 2x in getInitialState.
      expect(itemToKey.mock.calls[0][0]).toBe(itemsAsObjects[0])
      expect(itemToKey.mock.calls[1][0]).toBe(selectedItem)
      expect(getToggleButton()).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(itemIndex),
      )
    })

    test('if not passed, the initial highlightedIndex will not have the value of the selectedItem index if not referentially equal to any item', () => {
      const itemIndex = 0
      const selectedItem = {...itemsAsObjects[itemIndex]}

      renderSelect({
        selectedItem,
        initialIsOpen: true,
        items: itemsAsObjects,
      })

      expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
    })

    test('if passed, the highlightedIndex on open will have the value of the selectedItem index', async () => {
      const itemIndex = 0
      const itemToKey = jest.fn().mockReturnValue(item => item.id)
      const itemsAsObjectsCopy = itemsAsObjects.reduce(
        (acc, item) => [...acc, {...item}],
        [],
      )

      const {rerender} = renderSelect({
        itemToKey,
        initialIsOpen: true,
        items: itemsAsObjects,
      })

      await clickOnItemAtIndex(itemIndex)

      rerender({itemToKey, items: itemsAsObjectsCopy})
      await clickOnToggleButton()

      expect(itemToKey).toHaveBeenCalledTimes(2) // 2x in getHighlightedIndexOnOpen.
      expect(itemToKey.mock.calls[0][0]).toBe(itemsAsObjects[itemIndex])
      expect(itemToKey.mock.calls[1][0]).toBe(itemsAsObjectsCopy[itemIndex])
      expect(getToggleButton()).toHaveAttribute(
        'aria-activedescendant',
        defaultIds.getItemId(itemIndex),
      )
    })

    test('if not passed, the highlightedIndex on open will not have the value of the selectedItem index if not referentially equal to any item', async () => {
      const itemIndex = 0
      const itemsAsObjectsCopy = itemsAsObjects.reduce(
        (acc, item) => [...acc, {...item}],
        [],
      )

      const {rerender} = renderSelect({
        initialIsOpen: true,
        items: itemsAsObjects,
      })

      await clickOnItemAtIndex(itemIndex)

      rerender({items: itemsAsObjectsCopy})

      expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
    })
  })

  describe('getA11ySelectionMessage', () => {
    beforeEach(jest.useFakeTimers)
    beforeEach(jest.clearAllTimers)
    afterAll(jest.useRealTimers)

    test('reports that an item has been selected', async () => {
      const itemIndex = 0
      renderSelect({
        initialIsOpen: true,
      })

      await clickOnItemAtIndex(itemIndex)
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        `${items[itemIndex]} has been selected.`,
      )
    })

    test('is called with object that contains specific props', async () => {
      const getA11ySelectionMessage = jest.fn()
      const inputValue = 'a'
      const isOpen = true
      const highlightedIndex = 0
      renderSelect({
        getA11ySelectionMessage,
        inputValue,
        isOpen,
        highlightedIndex,
        items,
      })

      await clickOnItemAtIndex(0)
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

    test('is replaced with the user provided one', async () => {
      renderSelect({
        getA11ySelectionMessage: () => 'custom message',
        initialIsOpen: true,
      })

      await clickOnItemAtIndex(3)
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

    test('reports that no results are available if items list is empty', async () => {
      renderSelect({
        items: [],
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'No results are available',
      )
    })

    test('reports that one result is available if one item is shown', async () => {
      renderSelect({
        items: ['item1'],
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        '1 result is available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.',
      )
    })

    test('reports the number of results available if more than one item are shown', async () => {
      renderSelect({
        items: ['item1', 'item2'],
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(
        '2 results are available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.',
      )
    })

    test('is empty on menu close', async () => {
      renderSelect({
        items: ['item1', 'item2'],
        initialIsOpen: true,
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
    })

    test('is removed after 500ms as a cleanup', async () => {
      renderSelect({
        items: ['item1', 'item2'],
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()
      act(() => jest.advanceTimersByTime(500))

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
    })

    test('is replaced with the user provided one', async () => {
      renderSelect({
        getA11yStatusMessage: () => 'custom message',
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })

    test('is called with previousResultCount that gets updated correctly', async () => {
      const getA11yStatusMessage = jest.fn()
      const inputItems = ['aaa', 'bbb']
      renderSelect({
        getA11yStatusMessage,
        items: inputItems,
      })

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          previousResultCount: undefined,
          resultCount: inputItems.length,
        }),
      )

      inputItems.pop()
      await keyDownOnToggleButton('{ArrowDown}')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledTimes(2)
      expect(getA11yStatusMessage).toHaveBeenLastCalledWith(
        expect.objectContaining({
          previousResultCount: inputItems.length + 1,
          resultCount: inputItems.length,
        }),
      )
    })

    test('is called with object that contains specific props at toggle', async () => {
      const getA11yStatusMessage = jest.fn()
      const inputValue = 'a'
      const highlightedIndex = 1
      const initialSelectedItem = items[highlightedIndex]
      renderSelect({
        getA11yStatusMessage,
        inputValue,
        initialSelectedItem,
        selectedItem: items[highlightedIndex],
      })

      await clickOnToggleButton()
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

    test('is added to the document provided by the user as prop', async () => {
      const environment = {
        document: {
          getElementById: jest.fn(() => ({})),
          createElement: jest.fn(),
          activeElement: {},
          body: {},
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        Node,
      }
      renderSelect({items: [], environment})

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
    })

    test('is called when isOpen, highlightedIndex, inputValue or items change', async () => {
      const getA11yStatusMessage = jest.fn()
      const inputItems = ['aaa', 'bbb']
      const {rerender} = renderSelect({
        getA11yStatusMessage,
        items,
      })

      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).not.toHaveBeenCalled()

      // should not be called when any other prop is changed.
      rerender({getA11yStatusMessage, items, id: 'hello'})
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).not.toHaveBeenCalled()

      rerender({getA11yStatusMessage, items: inputItems})
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({resultCount: inputItems.length}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)

      await clickOnToggleButton()
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({isOpen: true}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(2)

      await keyDownOnToggleButton('b')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({inputValue: 'b', highlightedIndex: 1}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(3)

      await keyDownOnToggleButton('{ArrowUp}')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({highlightedIndex: 0}),
      )
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(4)
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

      hooksAct(() => {
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

      hooksAct(() => {
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

      hooksAct(() => {
        result.current.getToggleButtonProps().onClick({})
      })

      expect(result.current.highlightedIndex).toEqual(highlightedIndex)
    })
  })

  describe('onStateChange', () => {
    beforeEach(jest.useFakeTimers)
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
          stateChangeTestCases[index - 1]?.state ?? initialState
        const newState = Object.keys(state).reduce(
          (acc, key) =>
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

      hooksAct(() => {
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
