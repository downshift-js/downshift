import {renderHook, act as hooksAct} from '@testing-library/react-hooks'
import {
  renderUseSelect,
  renderSelect,
  getToggleButton,
  mouseLeaveItemAtIndex,
  mouseMoveItemAtIndex,
} from '../testUtils'
import {defaultIds, items} from '../../testUtils'
import utils from '../../utils'
import useSelect from '..'

describe('getMenuProps', () => {
  describe('hook props', () => {
    test('assign default value to aria-labelledby', () => {
      const {result} = renderUseSelect()
      const menuProps = result.current.getMenuProps()

      expect(menuProps['aria-labelledby']).toEqual(`${defaultIds.labelId}`)
    })

    test('assign custom value passed by user to aria-labelledby', () => {
      const props = {
        labelId: 'my-custom-label-id',
      }
      const {result} = renderUseSelect(props)
      const menuProps = result.current.getMenuProps()

      expect(menuProps['aria-labelledby']).toEqual(`${props.labelId}`)
    })

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

    test("do not assign 'aria-labelledby' if it has aria-label", () => {
      const ariaLabel = 'not so fast'
      const {result} = renderUseSelect()
      const menuProps = result.current.getMenuProps({'aria-label': ariaLabel})

      expect(menuProps['aria-labelledby']).toBeUndefined()
      expect(menuProps['aria-label']).toBe(ariaLabel)
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

      hooksAct(() => {
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

      hooksAct(() => {
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

      hooksAct(() => {
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

      hooksAct(() => {
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
      test('the highlightedIndex should be reset', async () => {
        renderSelect({
          initialIsOpen: true,
        })
        const itemIndex = 2

        await mouseMoveItemAtIndex(itemIndex)

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(itemIndex),
        )

        await mouseLeaveItemAtIndex(itemIndex)

        expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
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
        const {getToggleButtonProps} = useSelect({items})
        getToggleButtonProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: You forgot to call the getMenuProps getter function on your component / element.`,
      )
    })

    test('will not be displayed if getMenuProps is not called on subsequent renders', () => {
      let firstRender = true
      const {rerender} = renderHook(() => {
        const {getToggleButtonProps, getMenuProps} = useSelect({items})
        getToggleButtonProps({}, {suppressRefError: true})

        // eslint-disable-next-line jest/no-if, jest/no-conditional-in-test
        if (firstRender) {
          firstRender = false
          getMenuProps({}, {suppressRefError: true})
        }
      })

      rerender()

      expect(console.error).not.toHaveBeenCalled()
    })

    test('will be displayed if element ref is not set and suppressRefError is false', () => {
      renderHook(() => {
        const {getMenuProps, getToggleButtonProps} = useSelect({
          items,
        })

        getToggleButtonProps({}, {suppressRefError: true})
        getMenuProps()
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: The ref prop "ref" from getMenuProps was not applied correctly on your element.`,
      )
    })

    // this test will cover also the equivalent getToggleButtonProps case.
    test('will not be displayed if element ref is not set and suppressRefError is true', () => {
      renderHook(() => {
        const {getMenuProps, getToggleButtonProps} = useSelect({
          items,
        })

        getToggleButtonProps({}, {suppressRefError: true})
        getMenuProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
    })

    test('will not be displayed if called with a correct ref', () => {
      const refFn = jest.fn()
      const menuNode = {}

      renderHook(() => {
        const {getToggleButtonProps, getMenuProps} = useSelect({
          items,
        })

        getToggleButtonProps({}, {suppressRefError: true})

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
