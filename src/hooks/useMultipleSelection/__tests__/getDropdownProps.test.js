import {act, renderHook} from '@testing-library/react-hooks'
import {
  clickOnInput,
  focusSelectedItemAtIndex,
  getSelectedItemAtIndex,
  getSelectedItems,
  renderMultipleCombobox,
  renderUseMultipleSelection,
  getInput,
  keyDownOnInput,
  items,
} from '../testUtils'
import utils from '../../utils'
import useMultipleSelection from '..'

describe('getDropdownProps', () => {
  test('returns no keydown events if preventKeyAction is true', () => {
    const {result} = renderUseMultipleSelection()
    const dropdownProps = result.current.getDropdownProps({
      preventKeyAction: true,
    })

    expect(dropdownProps.onKeyDown).toBeUndefined()
  })

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
        const {ref} = result.current.getDropdownProps({
          ref: refFn,
        })

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
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: [items[0]],
      })

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
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: [items[0]],
      })

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
      test('arrow left should make first selected item active', async () => {
        renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
          },
        })

        await keyDownOnInput('{ArrowLeft}')

        expect(getSelectedItemAtIndex(1)).toHaveFocus()
      })

      test('arrow left should not work if pressed with modifier keys', async () => {
        renderMultipleCombobox({
          multipleSelectionProps: {initialSelectedItems: [items[0], items[1]]},
        })

        await keyDownOnInput('{Shift>}{ArrowLeft}{/Shift}')

        expect(getSelectedItems()).toHaveLength(2)

        await keyDownOnInput('{Alt>}{ArrowLeft}{/Alt}')

        expect(getSelectedItems()).toHaveLength(2)

        await keyDownOnInput('{Meta>}{ArrowLeft}{/Meta}')

        expect(getSelectedItems()).toHaveLength(2)

        await keyDownOnInput('{Control>}{ArrowLeft}{/Control}')

        expect(getSelectedItems()).toHaveLength(2)
      })

      test('backspace should remove the first selected item', async () => {
        renderMultipleCombobox({
          multipleSelectionProps: {initialSelectedItems: [items[0], items[1]]},
        })

        await keyDownOnInput('{Backspace}')

        expect(getSelectedItems()).toHaveLength(1)
      })

      test('backspace should not work if pressed with modifier keys', async () => {
        renderMultipleCombobox({
          multipleSelectionProps: {initialSelectedItems: [items[0], items[1]]},
        })

        await keyDownOnInput('{Shift>}{Backspace}{/Shift}')

        expect(getSelectedItems()).toHaveLength(2)

        await keyDownOnInput('{Alt>}{ArrowLeft}{/Alt}')

        expect(getSelectedItems()).toHaveLength(2)

        await keyDownOnInput('{Meta>}{ArrowLeft}{/Meta}')

        expect(getSelectedItems()).toHaveLength(2)

        await keyDownOnInput('{Control>}{ArrowLeft}{/Control}')

        expect(getSelectedItems()).toHaveLength(2)
      })

      test('backspace should not work if pressed with cursor not on first position', async () => {
        renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
          },
          comboboxProps: {initialInputValue: 'test'},
        })
        const input = getInput()

        input.selectionStart = 1
        input.selectionEnd = 1
        await keyDownOnInput('{Backspace}')

        expect(getSelectedItems()).toHaveLength(2)
      })

      test('backspace should not work if pressed with cursor highlighting text', async () => {
        renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
          },
          comboboxProps: {initialInputValue: 'test'},
        })
        const input = getInput()

        input.selectionStart = 0
        input.selectionEnd = 3
        await keyDownOnInput('{Backspace}')

        expect(getSelectedItems()).toHaveLength(2)
      })

      test("other than the ones supported don't affect anything", async () => {
        renderMultipleCombobox({
          multipleSelectionProps: {
            initialSelectedItems: [items[0], items[1]],
          },
        })

        await keyDownOnInput('{Alt}')
        await keyDownOnInput('{Control}')

        expect(getSelectedItems()).toHaveLength(2)
        expect(getInput()).toHaveFocus()
      })
    })

    test('on click it should remove active status from item if any', async () => {
      renderMultipleCombobox({
        multipleSelectionProps: {
          initialSelectedItems: [items[0], items[1]],
          initialActiveIndex: 1,
        },
      })

      focusSelectedItemAtIndex(1)
      await clickOnInput()

      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '-1')

      await keyDownOnInput('{ArrowLeft}')

      expect(getSelectedItemAtIndex(1)).toHaveFocus()
      expect(getSelectedItemAtIndex(1)).toHaveAttribute('tabindex', '0')
    })
  })

  describe('non production errors', () => {
    beforeEach(() => {
      const {useGetterPropsCalledChecker} = jest.requireActual('../../utils')
      jest
        .spyOn(utils, 'useGetterPropsCalledChecker')
        .mockImplementation(useGetterPropsCalledChecker)
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    test('will be displayed if getDropdownProps is not called', () => {
      renderHook(() => {
        useMultipleSelection()
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: You forgot to call the getDropdownProps getter function on your component / element.`,
      )
    })

    test('will be displayed if element ref is not set and suppressRefError is false', () => {
      renderHook(() => {
        const {getDropdownProps} = useMultipleSelection()

        getDropdownProps()
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: The ref prop "ref" from getDropdownProps was not applied correctly on your element.`,
      )
    })

    test('will not be displayed if element ref is not set but suppressRefError is true', () => {
      renderHook(() => {
        const {getDropdownProps} = useMultipleSelection()

        getDropdownProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })

    test('will not be displayed if called with a correct ref', () => {
      const refFn = jest.fn()
      const dropdownNode = {}

      renderHook(() => {
        const {getDropdownProps} = useMultipleSelection()
        const {ref} = getDropdownProps({
          ref: refFn,
        })
        ref(dropdownNode)
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })
  })
})
