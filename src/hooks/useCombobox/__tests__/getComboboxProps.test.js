import {act, renderHook} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {renderUseCombobox} from '../testUtils'
import {defaultIds, items} from '../../testUtils'
import useCombobox from '..'// eslint-disable-next-line import/default
import utils from '../../utils'

describe('getComboboxProps', () => {
  describe('hook props', () => {
    test("assign 'combobox' to role", () => {
      const {result} = renderUseCombobox()
      const comboboxProps = result.current.getComboboxProps()

      expect(comboboxProps.role).toEqual('combobox')
    })

    test("assign 'listbox' to aria-haspopup", () => {
      const {result} = renderUseCombobox()
      const comboboxProps = result.current.getComboboxProps()

      expect(comboboxProps['aria-haspopup']).toEqual('listbox')
    })

    test('assign default value to aria-owns', () => {
      const {result} = renderUseCombobox()
      const comboboxProps = result.current.getComboboxProps()

      expect(comboboxProps['aria-owns']).toEqual(`${defaultIds.menuId}`)
    })

    test('assign custom value passed by user to aria-owns', () => {
      const props = {
        menuId: 'my-custom-label-id',
      }
      const {result} = renderUseCombobox(props)
      const comboboxProps = result.current.getComboboxProps()

      expect(comboboxProps['aria-owns']).toEqual(`${props.menuId}`)
    })

    test("assign 'false' value to aria-expanded when menu is closed", () => {
      const {result} = renderUseCombobox({isOpen: false})
      const comboboxProps = result.current.getComboboxProps()

      expect(comboboxProps['aria-expanded']).toEqual(false)
    })

    test("assign 'true' value to aria-expanded when menu is open", () => {
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()

        inputRef({focus: noop})
        result.current.toggleMenu()
      })

      const comboboxProps = result.current.getComboboxProps()

      expect(comboboxProps['aria-expanded']).toEqual(true)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseCombobox()

      expect(result.current.getComboboxProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
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

    test('will be displayed if getComboboxProps is not called', () => {
      renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({items})
        getInputProps({}, {suppressRefError: true})
        getMenuProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `"downshift: You forgot to call the getComboboxProps getter function on your component / element."`,
      )
    })

    test('will not be displayed if getComboboxProps is not called on subsequent renders', () => {
      let firstRender = true
      const {rerender} = renderHook(() => {
        const {getInputProps, getMenuProps, getComboboxProps} = useCombobox({
          items,
        })
        getInputProps({}, {suppressRefError: true})
        getMenuProps({}, {suppressRefError: true})

        if (firstRender) {
          firstRender = false
          getComboboxProps({}, {suppressRefError: true})
        }
      })

      rerender()

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })

    test('will be displayed if element ref is not set and suppressRefError is false', () => {
      renderHook(() => {
        const {getInputProps, getMenuProps, getComboboxProps} = useCombobox({
          items,
        })

        getInputProps({}, {suppressRefError: true})
        getMenuProps({}, {suppressRefError: true})
        getComboboxProps()
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `"downshift: The ref prop \\"ref\\" from getComboboxProps was not applied correctly on your element."`,
      )
    })

    // this test will cover also the equivalent getInputProps and getMenuProps cases.
    test('will not be displayed if element ref is not set and suppressRefError is true', () => {
      renderHook(() => {
        const {getInputProps, getMenuProps, getComboboxProps} = useCombobox({
          items,
        })

        getInputProps({}, {suppressRefError: true})
        getMenuProps({}, {suppressRefError: true})
        getComboboxProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })

    test('will not be displayed if called with a correct ref', () => {
      const refFn = jest.fn()
      const comboboxNode = {}

      renderHook(() => {
        const {getInputProps, getMenuProps, getComboboxProps} = useCombobox({
          items,
        })

        getMenuProps({}, {suppressRefError: true})
        getInputProps({}, {suppressRefError: true})

        const {ref} = getComboboxProps({
          ref: refFn,
        })
        ref(comboboxNode)
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })
  })
})
