import {act} from '@testing-library/react-hooks'

import {renderUseMultipleSelection, renderMultipleCombobox} from '../testUtils'
import {items} from '../../testUtils'

describe('getItemProps', () => {
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
    })
  })
})
