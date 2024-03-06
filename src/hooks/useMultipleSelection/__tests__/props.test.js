import {act, renderHook} from '@testing-library/react'
import * as stateChangeTypes from '../stateChangeTypes'
import {
  renderUseMultipleSelection,
  renderMultipleCombobox,
  keyDownOnSelectedItemAtIndex,
  getSelectedItems,
  focusSelectedItemAtIndex,
  clickOnSelectedItemAtIndex,
  getSelectedItemAtIndex,
  clickOnInput,
  getA11yStatusContainer,
  getInput,
  items,
  keyDownOnInput,
  waitForDebouncedA11yStatusUpdate,
} from '../testUtils'
import useMultipleSelection from '..'

jest.useFakeTimers()

describe('props', () => {
  test('if falsy then no prop types error is thrown', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})

    renderHook(() => {
      const {getDropdownProps} = useMultipleSelection()
      getDropdownProps({}, {suppressRefError: true})
    })

    // eslint-disable-next-line no-console
    expect(console.error).not.toHaveBeenCalled()
  })

  describe('selectedItems', () => {
    test('control the state property if passed', async () => {
      const inputItems = [items[0], items[1]]

      renderMultipleCombobox({
        multipleSelectionProps: {
          selectedItems: inputItems,
          initialActiveIndex: 0,
        },
      })

      await keyDownOnSelectedItemAtIndex(0, '{Delete}')

      expect(getSelectedItems()).toHaveLength(2)
    })
  })

  describe('getA11yStatusMessage', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => {
      act(jest.runAllTimers)
    })
    afterAll(jest.useRealTimers)

    test('adds no status message element to the DOM if not passed', async () => {
      renderMultipleCombobox({
        multipleSelectionProps: {
          selectedItems: [items[0], items[1]],
          initialActiveIndex: 0,
        },
      })

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).not.toBeInTheDocument()
    })

    test('adds a status message element with the text returned', async () => {
      const a11yStatusMessage1 = 'to the left to the left'
      const a11yStatusMessage2 = 'to the right?'
      const selectedItems = [items[0], items[1]]
      const getA11yStatusMessage = jest
        .fn()
        .mockReturnValueOnce(a11yStatusMessage1)
        .mockReturnValueOnce(a11yStatusMessage2)
      renderMultipleCombobox({
        multipleSelectionProps: {
          selectedItems,
          initialActiveIndex: 0,
          getA11yStatusMessage,
        },
      })

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')
      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(a11yStatusMessage1)
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith({
        activeIndex: 0,
        selectedItems,
      })

      getA11yStatusMessage.mockReset()

      await keyDownOnSelectedItemAtIndex(0, '{ArrowRight}')

      waitForDebouncedA11yStatusUpdate()

      expect(getA11yStatusContainer()).toHaveTextContent(a11yStatusMessage2)
      expect(getA11yStatusMessage).toHaveBeenCalledTimes(1)
      expect(getA11yStatusMessage).toHaveBeenCalledWith({
        activeIndex: 1,
        selectedItems,
      })
    })

    test('clears the text content after 500ms', async () => {
      renderMultipleCombobox({
        multipleSelectionProps: {
          selectedItems: [items[0], items[1]],
          initialActiveIndex: 0,
          getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
        },
      })

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')
      waitForDebouncedA11yStatusUpdate()
      act(() => jest.advanceTimersByTime(500))

      expect(getA11yStatusContainer()).toBeEmptyDOMElement()
    })

    test('removes the message element from the DOM on unmount', async () => {
      const {unmount} = renderMultipleCombobox({
        multipleSelectionProps: {
          selectedItems: [items[0], items[1]],
          initialActiveIndex: 0,
          getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
        },
      })

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')
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

      renderMultipleCombobox({
        multipleSelectionProps: {
          selectedItems: [items[0], items[1]],
          initialActiveIndex: 0,
          getA11yStatusMessage: jest.fn().mockReturnValue('bla bla'),
          environment,
        },
      })

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')
      waitForDebouncedA11yStatusUpdate()

      expect(environment.document.getElementById).toHaveBeenCalledTimes(1)
      expect(environment.document.getElementById).toHaveBeenCalledWith(
        'a11y-status-message',
      )
    })
  })

  describe('activeIndex', () => {
    test('controls the state property if passed', async () => {
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          activeIndex: 1,
        },
      })

      focusSelectedItemAtIndex(1)
      await clickOnSelectedItemAtIndex(0)

      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')

      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')

      await keyDownOnSelectedItemAtIndex(1, '{ArrowRight}')

      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
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

    test('is called at each state change with the appropriate change type', async () => {
      const stateReducer = jest.fn((s, a) => a.changes)
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1], items[2]],
          stateReducer,
        },
      })

      await keyDownOnInput('{Backspace}')

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

      await keyDownOnInput('{ArrowLeft}')

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

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')

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

      await keyDownOnSelectedItemAtIndex(0, '{ArrowRight}')

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

      await clickOnInput()

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

      await clickOnSelectedItemAtIndex(0)

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

      await keyDownOnSelectedItemAtIndex(0, '{Delete}')

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

      await keyDownOnSelectedItemAtIndex(0, '{Backspace}')

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

    test('replaces prop values with user defined', async () => {
      const stateReducer = jest.fn((s, a) => {
        const changes = a.changes
        changes.activeIndex = 0
        return changes
      })

      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          stateReducer,
        },
      })

      await clickOnSelectedItemAtIndex(1)

      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
      expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
      expect(getSelectedItemAtIndex(0)).toHaveFocus()
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
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          stateReducer,
        },
      })

      await clickOnSelectedItemAtIndex(0)
    })

    test('changes are visible in onChange handlers', async () => {
      const activeIndex = 0
      const inputItems = ['foo', 'bar']
      const stateReducer = jest.fn(() => ({
        activeIndex,
        selectedItems: [],
      }))
      const onSelectedItemsChange = jest.fn()
      const onActiveIndexChange = jest.fn()
      const onStateChange = jest.fn()
      renderMultipleCombobox({
        multipleSelectionProps: {
          stateReducer,
          onStateChange,
          onActiveIndexChange,
          onSelectedItemsChange,
          selectedItems: inputItems,
        },
      })

      await keyDownOnInput('{ArrowLeft}')

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
    test('is called at activeIndex change', async () => {
      const onActiveIndexChange = jest.fn()
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          onActiveIndexChange,
        },
      })

      await clickOnSelectedItemAtIndex(1)

      expect(onActiveIndexChange).toHaveBeenCalledTimes(1)
      expect(onActiveIndexChange).toHaveBeenCalledWith(
        expect.objectContaining({
          activeIndex: 1,
        }),
      )
    })

    test('is not called at if selectedItem is the same', async () => {
      const onActiveIndexChange = jest.fn()
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          onActiveIndexChange,
          initialActiveIndex: 1,
        },
      })

      await clickOnSelectedItemAtIndex(1)

      expect(onActiveIndexChange).not.toHaveBeenCalled()
    })

    test('works correctly with the corresponding control prop', async () => {
      let activeIndex = 3
      const {rerender} = renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: items,
          activeIndex,
          onActiveIndexChange: changes => {
            activeIndex = changes.activeIndex
          },
        },
      })

      await keyDownOnSelectedItemAtIndex(3, '{ArrowLeft}')
      rerender({multipleSelectionProps: {activeIndex}})

      expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '0')
    })

    test('can have downshift actions executed', () => {
      const {result} = renderUseMultipleSelection({
        onActiveIndexChange: () => {
          result.current.setSelectedItems([items[0]])
        },
      })

      act(() => {
        result.current.getSelectedItemProps({index: 3}).onClick({})
      })

      expect(result.current.selectedItems).toEqual([items[0]])
    })
  })

  describe('onSelectedItemsChange', () => {
    test('is called at items change', async () => {
      const onSelectedItemsChange = jest.fn()
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          onSelectedItemsChange,
          initialActiveIndex: 1,
        },
      })

      await keyDownOnSelectedItemAtIndex(1, '{Delete}')

      expect(onSelectedItemsChange).toHaveBeenCalledTimes(1)
      expect(onSelectedItemsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItems: [items[0]],
        }),
      )
    })

    test('is not called at if items is the same', async () => {
      const onSelectedItemsChange = jest.fn()
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          onSelectedItemsChange,
          initialActiveIndex: 1,
        },
      })

      await clickOnSelectedItemAtIndex(0)

      expect(onSelectedItemsChange).not.toHaveBeenCalled()
    })

    test('works correctly with the corresponding control prop', async () => {
      let selectedItems = [items[0], items[1]]
      const {rerender} = renderMultipleCombobox({
        multipleSelectionProps: {
          selectedItems,
          initialActiveIndex: 0,
          onSelectedItemsChange: changes => {
            selectedItems = changes.selectedItems
          },
        },
      })

      await keyDownOnSelectedItemAtIndex(0, '{Delete}')
      rerender({multipleSelectionProps: {selectedItems}})

      expect(getSelectedItems()).toHaveLength(1)
    })

    test('can have downshift actions executed', () => {
      const initialActiveIndex = 3
      const {result} = renderUseMultipleSelection({
        onSelectedItemsChange: () => {
          result.current.setActiveIndex(1)
        },
        initialSelectedItems: items,
        initialActiveIndex,
      })

      act(() => {
        result.current
          .getSelectedItemProps({index: initialActiveIndex})
          .onKeyDown({key: 'Backspace'})
      })

      expect(result.current.activeIndex).toEqual(1)
    })
  })

  describe('onStateChange', () => {
    test('is called at each state property change', async () => {
      const onStateChange = jest.fn()
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1], items[2]],
          onStateChange,
        },
      })

      await keyDownOnInput('{Backspace}')

      expect(onStateChange).toHaveBeenCalledTimes(1)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[0], items[1]]),
          type: stateChangeTypes.DropdownKeyDownBackspace,
        }),
      )

      await keyDownOnInput('{ArrowLeft}')

      expect(onStateChange).toHaveBeenCalledTimes(2)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 1,
          type: stateChangeTypes.DropdownKeyDownNavigationPrevious,
        }),
      )

      await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')

      expect(onStateChange).toHaveBeenCalledTimes(3)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 0,
          type: stateChangeTypes.SelectedItemKeyDownNavigationPrevious,
        }),
      )

      await keyDownOnSelectedItemAtIndex(0, '{ArrowRight}')

      expect(onStateChange).toHaveBeenCalledTimes(4)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 1,
          type: stateChangeTypes.SelectedItemKeyDownNavigationNext,
        }),
      )

      await clickOnSelectedItemAtIndex(0)

      expect(onStateChange).toHaveBeenCalledTimes(5)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          activeIndex: 0,
          type: stateChangeTypes.SelectedItemClick,
        }),
      )

      await keyDownOnSelectedItemAtIndex(0, '{Delete}')

      expect(onStateChange).toHaveBeenCalledTimes(6)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([items[1]]),
          type: stateChangeTypes.SelectedItemKeyDownDelete,
        }),
      )

      await keyDownOnSelectedItemAtIndex(0, '{Backspace}')

      expect(onStateChange).toHaveBeenCalledTimes(7)
      expect(onStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          selectedItems: expect.arrayContaining([]),
          type: stateChangeTypes.SelectedItemKeyDownBackspace,
        }),
      )
    })
  })

  test('overrides navigation previos and next keys correctly', async () => {
    renderMultipleCombobox({
      multipleSelectionProps: {
        keyNavigationPrevious: 'ArrowRight',
        keyNavigationNext: 'ArrowLeft',
        initialSelectedItems: [items[0], items[1]],
      },
    })

    await keyDownOnInput('{ArrowRight}')

    expect(getSelectedItemAtIndex(1)).toHaveFocus()

    await keyDownOnSelectedItemAtIndex(1, '{ArrowRight}')

    expect(getSelectedItemAtIndex(0)).toHaveFocus()

    await keyDownOnSelectedItemAtIndex(0, '{ArrowLeft}')

    expect(getSelectedItemAtIndex(1)).toHaveFocus()

    await keyDownOnSelectedItemAtIndex(1, '{ArrowLeft}')

    expect(getInput()).toHaveFocus()
  })

  test('can have downshift actions executed', () => {
    const {result} = renderUseMultipleSelection({
      initialSelectedItems: items,
      onStateChange: () => {
        result.current.setActiveIndex(4)
      },
    })

    act(() => {
      result.current.getSelectedItemProps({index: 2}).onClick({})
    })

    expect(result.current.activeIndex).toEqual(4)
  })

  test('that are uncontrolled should not become controlled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderMultipleCombobox()

    rerender({multipleSelectionProps: {activeIndex: 1}})

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `downshift: A component has changed the uncontrolled prop "activeIndex" to be controlled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`,
    )
  })

  test('that are controlled should not become uncontrolled', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const {rerender} = renderMultipleCombobox({
      multipleSelectionProps: {selectedItems: [items[1]]},
    })

    rerender({})

    // eslint-disable-next-line no-console
    expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
      `downshift: A component has changed the controlled prop "selectedItems" to be uncontrolled. This prop should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled Downshift element for the lifetime of the component. More info: https://github.com/downshift-js/downshift#control-props`,
    )
  })
})
