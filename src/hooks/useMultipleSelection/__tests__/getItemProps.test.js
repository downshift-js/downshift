import {act} from '@testing-library/react-hooks'

import {renderUseMultipleSelection, renderMultipleCombobox} from '../testUtils'
import {items} from '../../testUtils'

describe('getItemProps', () => {
  test('throws error if no index or item has been passed', () => {
    const {result} = renderUseMultipleSelection()

    expect(result.current.getItemProps).toThrowError(
      'Pass either item or item index in getItemProps!',
    )
  })

  describe('hook props', () => {
    test("assign '-1' to tabindex for a non-active item", () => {
      const {result} = renderUseMultipleSelection()
      const itemProps = result.current.getItemProps({index: 0, item: items[0]})

      expect(itemProps.tabIndex).toEqual(-1)
    })

    test("assign '0' to tabindex for an active item", () => {
      const {result} = renderUseMultipleSelection({activeIndex: 0})
      const itemProps = result.current.getItemProps({index: 0, item: items[0]})

      expect(itemProps.tabIndex).toEqual(0)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseMultipleSelection()

      expect(
        result.current.getItemProps({index: 1, item: items[1], foo: 'bar'}),
      ).toHaveProperty('foo', 'bar')
    })

    test('custom ref passed by the user is used', () => {
      const {result} = renderUseMultipleSelection()
      const refFn = jest.fn()
      const itemNode = {}

      act(() => {
        const {ref} = result.current.getItemProps({
          index: 1,
          item: items[1],
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
        const {blablaRef} = result.current.getItemProps({
          index: 1,
          item: items[1],
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
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onClick} = result.current.getItemProps({
          index: 1,
          item: items[1],
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
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onClick} = result.current.getItemProps({
          index: 1,
          item: items[1],
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
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onKeyDown} = result.current.getItemProps({
          index: 1,
          item: items[1],
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
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onKeyDown} = result.current.getItemProps({
          index: 1,
          item: items[1],
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
      test('sets tabindex to "0"', () => {
        const {
          clickOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {initialItems: [items[0], items[1]]},
        })

        clickOnSelectedItemAtIndex(0)

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
      })

      test('keeps tabindex "0" to an already active item', () => {
        const {
          clickOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          focusSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1]],
            initialActiveIndex: 0,
          },
        })

        focusSelectedItemAtIndex(0)
        clickOnSelectedItemAtIndex(0)

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
      })
    })

    describe('on key down', () => {
      test('arrow left should change active item descendently', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1]],
            initialActiveIndex: 1,
          },
        })

        keyDownOnSelectedItemAtIndex(1, 'ArrowLeft')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
      })

      test(`arrow left should not change active item if it's the first one added`, () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          focusSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1]],
            initialActiveIndex: 0,
          },
        })

        focusSelectedItemAtIndex(0)
        keyDownOnSelectedItemAtIndex(0, 'ArrowLeft')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveFocus()
      })

      test('arrow right should change active item ascendently', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1]],
            initialActiveIndex: 0,
          },
        })

        keyDownOnSelectedItemAtIndex(0, 'ArrowRight')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
      })

      test(`arrow right should make no item active if it's on last one added`, () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          input,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1]],
            initialActiveIndex: 1,
          },
        })

        keyDownOnSelectedItemAtIndex(1, 'ArrowRight')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
        expect(input).toHaveFocus()
      })

      test('arrow navigation moves focus back and forth', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1], items[2]],
            initialActiveIndex: 2,
          },
        })

        keyDownOnSelectedItemAtIndex(2, 'ArrowLeft')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')

        keyDownOnSelectedItemAtIndex(1, 'ArrowLeft')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')

        keyDownOnSelectedItemAtIndex(0, 'ArrowRight')

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')

        keyDownOnSelectedItemAtIndex(2, 'ArrowRight')

        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      })

      test('backspace removes item and moves focus to next item if any', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          getSelectedItems,
          focusSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1], items[2]],
            initialActiveIndex: 1,
          },
        })

        focusSelectedItemAtIndex(1)
        keyDownOnSelectedItemAtIndex(1, 'Backspace')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[2])
      })

      test('backspace removes item and moves focus to input if no items left', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItems,
          focusSelectedItemAtIndex,
          input,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0]],
            initialActiveIndex: 0,
          },
        })

        focusSelectedItemAtIndex(0)
        keyDownOnSelectedItemAtIndex(0, 'Backspace')

        expect(getSelectedItems()).toHaveLength(0)
        expect(input).toHaveFocus()
      })

      test('backspace removes item and moves focus to previous item if it was the last in the array', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          getSelectedItems,
          focusSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1], items[2]],
            initialActiveIndex: 2,
          },
        })

        focusSelectedItemAtIndex(2)
        keyDownOnSelectedItemAtIndex(2, 'Backspace')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[1])
      })

      test('delete removes item and moves focus to next item if any', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          getSelectedItems,
          focusSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1], items[2]],
            initialActiveIndex: 1,
          },
        })

        focusSelectedItemAtIndex(1)
        keyDownOnSelectedItemAtIndex(1, 'Delete')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[2])
      })

      test('delete removes item and moves focus to input if no items left', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItems,
          focusSelectedItemAtIndex,
          input,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0]],
            initialActiveIndex: 0,
          },
        })

        focusSelectedItemAtIndex(0)
        keyDownOnSelectedItemAtIndex(0, 'Delete')

        expect(getSelectedItems()).toHaveLength(0)
        expect(input).toHaveFocus()
      })

      test('delete removes item and moves focus to previous item if it was the last in the array', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          getSelectedItems,
          focusSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1], items[2]],
            initialActiveIndex: 2,
          },
        })

        focusSelectedItemAtIndex(2)
        keyDownOnSelectedItemAtIndex(2, 'Delete')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
        expect(getSelectedItemAtIndex(1)).toHaveTextContent(items[1])
      })

      test('navigation works correctly with both click and arrow keys', () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItemAtIndex,
          clickOnSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1], items[2]],
          },
        })

        clickOnSelectedItemAtIndex(1)

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')

        keyDownOnSelectedItemAtIndex(1, 'ArrowLeft')

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')

        clickOnSelectedItemAtIndex(1)

        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')

        keyDownOnSelectedItemAtIndex(2, 'ArrowRight')

        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '-1')
      })

      test("other than the ones supported don't affect anything", () => {
        const {
          keyDownOnSelectedItemAtIndex,
          getSelectedItems,
          getSelectedItemAtIndex,
          focusSelectedItemAtIndex,
        } = renderMultipleCombobox({
          multipleSelectionProps: {initialItems: [items[0], items[1]]},
        })

        focusSelectedItemAtIndex(1)
        keyDownOnSelectedItemAtIndex(1, 'Alt')
        keyDownOnSelectedItemAtIndex(1, 'Control')
        keyDownOnSelectedItemAtIndex(1, 'ArrowUp')
        keyDownOnSelectedItemAtIndex(1, 'ArrowDown')
        keyDownOnSelectedItemAtIndex(1, 'Enter')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getSelectedItemAtIndex(1)).toHaveFocus()
      })
    })

    describe('on focus', () => {
      test('keeps tabindex "0" when focusing input by tab/click so user can return via tab', () => {
        const {
          getSelectedItemAtIndex,
          focusSelectedItemAtIndex,
          focusInput,
          input,
        } = renderMultipleCombobox({
          multipleSelectionProps: {
            initialItems: [items[0], items[1], items[2]],
            initialActiveIndex: 0,
          },
        })

        focusSelectedItemAtIndex(0)
        focusInput()

        expect(getSelectedItemAtIndex(0)).toHaveAttribute('tabindex', '0')
        expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')
        expect(getSelectedItemAtIndex(2)).toHaveAttribute('tabindex', '-1')
        expect(input).toHaveFocus()
      })
    })
  })
})
