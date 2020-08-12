import {act} from '@testing-library/react-hooks'
import {renderCombobox, renderUseCombobox} from '../testUtils'
import {items, defaultIds} from '../../testUtils'

describe('getItemProps', () => {
  test('throws error if no index or item has been passed', () => {
    const {result} = renderUseCombobox()

    expect(result.current.getItemProps).toThrowError(
      'Pass either item or item index in getItemProps!',
    )
  })

  describe('hook props', () => {
    test("assign 'option' to role", () => {
      const {result} = renderUseCombobox()
      const itemProps = result.current.getItemProps({index: 0})

      expect(itemProps.role).toEqual('option')
    })

    test('assign default value to id', () => {
      const {result} = renderUseCombobox()
      const itemProps = result.current.getItemProps({index: 0})

      expect(itemProps.id).toEqual(`${defaultIds.getItemId(0)}`)
    })

    test('assign custom value passed by user to id', () => {
      const getItemId = index => `my-custom-item-id-${index}`
      const {result} = renderUseCombobox({getItemId})
      const itemProps = result.current.getItemProps({index: 0})

      expect(itemProps.id).toEqual(getItemId(0))
    })

    test("assign 'true' to aria-selected if item is highlighted", () => {
      const {result} = renderUseCombobox({highlightedIndex: 2})
      const itemProps = result.current.getItemProps({index: 2})

      expect(itemProps['aria-selected']).toEqual('true')
    })

    test("assign 'false' to aria-selected if item is not highlighted", () => {
      const {result} = renderUseCombobox({highlightedIndex: 1})
      const itemProps = result.current.getItemProps({index: 2})

      expect(itemProps['aria-selected']).toEqual('false')
    })

    test("handlers are not called if it's disabled", () => {
      const {result} = renderUseCombobox()
      const itemProps = result.current.getItemProps({
        disabled: true,
        index: 0,
      })

      expect(itemProps.onClick).toBeUndefined()
      expect(itemProps.onMouseMove).toBeUndefined()
      // eslint-disable-next-line jest-dom/prefer-enabled-disabled
      expect(itemProps.disabled).toBe(true)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseCombobox()

      expect(
        result.current.getItemProps({index: 0, foo: 'bar'}),
      ).toHaveProperty('foo', 'bar')
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseCombobox({initialIsOpen: true})

      act(() => {
        const {onClick} = result.current.getItemProps({
          index: 0,
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
      expect(result.current.selectedItem).not.toBeNull()
    })

    test('event handler onMouseMove is called along with downshift handler', () => {
      const userOnMouseMove = jest.fn()
      const {result} = renderUseCombobox({initialIsOpen: true})

      act(() => {
        const {onMouseMove} = result.current.getItemProps({
          index: 1,
          onMouseMove: userOnMouseMove,
        })

        onMouseMove({})
      })

      expect(userOnMouseMove).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(1)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox({initialIsOpen: true})

      act(() => {
        const {onClick} = result.current.getItemProps({
          index: 0,
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
      expect(result.current.selectedItem).toBeNull()
    })

    test("event handler onMouseMove is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const useronMouseMove = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox({initialIsOpen: true})

      act(() => {
        const {onMouseMove} = result.current.getItemProps({
          index: 1,
          onMouseMove: useronMouseMove,
        })

        onMouseMove({})
      })

      expect(useronMouseMove).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(-1)
    })
  })

  describe('event handlers', () => {
    describe('on mouse over', () => {
      test('it highlights the item', () => {
        const index = 1
        const {input, mouseMoveItemAtIndex, getItemAtIndex} = renderCombobox({
          isOpen: true,
        })

        mouseMoveItemAtIndex(index)

        expect(getItemAtIndex(index)).toHaveAttribute('aria-selected', 'true')
        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
      })

      test('it removes highlight from the previously highlighted item', () => {
        const index = 1
        const previousIndex = 2
        const {input, mouseMoveItemAtIndex, getItemAtIndex} = renderCombobox({
          isOpen: true,
          initialHighlightedIndex: previousIndex,
        })

        mouseMoveItemAtIndex(index)

        expect(getItemAtIndex(index)).toHaveAttribute('aria-selected', 'true')
        expect(getItemAtIndex(previousIndex)).toHaveAttribute(
          'aria-selected',
          'false',
        )
        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
        expect(getItemAtIndex(previousIndex)).toHaveAttribute(
          'aria-selected',
          'false',
        )
      })

      it('keeps highlight on multiple events', () => {
        const index = 1
        const {input, mouseMoveItemAtIndex, getItemAtIndex} = renderCombobox({
          isOpen: true,
        })

        mouseMoveItemAtIndex(index)
        mouseMoveItemAtIndex(index)
        mouseMoveItemAtIndex(index)

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
        expect(getItemAtIndex(index)).toHaveAttribute('aria-selected', 'true')
      })
    })

    describe('on click', () => {
      test('it selects the item', () => {
        const index = 1
        const {input, getItems, clickOnItemAtIndex} = renderCombobox({
          initialIsOpen: true,
        })

        clickOnItemAtIndex(index)

        expect(getItems()).toHaveLength(0)
        expect(input).toHaveValue(items[index])
      })

      test('it selects the item and resets to user defined defaults', () => {
        const index = 1
        const defaultHighlightedIndex = 2
        const {input, getItems, clickOnItemAtIndex} = renderCombobox({
          defaultIsOpen: true,
          defaultHighlightedIndex,
        })

        clickOnItemAtIndex(index)

        expect(input).toHaveValue(items[index])
        expect(getItems()).toHaveLength(items.length)
        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })
    })
  })

  describe('scrolling', () => {
    test('is performed by the menu to the item if highlighted and not 100% visible', () => {
      const scrollIntoView = jest.fn()
      const {keyDownOnInput} = renderCombobox({
        initialIsOpen: true,
        scrollIntoView,
      })

      keyDownOnInput('End')

      expect(scrollIntoView).toHaveBeenCalledTimes(1)
    })
  })
})
