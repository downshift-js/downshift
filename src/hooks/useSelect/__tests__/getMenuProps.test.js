/* eslint-disable jest/no-disabled-tests */
import {act} from '@testing-library/react-hooks'
import {cleanup} from '@testing-library/react'
import {renderUseSelect, defaultIds, renderSelect} from '../testUtils'

describe('getMenuProps', () => {
  afterEach(cleanup)

  describe('hook props', () => {
    test('assign default value to id', () => {
      const {result} = renderUseSelect()
      const menuProps = result.current.getMenuProps()

      expect(menuProps.id).toEqual(`${defaultIds.menuId}`)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        menuId: 'my-custom-menu-id',
      }
      const {result} = renderUseSelect(props)
      const menuProps = result.current.getMenuProps()

      expect(menuProps.id).toEqual(`${props.menuId}`)
    })

    test("assign 'listbox' to role", () => {
      const {result} = renderUseSelect()
      const menuProps = result.current.getMenuProps()

      expect(menuProps.role).toEqual('listbox')
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseSelect()

      expect(result.current.getMenuProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('custom ref passed by the user is used', () => {
      const {result} = renderUseSelect()
      const refFn = jest.fn()
      const menuNode = {}

      act(() => {
        const {ref} = result.current.getMenuProps({ref: refFn})

        ref(menuNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(menuNode)
    })

    test('custom ref with custom name passed by the user is used', () => {
      const {result} = renderUseSelect()
      const refFn = jest.fn()
      const menuNode = {}

      act(() => {
        const {blablaRef} = result.current.getMenuProps({
          refKey: 'blablaRef',
          blablaRef: refFn,
        })

        blablaRef(menuNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(menuNode)
    })

    test('event handler onMouseLeave is called along with downshift handler', () => {
      const userOnMouseLeave = jest.fn()
      const {result} = renderUseSelect({
        initialHighlightedIndex: 2,
        initialIsOpen: true,
      })

      act(() => {
        const {onMouseLeave} = result.current.getMenuProps({
          onMouseLeave: userOnMouseLeave,
        })

        onMouseLeave({})
      })

      expect(userOnMouseLeave).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(-1)
    })

    test("event handler onMouseLeave is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnMouseLeave = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseSelect({
        initialHighlightedIndex: 2,
        initialIsOpen: true,
      })

      act(() => {
        const {onMouseLeave} = result.current.getMenuProps({
          onMouseLeave: userOnMouseLeave,
        })

        onMouseLeave({})
      })

      expect(userOnMouseLeave).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(2)
    })
  })

  describe('event handlers', () => {
    describe('on mouse leave', () => {
      test('the highlightedIndex should be reset', () => {
        const {mouseLeaveMenu, toggleButton} = renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex: 2,
        })

        mouseLeaveMenu()

        expect(toggleButton).not.toHaveAttribute('aria-activedescendant')
      })
    })
  })
})
