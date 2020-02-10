import {renderHook} from '@testing-library/react-hooks'
import {cleanup, act} from '@testing-library/react'
import {renderSelect, renderUseSelect} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import {items, defaultIds} from '../../testUtils'
import useSelect from '..'

jest.useFakeTimers()

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
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderSelect({
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
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderSelect({
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

    test('is called with object that contains specific props', () => {
      const getA11ySelectionMessage = jest.fn()
      const {clickOnItemAtIndex} = renderSelect({
        getA11ySelectionMessage,
        isOpen: true,
        items: [{str: 'ala'}],
        highlightedIndex: 0,
      })

      clickOnItemAtIndex(0)

      expect(getA11ySelectionMessage).toHaveBeenCalledTimes(1)
      expect(getA11ySelectionMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: expect.any(Number),
          inputValue: expect.any(String),
          isOpen: expect.any(Boolean),
          itemToString: expect.any(Function),
          resultCount: expect.any(Number),
          highlightedItem: expect.anything(),
          selectedItem: expect.anything(),
        }),
      )
    })

    test('is replaced with the user provided one', () => {
      const {clickOnItemAtIndex, getA11yStatusContainer} = renderSelect({
        getA11ySelectionMessage: () => 'custom message',
        initialIsOpen: true,
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
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: [],
      })

      clickOnToggleButton()

      expect(getA11yStatusContainer()).toHaveTextContent(
        'No results are available',
      )
    })

    test('reports that one result is available if one item is shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: ['item1'],
      })

      clickOnToggleButton()

      expect(getA11yStatusContainer()).toHaveTextContent(
        '1 result is available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.',
      )
    })

    test('reports the number of results available if more than one item are shown', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: ['item1', 'item2'],
      })

      clickOnToggleButton()

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

      expect(getA11yStatusContainer()).toHaveTextContent('')
    })

    test('is removed after 500ms as a cleanup', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        items: ['item1', 'item2'],
      })

      clickOnToggleButton()
      act(() => jest.advanceTimersByTime(500))

      expect(getA11yStatusContainer()).toHaveTextContent('')
    })

    test('is replaced with the user provided one', () => {
      const {clickOnToggleButton, getA11yStatusContainer} = renderSelect({
        getA11yStatusMessage: () => 'custom message',
      })

      clickOnToggleButton()

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })

    test('is called with object that contains specific props at toggle', () => {
      const getA11yStatusMessage = jest.fn()
      const {clickOnToggleButton} = renderSelect({
        getA11yStatusMessage,
        highlightedIndex: 0,
        selectedItem: items[0],
      })

      clickOnToggleButton()

      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: expect.any(Number),
          inputValue: expect.any(String),
          isOpen: expect.any(Boolean),
          itemToString: expect.any(Function),
          resultCount: expect.any(Number),
          highlightedItem: expect.anything(),
          selectedItem: expect.anything(),
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

      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
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

      expect(toggleButton.textContent).toEqual(items[2])
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
    test('is called at each state change with the function change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {result} = renderUseSelect({stateReducer})

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
        blurMenu,
        mouseLeaveMenu,
        keyDownOnToggleButton,
        keyDownOnMenu,
        mouseMoveItemAtIndex,
        clickOnItemAtIndex,
      } = renderSelect({stateReducer, isOpen: true})

      expect(stateReducer).not.toHaveBeenCalled()

      clickOnToggleButton()

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ToggleButtonClick}),
      )

      keyDownOnMenu('c')

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownCharacter,
        }),
      )

      keyDownOnMenu('ArrowDown')

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownArrowDown,
        }),
      )

      keyDownOnMenu('ArrowUp')

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownArrowUp,
        }),
      )

      keyDownOnMenu('End')

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownEnd,
        }),
      )

      keyDownOnMenu('Home')

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownHome,
        }),
      )

      keyDownOnMenu('Enter')

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownEnter,
        }),
      )

      keyDownOnMenu('Escape')

      expect(stateReducer).toHaveBeenCalledTimes(8)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownEscape,
        }),
      )

      keyDownOnMenu(' ')

      expect(stateReducer).toHaveBeenCalledTimes(9)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.MenuKeyDownSpaceButton,
        }),
      )

      mouseLeaveMenu()

      expect(stateReducer).toHaveBeenCalledTimes(10)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.MenuMouseLeave}),
      )

      keyDownOnToggleButton('ArrowDown')

      expect(stateReducer).toHaveBeenCalledTimes(11)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.ToggleButtonKeyDownArrowDown,
        }),
      )

      keyDownOnToggleButton('ArrowUp')

      expect(stateReducer).toHaveBeenCalledTimes(12)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.ToggleButtonKeyDownArrowUp,
        }),
      )

      keyDownOnToggleButton('f')

      expect(stateReducer).toHaveBeenCalledTimes(13)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.ToggleButtonKeyDownCharacter,
        }),
      )

      blurMenu()

      expect(stateReducer).toHaveBeenCalledTimes(14)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.MenuBlur}),
      )

      mouseMoveItemAtIndex(5)

      expect(stateReducer).toHaveBeenCalledTimes(15)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({type: stateChangeTypes.ItemMouseMove}),
      )

      clickOnItemAtIndex(5)

      expect(stateReducer).toHaveBeenCalledTimes(16)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({}),
        expect.objectContaining({
          type: stateChangeTypes.ItemClick,
        }),
      )
    })

    test('receives a downshift action type', () => {
      const stateReducer = jest.fn((s, a) => {
        expect(a.type).toBe(useSelect.stateChangeTypes.ToggleButtonClick)
        return a.changes
      })
      const {clickOnToggleButton} = renderSelect({stateReducer})

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
      const {clickOnToggleButton} = renderSelect({stateReducer})

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
      const {clickOnToggleButton} = renderSelect({
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
      expect(onStateChange).toHaveBeenCalledWith(
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
      const index = 2
      const {clickOnItemAtIndex} = renderSelect({
        initialIsOpen: true,
        onSelectedItemChange,
      })

      clickOnItemAtIndex(index)

      expect(onSelectedItemChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[index],
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
  })

  describe('onStateChange', () => {
    test('is called at each state property change', () => {
      const onStateChange = jest.fn()
      const {
        clickOnToggleButton,
        keyDownOnToggleButton,
        clickOnItemAtIndex,
      } = renderSelect({onStateChange})

      clickOnToggleButton()
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: true,
        }),
      )

      keyDownOnToggleButton('ArrowDown')
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndex: 0,
        }),
      )

      clickOnItemAtIndex(0)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: items[0],
        }),
      )
    })
  })
})
