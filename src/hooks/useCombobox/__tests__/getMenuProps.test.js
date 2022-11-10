import {act, renderHook} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {getInput, renderCombobox, renderUseCombobox} from '../testUtils'
import {
  defaultIds,
  items,
  mouseLeaveItemAtIndex,
  mouseMoveItemAtIndex,
} from '../../testUtils'
import utils from '../../utils'
import useCombobox from '..'

describe('getMenuProps', () => {
  describe('hook props', () => {
    test('assign default value to aria-labelledby', () => {
      const {result} = renderUseCombobox()
      const menuProps = result.current.getMenuProps()

      expect(menuProps['aria-labelledby']).toEqual(`${defaultIds.labelId}`)
    })

    test('assign custom value passed by user to aria-labelledby', () => {
      const props = {
        labelId: 'my-custom-label-id',
      }
      const {result} = renderUseCombobox(props)
      const menuProps = result.current.getMenuProps()

      expect(menuProps['aria-labelledby']).toEqual(`${props.labelId}`)
    })

    test('assign default value to id', () => {
      const {result} = renderUseCombobox()
      const menuProps = result.current.getMenuProps()

      expect(menuProps.id).toEqual(`${defaultIds.menuId}`)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        menuId: 'my-custom-menu-id',
      }
      const {result} = renderUseCombobox(props)
      const menuProps = result.current.getMenuProps()

      expect(menuProps.id).toEqual(`${props.menuId}`)
    })

    test("assign 'listbox' to role", () => {
      const {result} = renderUseCombobox()
      const menuProps = result.current.getMenuProps()

      expect(menuProps.role).toEqual('listbox')
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseCombobox()

      expect(result.current.getMenuProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('event handler onMouseLeave is called along with downshift handler', () => {
      const userOnMouseLeave = jest.fn()
      const {result} = renderUseCombobox({
        initialHighlightedIndex: 2,
        initialIsOpen: true,
      })

      act(() => {
        const {onMouseLeave} = result.current.getMenuProps({
          onMouseLeave: userOnMouseLeave,
        })

        onMouseLeave({preventDefault: noop})
      })

      expect(userOnMouseLeave).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(-1)
    })

    test("event handler onMouseLeave is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnMouseLeave = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox({
        initialHighlightedIndex: 2,
        initialIsOpen: true,
      })

      act(() => {
        const {onMouseLeave} = result.current.getMenuProps({
          onMouseLeave: userOnMouseLeave,
        })

        onMouseLeave({preventDefault: noop})
      })

      expect(userOnMouseLeave).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(2)
    })
  })

  describe('event handlers', () => {
    describe('on key down', () => {
      describe('on mouse leave', () => {
        test('the highlightedIndex should be reset', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            initialIsOpen: true,
            initialHighlightedIndex,
          })

          await mouseMoveItemAtIndex(initialHighlightedIndex)
          await mouseLeaveItemAtIndex(initialHighlightedIndex)

          expect(getInput()).toHaveAttribute('aria-activedescendant', '')
        })
      })
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

    test('will be displayed if getMenuProps is not called', () => {
      renderHook(() => {
        const {getInputProps} = useCombobox({items})
        getInputProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: You forgot to call the getMenuProps getter function on your component / element.`,
      )
    })

    test('will not be displayed if getMenuProps is not called on subsequent renders', () => {
      let firstRender = true
      const {rerender} = renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({
          items,
        })
        getInputProps({}, {suppressRefError: true})

        // eslint-disable-next-line jest/no-if
        if (firstRender) {
          firstRender = false
          getMenuProps({}, {suppressRefError: true})
        }
      })

      rerender()

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })

    test('will be displayed if element ref is not set and suppressRefError is false', () => {
      renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({
          items,
        })

        getInputProps({}, {suppressRefError: true})
        getMenuProps()
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: The ref prop "ref" from getMenuProps was not applied correctly on your element.`,
      )
    })

    test('will not be displayed if called with a correct ref', () => {
      const refFn = jest.fn()
      const menuNode = {}

      renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({
          items,
        })

        getInputProps({}, {suppressRefError: true})

        const {ref} = getMenuProps({
          ref: refFn,
        })
        ref(menuNode)
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })
  })
})
