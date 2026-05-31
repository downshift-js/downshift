import {act} from '@testing-library/react'

import {
  renderUseMultipleSelection,
  renderMultipleCombobox,
  clickOnSelectedItemAtIndex,
  getSelectedItemAtIndex,
  focusSelectedItemAtIndex,
  keyDownOnSelectedItemAtIndex,
  getSelectedItems,
  getInput,
  items,
  tab,
} from '../testUtils'

describe('getSelectedItemProps', () => {
  test('throws error if no index or item has been passed', () => {
    const {result} = renderUseMultipleSelection()

    expect(result.current.getSelectedItemProps).toThrow(
      'Pass either item or index to getSelectedItemProps!',
    )
  })

  describe('hook props', () => {
    test("assign '-1' to tabindex for a non-active item", () => {
      const {result} = renderUseMultipleSelection()
      const itemProps = result.current.getSelectedItemProps({
        index: 0,
        selectedItem: items[0],
      })

      expect(itemProps.tabIndex).toEqual(-1)
    })

    test("assign '0' to tabindex for an active item", () => {
      const {result} = renderUseMultipleSelection({activeIndex: 0})
      const itemProps = result.current.getSelectedItemProps({
        index: 0,
        selectedItem: items[0],
      })

      expect(itemProps.tabIndex).toEqual(0)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseMultipleSelection()

      expect(
        result.current.getSelectedItemProps({
          index: 1,
          selectedItem: items[1],
          foo: 'bar',
        }),
      ).toHaveProperty('foo', 'bar')
    })

    test('custom ref passed by the user is used', () => {
      const {result} = renderUseMultipleSelection()
      const refFn = jest.fn()
      const itemNode = {}

      act(() => {
        const {ref} = result.current.getSelectedItemProps({
          index: 1,
          selectedItem: items[1],
          ref: refFn,
        })

        ref(itemNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(itemNode)
    })

    test('custom ref with custom name passed by the user is used', () => {
      const {result} = renderUseMultipleSelection()
      const refFn = jest.fn()
      const itemNode = {}

      act(() => {
        const {blablaRef} = result.current.getSelectedItemProps({
          index: 1,
          selectedItem: items[1],
          refKey: 'blablaRef',
          blablaRef: refFn,
        })

        blablaRef(itemNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(itemNode)
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: [items[0], items[1]],
      })

      act(() => {
        const {onClick} = result.current.getSelectedItemProps({
          index: 1,
          selectedItem: items[1],
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(1)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: [items[0], items[1]],
      })

      act(() => {
        const {onClick} = result.current.getSelectedItemProps({
          index: 1,
          selectedItem: items[1],
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(-1)
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: [items[0], items[1]],
      })

      act(() => {
        const {onKeyDown} = result.current.getSelectedItemProps({
          index: 1,
          selectedItem: items[1],
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowLeft'})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(0)
    })

    test("event handler onKeyDown is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnKeyDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: [items[0], items[1]],
      })

      act(() => {
        const {onKeyDown} = result.current.getSelectedItemProps({
          index: 1,
          selectedItem: items[1],
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowLeft'})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(-1)
    })
  })

  describe('event handlers', () => {
    describe('on click', () => {
      test('sets tabindex to "0"', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {initialSelectedItems: [items[0], items[1]]},
        })

        await clickOnSelectedItemAtIndex(user, 0)
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
      })

      test('keeps tabindex "0" to an already active item', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
            initialActiveIndex: 0,
          },
        })

        await clickOnSelectedItemAtIndex(user, 0)

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
      })
    })

    describe('on key down', () => {
      test('arrow left should change active item descendently', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
            initialActiveIndex: 1,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 1, '{ArrowLeft}')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
      })

      test(`arrow left should not change active item if it's the first one added`, async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
            initialActiveIndex: 0,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 0, '{ArrowLeft}')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
      })

      test('arrow right should change active item ascendently', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
            initialActiveIndex: 0,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 0, '{ArrowRight}')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
      })

      test(`arrow right should make no item active if it's on last one added`, async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
            initialActiveIndex: 1,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 1, '{ArrowRight}')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
        expect(getInput()).toHaveFocus()
      })

      test('arrow navigation moves focus back and forth', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
            initialActiveIndex: 2,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 2, '{ArrowLeft}')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')

        await keyDownOnSelectedItemAtIndex(user, 1, '{ArrowLeft}')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')

        await keyDownOnSelectedItemAtIndex(user, 0, '{ArrowRight}')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')

        await keyDownOnSelectedItemAtIndex(user, 2, '{ArrowRight}')

        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      })

      test('backspace removes item and moves focus to next item if any', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
            initialActiveIndex: 1,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 1, '{Backspace}')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[2])
      })

      test('backspace removes item and moves focus to input if no items left', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0]],
            initialActiveIndex: 0,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 0, '{Backspace}')

        expect(getSelectedItems()).toHaveLength(0)
        expect(getInput()).toHaveFocus()
      })

      test('backspace removes item and moves focus to previous item if it was the last in the array', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
            initialActiveIndex: 2,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 2, '{Backspace}')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[1])
      })

      test('delete removes item and moves focus to next item if any', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
            initialActiveIndex: 1,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 1, '{Delete}')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[2])
      })

      test('delete removes item and moves focus to input if no items left', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0]],
            initialActiveIndex: 0,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 0, '{Delete}')

        expect(getSelectedItems()).toHaveLength(0)
        expect(getInput()).toHaveFocus()
      })

      test('delete removes item and moves focus to previous item if it was the last in the array', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
            initialActiveIndex: 2,
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 2, '{Delete}')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[1])
      })

      test('backspace and delete change nothing if there is no selected item focused', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
          },
        })

        await keyDownOnSelectedItemAtIndex(user, 2, '{Backspace}')

        expect(getSelectedItems()).toHaveLength(3)

        await keyDownOnSelectedItemAtIndex(user, 1, '{Delete}')
        expect(getSelectedItems()).toHaveLength(3)
      })

      test('navigation works correctly with both click and arrow keys', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
          },
        })

        await clickOnSelectedItemAtIndex(user, 1)

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')

        await keyDownOnSelectedItemAtIndex(user, 1, '{ArrowLeft}')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')

        await clickOnSelectedItemAtIndex(user, 1)

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')

        await keyDownOnSelectedItemAtIndex(user, 2, '{ArrowRight}')

        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      })

      test("other than the ones supported don't affect anything", async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {initialSelectedItems: [items[0], items[1]]},
        })

        await keyDownOnSelectedItemAtIndex(user, 1, '{Alt}')
        await keyDownOnSelectedItemAtIndex(user, 1, '{Control}')
        await keyDownOnSelectedItemAtIndex(user, 1, '{ArrowUp}')
        await keyDownOnSelectedItemAtIndex(user, 1, '{ArrowDown}')
        await keyDownOnSelectedItemAtIndex(user, 1, '{Enter}')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
      })
    })

    describe('on focus', () => {
      test('keeps tabindex "0" when focusing input by tab/click so user can return via tab', async () => {
        const {user} = renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1], items[2]],
            initialActiveIndex: 0,
          },
        })

        focusSelectedItemAtIndex(0)
        await tab(user)

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getInput()).toHaveFocus()
      })
    })
  })
})
