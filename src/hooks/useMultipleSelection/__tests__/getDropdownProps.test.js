import {act} from '@testing-library/react-hooks'

import {renderMultipleCombobox, renderUseMultipleSelection} from '../testUtils'
import {items} from '../../testUtils'

describe('getDropdownProps', () => {
  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseMultipleSelection()

      expect(result.current.getDropdownProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('custom ref passed by the user is used', () => {
      const {result} = renderUseMultipleSelection()
      const refFn = jest.fn()
      const dropdownNode = {}

      act(() => {
        const {ref} = result.current.getDropdownProps({ref: refFn})

        ref(dropdownNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(dropdownNode)
    })

    test('custom ref with custom name passed by the user is used', () => {
      const {result} = renderUseMultipleSelection()
      const refFn = jest.fn()
      const dropdownNode = {}

      act(() => {
        const {blablaRef} = result.current.getDropdownProps({
          refKey: 'blablaRef',
          blablaRef: refFn,
        })

        blablaRef(dropdownNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(dropdownNode)
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = renderUseMultipleSelection({initialItems: [items[0]]})

      act(() => {
        const {onKeyDown} = result.current.getDropdownProps({
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
      const {result} = renderUseMultipleSelection({initialItems: [items[0]]})

      act(() => {
        const {onKeyDown} = result.current.getDropdownProps({
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowLeft'})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(-1)
    })
  })

  describe('event handlers', () => {
    describe('on keydown', () => {
      test('arrow left should make first selected item active', () => {
        const {keyDownOnDropdown, getItemAtIndex} = renderMultipleCombobox({
          initialItems: [items[0], items[1]],
        })

        keyDownOnDropdown('ArrowLeft')

        expect(getItemAtIndex(1)).toHaveFocus()
      })

      test('backspace should remove the first selected item', () => {
        const {keyDownOnDropdown, getItems} = renderMultipleCombobox({
          initialItems: [items[0], items[1]],
        })

        keyDownOnDropdown('Backspace')

        expect(getItems()).toHaveLength(1)
      })
    })
  })
})
