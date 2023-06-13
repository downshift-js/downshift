import {act, renderHook} from '@testing-library/react-hooks'
import {
  renderCombobox,
  renderUseCombobox,
  items,
  defaultIds,
  mouseMoveItemAtIndex,
  getItemAtIndex,
  getInput,
  getItems,
  clickOnItemAtIndex,
  keyDownOnInput,
} from '../testUtils'
import useCombobox from '..'

describe('getItemProps', () => {
  test('throws error if no index or item has been passed', () => {
    const {result} = renderUseCombobox()

    expect(result.current.getItemProps).toThrowError(
      'Pass either item or index to getItemProps!',
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

    test("click handler is not called if it's disabled", () => {
      const {result} = renderUseCombobox({
        isItemDisabled(_item, index) {
          return index === 0
        },
      })
      const itemProps = result.current.getItemProps({
        index: 0,
      })

      expect(itemProps.onClick).toBeUndefined()
      expect(itemProps.onMouseMove).toBeDefined()
      expect(itemProps.onMouseDown).toBeDefined()
      expect(itemProps['aria-disabled']).toBe(true)
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

    test('event handler onMouseDown is called along with downshift handler', () => {
      const userOnMouseDown = jest.fn()
      const preventDefault = jest.fn()
      const {result} = renderUseCombobox({initialIsOpen: true})

      act(() => {
        const {onMouseDown} = result.current.getItemProps({
          index: 1,
          onMouseDown: userOnMouseDown,
        })

        onMouseDown({preventDefault})
      })

      expect(userOnMouseDown).toHaveBeenCalledTimes(1)
      expect(preventDefault).toHaveBeenCalledTimes(1)
    })

    test("event handler onMouseDown is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnMouseDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const preventDefault = jest.fn()
      const {result} = renderUseCombobox({initialIsOpen: true})

      act(() => {
        const {onMouseDown} = result.current.getItemProps({
          index: 0,
          onMouseDown: userOnMouseDown,
        })

        onMouseDown({preventDefault})
      })

      expect(userOnMouseDown).toHaveBeenCalledTimes(1)
      expect(preventDefault).not.toHaveBeenCalled()
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
      test('it highlights the item', async () => {
        const index = 1
        renderCombobox({
          isOpen: true,
        })

        await mouseMoveItemAtIndex(index)

        expect(getItemAtIndex(index)).toHaveAttribute('aria-selected', 'true')
        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
      })

      test('it removes highlight from the previously highlighted item', async () => {
        const index = 1
        const previousIndex = 2
        renderCombobox({
          isOpen: true,
          initialHighlightedIndex: previousIndex,
        })

        await mouseMoveItemAtIndex(index)

        expect(getItemAtIndex(index)).toHaveAttribute('aria-selected', 'true')
        expect(getItemAtIndex(previousIndex)).toHaveAttribute(
          'aria-selected',
          'false',
        )
        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
        expect(getItemAtIndex(previousIndex)).toHaveAttribute(
          'aria-selected',
          'false',
        )
      })

      it('keeps highlight on multiple events', async () => {
        const index = 1
        renderCombobox({
          isOpen: true,
        })

        await mouseMoveItemAtIndex(index)
        await mouseMoveItemAtIndex(index)
        await mouseMoveItemAtIndex(index)

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
        expect(getItemAtIndex(index)).toHaveAttribute('aria-selected', 'true')
      })

      it('removes highlight from previous item even if current item is disabled', async () => {
        const disabledIndex = 1
        const highlightedIndex = 2

        renderCombobox({
          items,
          isOpen: true,
          isItemDisabled(_item, index) {
            return index === disabledIndex
          },
        })
        const input = getInput()

        await mouseMoveItemAtIndex(highlightedIndex)

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        await mouseMoveItemAtIndex(disabledIndex)
        expect(input).toHaveAttribute('aria-activedescendant', '')
      })
    })

    describe('on click', () => {
      test('it selects the item and keeps focus on the input', async () => {
        const index = 1
        renderCombobox({
          initialIsOpen: true,
        })
        const input = getInput()

        await clickOnItemAtIndex(index)

        expect(getItems()).toHaveLength(0)
        expect(input).toHaveValue(items[index])
        expect(input).toHaveFocus()
      })

      test('it selects the item and resets to user defined defaults', async () => {
        const index = 1
        const defaultHighlightedIndex = 2
        renderCombobox({
          defaultIsOpen: true,
          defaultHighlightedIndex,
        })
        const input = getInput()

        await clickOnItemAtIndex(index)

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
    test('is performed by the menu to the item if highlighted and not 100% visible', async () => {
      const scrollIntoView = jest.fn()
      renderCombobox({
        initialIsOpen: true,
        scrollIntoView,
      })

      await keyDownOnInput('{End}')

      expect(scrollIntoView).toHaveBeenCalledTimes(1)
    })
  })

  describe('non production errors', () => {
    beforeAll(() => {
      jest.spyOn(console, 'warn').mockImplementation(() => {})
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    test('will be displayed if getInputProps is not called', () => {
      renderHook(() => {
        const {getItemProps} = useCombobox({items})
        getItemProps({disabled: true})
      })

      expect(console.warn.mock.calls[0][0]).toMatchInlineSnapshot(
        `Passing "disabled" as an argument to getItemProps is not supported anymore. Please use the isItemDisabled prop from useCombobox.`,
      )
    })
  })
})
