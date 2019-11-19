import {act as rtlAct} from '@testing-library/react-hooks'
import {cleanup} from '@testing-library/react'
import {noop} from '../../../utils'
import {setupHook, defaultIds} from '../testUtils'

describe('getMenuProps', () => {
  afterEach(cleanup)

  describe('hook props', () => {
    test('assign default value to aria-labelledby', () => {
      const {result} = setupHook()
      const menuProps = result.current.getMenuProps()

      expect(menuProps['aria-labelledby']).toEqual(`${defaultIds.labelId}`)
    })

    test('assign custom value passed by user to aria-labelledby', () => {
      const props = {
        labelId: 'my-custom-label-id',
      }
      const {result} = setupHook(props)
      const menuProps = result.current.getMenuProps()

      expect(menuProps['aria-labelledby']).toEqual(`${props.labelId}`)
    })

    test('assign default value to id', () => {
      const {result} = setupHook()
      const menuProps = result.current.getMenuProps()

      expect(menuProps.id).toEqual(`${defaultIds.menuId}`)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        menuId: 'my-custom-menu-id',
      }
      const {result} = setupHook(props)
      const menuProps = result.current.getMenuProps()

      expect(menuProps.id).toEqual(`${props.menuId}`)
    })

    test("assign 'listbox' to role", () => {
      const {result} = setupHook()
      const menuProps = result.current.getMenuProps()

      expect(menuProps.role).toEqual('listbox')
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = setupHook()

      expect(result.current.getMenuProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('event handler onMouseLeave is called along with downshift handler', () => {
      const userOnMouseLeave = jest.fn()
      const {result} = setupHook({initialHighlightedIndex: 2})

      rtlAct(() => {
        const {onMouseLeave} = result.current.getMenuProps({
          onMouseLeave: userOnMouseLeave,
        })
        const {ref: inputRef} = result.current.getInputProps()

        inputRef({focus: noop})
        result.current.toggleMenu()
        onMouseLeave({preventDefault: noop})
      })

      expect(userOnMouseLeave).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(-1)
    })

    test("event handler onMouseLeave is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnMouseLeave = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = setupHook({initialHighlightedIndex: 2})

      rtlAct(() => {
        const {onMouseLeave} = result.current.getMenuProps({
          onMouseLeave: userOnMouseLeave,
        })
        const {ref: inputRef} = result.current.getInputProps()

        inputRef({focus: noop})
        result.current.toggleMenu()
        onMouseLeave({preventDefault: noop})
      })

      expect(userOnMouseLeave).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(2)
    })
  })
})
