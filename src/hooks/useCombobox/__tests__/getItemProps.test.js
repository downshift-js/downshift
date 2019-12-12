import {fireEvent, cleanup} from '@testing-library/react'
import {act} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {setup, dataTestIds, items, setupHook, defaultIds} from '../testUtils'

describe('getItemProps', () => {
  afterEach(cleanup)

  test('throws error if no index or item has been passed', () => {
    const {result} = setupHook()

    expect(result.current.getItemProps).toThrowError(
      'Pass either item or item index in getItemProps!',
    )
  })

  describe('hook props', () => {
    test("assign 'option' to role", () => {
      const {result} = setupHook()
      const itemProps = result.current.getItemProps({index: 0})

      expect(itemProps.role).toEqual('option')
    })

    test('assign default value to id', () => {
      const {result} = setupHook()
      const itemProps = result.current.getItemProps({index: 0})

      expect(itemProps.id).toEqual(`${defaultIds.getItemId(0)}`)
    })

    test('assign custom value passed by user to id', () => {
      const getItemId = index => `my-custom-item-id-${index}`
      const {result} = setupHook({getItemId})
      const itemProps = result.current.getItemProps({index: 0})

      expect(itemProps.id).toEqual(getItemId(0))
    })

    test("assign 'true' to aria-selected if item is highlighted", () => {
      const {result} = setupHook({highlightedIndex: 2})
      const itemProps = result.current.getItemProps({index: 2})

      expect(itemProps['aria-selected']).toEqual(true)
    })

    test('do not assign aria-selected if item is not highlighted', () => {
      const {result} = setupHook({highlightedIndex: 1})
      const itemProps = result.current.getItemProps({index: 2})

      expect(itemProps['aria-selected']).toBeUndefined()
    })

    test("handlers are not called if it's disabled", () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps({
        disabled: true,
      })

      expect(inputProps.onClick).toBeUndefined()
      expect(inputProps.onMouseMove).toBeUndefined()
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = setupHook()

      expect(
        result.current.getItemProps({index: 0, foo: 'bar'}),
      ).toHaveProperty('foo', 'bar')
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = setupHook()

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        const {ref: itemRef, onClick} = result.current.getItemProps({
          index: 0,
          onClick: userOnClick,
        })

        inputRef({focus: noop})
        itemRef({})
        result.current.toggleMenu()
        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
      expect(result.current.selectedItem).not.toBeNull()
    })

    test('event handler onMouseMove is called along with downshift handler', () => {
      const userOnMouseMove = jest.fn()
      const {result} = setupHook()

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        const {ref: itemRef, onMouseMove} = result.current.getItemProps({
          index: 1,
          onMouseMove: userOnMouseMove,
        })

        inputRef({focus: noop})
        itemRef({})
        result.current.toggleMenu()
        onMouseMove({})
      })

      expect(userOnMouseMove).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(1)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = setupHook()

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        const {ref: itemRef, onClick} = result.current.getItemProps({
          index: 0,
          onClick: userOnClick,
        })

        inputRef({focus: noop})
        itemRef({})
        result.current.toggleMenu()
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
      const {result} = setupHook()

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        const {ref: itemRef, onMouseMove} = result.current.getItemProps({
          index: 1,
          onMouseMove: useronMouseMove,
        })

        inputRef({focus: noop})
        itemRef({})
        result.current.toggleMenu()
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
        const wrapper = setup({isOpen: true})
        const item = wrapper.getByTestId(dataTestIds.item(index))
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.mouseMove(item)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(index),
        )
        expect(item.getAttribute('aria-selected')).toBe('true')
      })

      test('it removes highlight from the previously highlighted item', () => {
        const index = 1
        const previousIndex = 2
        const wrapper = setup({
          isOpen: true,
          initialHighlightedIndex: previousIndex,
        })
        const item = wrapper.getByTestId(dataTestIds.item(index))
        const previousItem = wrapper.getByTestId(
          dataTestIds.item(previousIndex),
        )
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.mouseMove(item)

        expect(input.getAttribute('aria-activedescendant')).not.toBe(
          defaultIds.getItemId(previousIndex),
        )
        expect(previousItem.getAttribute('aria-selected')).toBeNull()
      })

      it('keeps highlight on multiple events', () => {
        const index = 1
        const wrapper = setup({isOpen: true})
        const item = wrapper.getByTestId(dataTestIds.item(index))
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.mouseMove(item)
        fireEvent.mouseMove(item)
        fireEvent.mouseMove(item)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(index),
        )
        expect(item.getAttribute('aria-selected')).toBe('true')
      })
    })

    describe('on click', () => {
      test('it selects the item', () => {
        const index = 1
        const wrapper = setup({initialIsOpen: true})
        const item = wrapper.getByTestId(dataTestIds.item(index))
        const menu = wrapper.getByTestId(dataTestIds.menu)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(item)

        expect(menu.childNodes).toHaveLength(0)
        expect(input.value).toEqual(items[index])
      })

      test('it selects the item and resets to user defined defaults', () => {
        const index = 1
        const wrapper = setup({defaultIsOpen: true, defaultHighlightedIndex: 2})
        const item = wrapper.getByTestId(dataTestIds.item(index))
        const menu = wrapper.getByTestId(dataTestIds.menu)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(item)

        expect(input.value).toEqual(items[index])
        expect(menu.childNodes).toHaveLength(items.length)
        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(2),
        )
      })
    })
  })

  describe('scrolling', () => {
    test('is performed by the menu to the item if highlighted and not 100% visible', () => {
      const scrollIntoView = jest.fn()
      const wrapper = setup({initialIsOpen: true, scrollIntoView})
      const input = wrapper.getByTestId(dataTestIds.input)

      fireEvent.keyDown(input, {key: 'End'})
      expect(scrollIntoView).toHaveBeenCalledTimes(1)
    })
  })
})
