import {act} from '@testing-library/react-hooks'

import * as stateChangeTypes from '../stateChangeTypes'
import {renderUseMultipleSelection, renderMultipleCombobox} from '../testUtils'
import {items} from '../../testUtils'

jest.useFakeTimers()

describe('props', () => {
  test('if falsy then no prop types error is thrown', () => {
    global.console.error = jest.fn()
    renderUseMultipleSelection()

    expect(global.console.error).not.toBeCalled()
    global.console.error.mockRestore()
  })

  describe('items', () => {
    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('passed as objects should work with custom itemToString', () => {
      const {
        keyDownOnSelectedItemAtIndex,
        getA11yStatusContainer,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [{str: 'aaa'}, {str: 'bbb'}],
          initialActiveIndex: 0,
          itemToString: item => item.str,
        },
      })

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(getA11yStatusContainer()).toHaveTextContent(
        'aaa has been removed.',
      )
    })

    test('controls the state property if passed', () => {
      const inputItems = [items[0], items[1]]
      const {
        keyDownOnSelectedItemAtIndex,
        getSelectedItems,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          items: inputItems,
          initialActiveIndex: 0,
        },
      })

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(getSelectedItems()).toHaveLength(2)
    })
  })

  describe('getA11yRemovalMessage', () => {
    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('is called with object that contains specific props', () => {
      const getA11yRemovalMessage = jest.fn()
      const itemToString = item => item.str
      const initialItems = [{str: 'aaa'}, {str: 'bbb'}]
      const {keyDownOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems,
          initialActiveIndex: 0,
          itemToString,
          getA11yRemovalMessage,
        },
      })

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(getA11yRemovalMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          itemToString,
          resultCount: 1,
          removedItem: initialItems[0],
        }),
      )
    })

    test('is replaced with the user provided one', () => {
      const initialItems = [items[0], items[1]]
      const {
        keyDownOnSelectedItemAtIndex,
        getA11yStatusContainer,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems,
          initialActiveIndex: 0,
          getA11yRemovalMessage: () => 'custom message',
        },
      })

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(getA11yStatusContainer()).toHaveTextContent('custom message')
    })
  })

  describe('activeIndex', () => {
    test('controls the state property if passed', () => {
      const {
        keyDownOnSelectedItemAtIndex,
        clickOnSelectedItemAtIndex,
        getSelectedItemAtIndex,
        focusSelectedItemAtIndex,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1]],
          activeIndex: 1,
        },
      })

      focusSelectedItemAtIndex(1)
      clickOnSelectedItemAtIndex(0)

      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
      expect(getSelectedItemAtIndex(1)).toHaveFocus()

      keyDownOnSelectedItemAtIndex(1, 'ArrowLeft')

      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
      expect(getSelectedItemAtIndex(1)).toHaveFocus()

      keyDownOnSelectedItemAtIndex(1, 'ArrowRight')

      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
      expect(getSelectedItemAtIndex(1)).toHaveFocus()
    })
  })

  describe('stateReducer', () => {
    test('is called at each state change with the function change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {result} = renderUseMultipleSelection({stateReducer})

      act(() => {
        result.current.addItem(items[0])
      })

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            items: expect.arrayContaining([items[0]]),
          }),
          type: stateChangeTypes.FunctionAddItem,
        }),
      )

      act(() => {
        result.current.removeItem(items[0])
      })

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([items[0]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            items: expect.arrayContaining([]),
          }),
          type: stateChangeTypes.FunctionRemoveItem,
        }),
      )

      act(() => {
        result.current.setItems([items[0], items[1]])
      })

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            items: expect.arrayContaining([items[0], items[1]]),
          }),
          type: stateChangeTypes.FunctionSetItems,
        }),
      )

      act(() => {
        result.current.setActiveIndex(1)
      })

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: -1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: 1,
          }),
          type: stateChangeTypes.FunctionSetActiveIndex,
        }),
      )

      act(() => {
        result.current.reset()
      })

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([items[0], items[1]]),
          activeIndex: 1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            items: expect.arrayContaining([]),
            activeIndex: -1,
          }),
          type: stateChangeTypes.FunctionReset,
        }),
      )
    })

    test('is called at each state change with the appropriate change type', () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      const {
        keyDownOnSelectedItemAtIndex,
        clickOnSelectedItemAtIndex,
        keyDownOnDropdown,
        input,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1], items[2]],
          stateReducer,
        },
      })

      input.focus()
      keyDownOnDropdown('Backspace')

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([items[0], items[1], items[2]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            items: expect.arrayContaining([items[0], items[1]]),
          }),
          type: stateChangeTypes.DropdownKeyDownBackspace,
        }),
      )

      keyDownOnDropdown('ArrowLeft')

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({activeIndex: -1}),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: 1,
          }),
          type: stateChangeTypes.DropdownKeyDownArrowLeft,
        }),
      )

      keyDownOnSelectedItemAtIndex(1, 'ArrowLeft')

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({activeIndex: 1}),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: 0,
          }),
          type: stateChangeTypes.ItemKeyDownArrowLeft,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'ArrowRight')

      expect(stateReducer).toHaveBeenCalledTimes(4)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({activeIndex: 0}),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: 1,
          }),
          type: stateChangeTypes.ItemKeyDownArrowRight,
        }),
      )

      clickOnSelectedItemAtIndex(0)

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({activeIndex: 1}),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: 0,
          }),
          type: stateChangeTypes.ItemClick,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([items[0], items[1]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            items: expect.arrayContaining([items[1]]),
          }),
          type: stateChangeTypes.ItemKeyDownDelete,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Backspace')

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([items[1]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            items: expect.arrayContaining([]),
          }),
          type: stateChangeTypes.ItemKeyDownBackspace,
        }),
      )
    })

    test('replaces prop values with user defined', () => {
      const stateReducer = jest.fn((s, a) => {
        const changes = a.changes
        changes.activeIndex = 0
        return changes
      })
      const {
        clickOnSelectedItemAtIndex,
        getSelectedItemAtIndex,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1]],
          stateReducer,
        },
      })

      clickOnSelectedItemAtIndex(1)

      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
      expect(getSelectedItemAtIndex(0)).toHaveFocus()
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
      const {clickOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1]],
          stateReducer,
        },
      })

      clickOnSelectedItemAtIndex(0)
    })

    test('changes are visible in onChange handlers', () => {
      const activeIndex = 0
      const inputItems = ['foo', 'bar']
      const stateReducer = jest.fn(() => ({
        activeIndex,
        items: [],
      }))
      const onItemsChange = jest.fn()
      const onActiveIndexChange = jest.fn()
      const onStateChange = jest.fn()
      const {keyDownOnDropdown} = renderMultipleCombobox({
        multipleSelectionProps: {
          stateReducer,
          onStateChange,
          onActiveIndexChange,
          onItemsChange,
          items: inputItems,
        },
      })

      keyDownOnDropdown('ArrowLeft')

      expect(onActiveIndexChange).toHaveBeenCalledTimes(1)
      expect(onActiveIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeIndex,
        }),
      )
      expect(onActiveIndexChange).toHaveBeenCalledTimes(1)
      expect(onItemsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [],
        }),
      )
      expect(onActiveIndexChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeIndex,
          items: [],
          type: stateChangeTypes.DropdownKeyDownArrowLeft,
        }),
      )
    })
  })

  describe('onActiveIndexChange', () => {
    test('is called at activeIndex change', () => {
      const onActiveIndexChange = jest.fn()
      const {clickOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1]],
          onActiveIndexChange,
        },
      })

      clickOnSelectedItemAtIndex(1)

      expect(onActiveIndexChange).toHaveBeenCalledTimes(1)
      expect(onActiveIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeIndex: 1,
        }),
      )
    })

    test('is not called at if selectedItem is the same', () => {
      const onActiveIndexChange = jest.fn()
      const {clickOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1]],
          onActiveIndexChange,
          initialActiveIndex: 1,
        },
      })

      clickOnSelectedItemAtIndex(1)

      expect(onActiveIndexChange).not.toHaveBeenCalled()
    })
  })

  describe('onItemsChange', () => {
    test('is called at items change', () => {
      const onItemsChange = jest.fn()
      const {keyDownOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1]],
          onItemsChange,
          initialActiveIndex: 1,
        },
      })

      keyDownOnSelectedItemAtIndex(1, 'Delete')

      expect(onItemsChange).toHaveBeenCalledTimes(1)
      expect(onItemsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [items[0]],
        }),
      )
    })

    test('is not called at if items is the same', () => {
      const onItemsChange = jest.fn()
      const {clickOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1]],
          onItemsChange,
          initialActiveIndex: 1,
        },
      })

      clickOnSelectedItemAtIndex(0)

      expect(onItemsChange).not.toHaveBeenCalled()
    })
  })

  describe('onStateChange', () => {
    test('is called at each state property change', () => {
      const onStateChange = jest.fn()
      const {
        keyDownOnSelectedItemAtIndex,
        clickOnSelectedItemAtIndex,
        keyDownOnDropdown,
        input,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialItems: [items[0], items[1], items[2]],
          onStateChange,
        },
      })

      input.focus()
      keyDownOnDropdown('Backspace')

      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([items[0], items[1]]),
          type: stateChangeTypes.DropdownKeyDownBackspace,
        }),
      )

      keyDownOnDropdown('ArrowLeft')

      expect(onStateChange).toHaveBeenCalledTimes(2)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 1,
          type: stateChangeTypes.DropdownKeyDownArrowLeft,
        }),
      )

      keyDownOnSelectedItemAtIndex(1, 'ArrowLeft')

      expect(onStateChange).toHaveBeenCalledTimes(3)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 0,
          type: stateChangeTypes.ItemKeyDownArrowLeft,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'ArrowRight')

      expect(onStateChange).toHaveBeenCalledTimes(4)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 1,
          type: stateChangeTypes.ItemKeyDownArrowRight,
        }),
      )

      clickOnSelectedItemAtIndex(0)

      expect(onStateChange).toHaveBeenCalledTimes(5)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 0,
          type: stateChangeTypes.ItemClick,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(onStateChange).toHaveBeenCalledTimes(6)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([items[1]]),
          type: stateChangeTypes.ItemKeyDownDelete,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Backspace')

      expect(onStateChange).toHaveBeenCalledTimes(7)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([]),
          type: stateChangeTypes.ItemKeyDownBackspace,
        }),
      )
    })
  })
})
