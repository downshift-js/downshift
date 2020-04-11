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

  describe('selectedItems', () => {
    afterEach(() => {
      act(() => jest.runAllTimers())
    })

    test('passed as objects should work with custom itemToString', () => {
      const {
        keyDownOnSelectedItemAtIndex,
        getA11yStatusContainer,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [{str: 'aaa'}, {str: 'bbb'}],
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
          selectedItems: inputItems,
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
      const initialSelectedItems = [{str: 'aaa'}, {str: 'bbb'}]
      const {keyDownOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems,
          initialActiveIndex: 0,
          itemToString,
          getA11yRemovalMessage,
          activeIndex: 0,
        },
      })

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(getA11yRemovalMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          itemToString,
          resultCount: 1,
          removedSelectedItem: initialSelectedItems[0],
          activeIndex: 0,
          activeSelectedItem: initialSelectedItems[1],
        }),
      )
    })

    test('is replaced with the user provided one', () => {
      const initialSelectedItems = [items[0], items[1]]
      const {
        keyDownOnSelectedItemAtIndex,
        getA11yStatusContainer,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems,
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
          initialSelectedItems: [items[0], items[1]],
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
        result.current.addSelectedItem(items[0])
      })

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItems: expect.arrayContaining([items[0]]),
          }),
          type: stateChangeTypes.FunctionAddSelectedItem,
        }),
      )

      act(() => {
        result.current.removeSelectedItem(items[0])
      })

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[0]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItems: expect.arrayContaining([]),
          }),
          type: stateChangeTypes.FunctionRemoveSelectedItem,
        }),
      )

      act(() => {
        result.current.setSelectedItems([items[0], items[1]])
      })

      expect(stateReducer).toHaveBeenCalledTimes(3)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItems: expect.arrayContaining([items[0], items[1]]),
          }),
          type: stateChangeTypes.FunctionSetSelectedItems,
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
          selectedItems: expect.arrayContaining([items[0], items[1]]),
          activeIndex: 1,
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItems: expect.arrayContaining([]),
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
        keyDownOnInput,
        input,
        clickOnInput,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1], items[2]],
          stateReducer,
        },
      })

      input.focus()
      keyDownOnInput('Backspace')

      expect(stateReducer).toHaveBeenCalledTimes(1)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[0], items[1], items[2]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItems: expect.arrayContaining([items[0], items[1]]),
          }),
          type: stateChangeTypes.DropdownKeyDownBackspace,
        }),
      )

      keyDownOnInput('ArrowLeft')

      expect(stateReducer).toHaveBeenCalledTimes(2)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({activeIndex: -1}),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: 1,
          }),
          type: stateChangeTypes.DropdownKeyDownNavigationPrevious,
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
          type: stateChangeTypes.SelectedItemKeyDownNavigationPrevious,
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
          type: stateChangeTypes.SelectedItemKeyDownNavigationNext,
        }),
      )

      clickOnInput()

      expect(stateReducer).toHaveBeenCalledTimes(5)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({activeIndex: 1}),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: -1,
          }),
          type: stateChangeTypes.DropdownClick,
        }),
      )

      clickOnSelectedItemAtIndex(0)

      expect(stateReducer).toHaveBeenCalledTimes(6)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({activeIndex: -1}),
        expect.objectContaining({
          changes: expect.objectContaining({
            activeIndex: 0,
          }),
          type: stateChangeTypes.SelectedItemClick,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(stateReducer).toHaveBeenCalledTimes(7)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[0], items[1]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItems: expect.arrayContaining([items[1]]),
          }),
          type: stateChangeTypes.SelectedItemKeyDownDelete,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Backspace')

      expect(stateReducer).toHaveBeenCalledTimes(8)
      expect(stateReducer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[1]]),
        }),
        expect.objectContaining({
          changes: expect.objectContaining({
            selectedItems: expect.arrayContaining([]),
          }),
          type: stateChangeTypes.SelectedItemKeyDownBackspace,
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
          initialSelectedItems: [items[0], items[1]],
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
          initialSelectedItems: [items[0], items[1]],
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
        selectedItems: [],
      }))
      const onSelectedItemsChange = jest.fn()
      const onActiveIndexChange = jest.fn()
      const onStateChange = jest.fn()
      const {keyDownOnInput} = renderMultipleCombobox({
        multipleSelectionProps: {
          stateReducer,
          onStateChange,
          onActiveIndexChange,
          onSelectedItemsChange,
          selectedItems: inputItems,
        },
      })

      keyDownOnInput('ArrowLeft')

      expect(onActiveIndexChange).toHaveBeenCalledTimes(1)
      expect(onActiveIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeIndex,
        }),
      )
      expect(onSelectedItemsChange).toHaveBeenCalledTimes(1)
      expect(onSelectedItemsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItems: [],
        }),
      )
      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeIndex,
          selectedItems: [],
          type: stateChangeTypes.DropdownKeyDownNavigationPrevious,
        }),
      )
    })
  })

  describe('onActiveIndexChange', () => {
    test('is called at activeIndex change', () => {
      const onActiveIndexChange = jest.fn()
      const {clickOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
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
          initialSelectedItems: [items[0], items[1]],
          onActiveIndexChange,
          initialActiveIndex: 1,
        },
      })

      clickOnSelectedItemAtIndex(1)

      expect(onActiveIndexChange).not.toHaveBeenCalled()
    })
  })

  describe('onSelectedItemsChange', () => {
    test('is called at items change', () => {
      const onSelectedItemsChange = jest.fn()
      const {keyDownOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          onSelectedItemsChange,
          initialActiveIndex: 1,
        },
      })

      keyDownOnSelectedItemAtIndex(1, 'Delete')

      expect(onSelectedItemsChange).toHaveBeenCalledTimes(1)
      expect(onSelectedItemsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItems: [items[0]],
        }),
      )
    })

    test('is not called at if items is the same', () => {
      const onSelectedItemsChange = jest.fn()
      const {clickOnSelectedItemAtIndex} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          onSelectedItemsChange,
          initialActiveIndex: 1,
        },
      })

      clickOnSelectedItemAtIndex(0)

      expect(onSelectedItemsChange).not.toHaveBeenCalled()
    })
  })

  describe('onStateChange', () => {
    test('is called at each state property change', () => {
      const onStateChange = jest.fn()
      const {
        keyDownOnSelectedItemAtIndex,
        clickOnSelectedItemAtIndex,
        keyDownOnInput,
        input,
      } = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1], items[2]],
          onStateChange,
        },
      })

      input.focus()
      keyDownOnInput('Backspace')

      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[0], items[1]]),
          type: stateChangeTypes.DropdownKeyDownBackspace,
        }),
      )

      keyDownOnInput('ArrowLeft')

      expect(onStateChange).toHaveBeenCalledTimes(2)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 1,
          type: stateChangeTypes.DropdownKeyDownNavigationPrevious,
        }),
      )

      keyDownOnSelectedItemAtIndex(1, 'ArrowLeft')

      expect(onStateChange).toHaveBeenCalledTimes(3)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 0,
          type: stateChangeTypes.SelectedItemKeyDownNavigationPrevious,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'ArrowRight')

      expect(onStateChange).toHaveBeenCalledTimes(4)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 1,
          type: stateChangeTypes.SelectedItemKeyDownNavigationNext,
        }),
      )

      clickOnSelectedItemAtIndex(0)

      expect(onStateChange).toHaveBeenCalledTimes(5)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 0,
          type: stateChangeTypes.SelectedItemClick,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Delete')

      expect(onStateChange).toHaveBeenCalledTimes(6)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[1]]),
          type: stateChangeTypes.SelectedItemKeyDownDelete,
        }),
      )

      keyDownOnSelectedItemAtIndex(0, 'Backspace')

      expect(onStateChange).toHaveBeenCalledTimes(7)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([]),
          type: stateChangeTypes.SelectedItemKeyDownBackspace,
        }),
      )
    })
  })

  test('overrides navigation previos and next keys correctly', () => {
    const {
      keyDownOnInput,
      getSelectedItemAtIndex,
      keyDownOnSelectedItemAtIndex,
      input,
    } = renderMultipleCombobox({
      multipleSelectionProps: {
        keyNavigationPrevious: 'ArrowUp',
        keyNavigationNext: 'ArrowDown',
        initialSelectedItems: [items[0], items[1]],
      },
    })

    keyDownOnInput('ArrowUp')

    expect(getSelectedItemAtIndex(1)).toHaveFocus()

    keyDownOnSelectedItemAtIndex(1, 'ArrowUp')

    expect(getSelectedItemAtIndex(0)).toHaveFocus()

    keyDownOnSelectedItemAtIndex(0, 'ArrowDown')

    expect(getSelectedItemAtIndex(1)).toHaveFocus()

    keyDownOnSelectedItemAtIndex(1, 'ArrowDown')

    expect(input).toHaveFocus()
  })
})
