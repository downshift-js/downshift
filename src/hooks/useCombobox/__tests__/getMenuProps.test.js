import {act} from '@testing-library/react-hooks'
import {cleanup} from '@testing-library/react'
import {noop} from '../../../utils'
import {renderCombobox, renderUseCombobox} from '../testUtils'
import {defaultIds} from '../../testUtils'

describe('getMenuProps', () => {
  afterEach(cleanup)

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
        test('the highlightedIndex should be reset', () => {
          const {mouseLeaveMenu, input} = renderCombobox({
            initialIsOpen: true,
            initialHighlightedIndex: 2,
          })

          mouseLeaveMenu()

          expect(input).not.toHaveAttribute('aria-activedescendant')
        })
      })
    })
  })
})
