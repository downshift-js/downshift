import {cleanup} from '@testing-library/react'
import {act} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {renderUseCombobox} from '../testUtils'
import {defaultIds} from '../../testUtils'

describe('getComboboxProps', () => {
  afterEach(cleanup)

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
})
