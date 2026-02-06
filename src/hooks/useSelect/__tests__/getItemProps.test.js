import {act, renderHook} from '@testing-library/react'
import {
  renderUseSelect,
  renderSelect,
  mouseMoveItemAtIndex,
  getItemAtIndex,
  getToggleButton,
  clickOnItemAtIndex,
  getItems,
  keyDownOnToggleButton,
  clickOnToggleButton,
  items,
  defaultIds,
} from '../testUtils'
import useSelect from '..'

describe('getItemProps', () => {
  test('throws error if no index or item has been passed', () => {
    const {result} = renderUseSelect()

    expect(result.current.getItemProps).toThrow(
      'Pass either item or index to getItemProps!',
    )
  })

  describe('hook props', () => {
    test("assign 'option' to role", () => {
      const {result} = renderUseSelect()

      expect(result.current.getItemProps({index: 0}).role).toEqual('option')
    })

    test('assign default value to id', () => {
      const {result} = renderUseSelect()

      expect(result.current.getItemProps({index: 0}).id).toEqual(
        `${defaultIds.getItemId(0)}`,
      )
    })

    test('assign custom value passed by user to id', () => {
      const getItemId = index => `my-custom-item-id-${index}`
      const {result} = renderUseSelect({getItemId})

      expect(result.current.getItemProps({index: 0}).id).toEqual(getItemId(0))
    })

    test("assign 'true' to aria-selected if item is selected", () => {
      const {result} = renderUseSelect({
        highlightedIndex: 2,
        selectedItem: items[3],
      })
      const item2Props = result.current.getItemProps({index: 2})
      const item3Props = result.current.getItemProps({index: 3})

      expect(item2Props['aria-selected']).toEqual(false)
      expect(item3Props['aria-selected']).toEqual(true)
    })

    test("assign 'false' to aria-selected if item is not highlighted", () => {
      const {result} = renderUseSelect({highlightedIndex: 1})
      const itemProps = result.current.getItemProps({index: 2})

      expect(itemProps['aria-selected']).toEqual(false)
    })

    test('omit click handler when disabled', () => {
      const {result} = renderUseSelect({
        isItemDisabled(_item, index) {
          return index === 0
        },
      })
      const itemProps = result.current.getItemProps({
        index: 0,
      })

      expect(itemProps.onMouseMove).toBeDefined()
      expect(itemProps.onClick).toBeUndefined()
      expect(itemProps['aria-disabled']).toBe(true)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseSelect()

      expect(
        result.current.getItemProps({index: 0, foo: 'bar'}),
      ).toHaveProperty('foo', 'bar')
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseSelect({initialIsOpen: true})

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
      const {result} = renderUseSelect({initialIsOpen: true})

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
      const {result} = renderUseSelect({initialIsOpen: true})

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
      const {result} = renderUseSelect({initialIsOpen: true})

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
      const {result} = renderUseSelect({initialIsOpen: true})

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
      const userOnMouseMove = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseSelect({initialIsOpen: true})

      act(() => {
        const {onMouseMove} = result.current.getItemProps({
          index: 1,
          onMouseMove: userOnMouseMove,
        })

        onMouseMove({})
      })

      expect(userOnMouseMove).toHaveBeenCalledTimes(1)
      expect(result.current.highlightedIndex).toBe(-1)
    })
  })

  describe('event handlers', () => {
    describe('on mouse over', () => {
      test('it highlights the item', async () => {
        const index = 1

        renderSelect({
          isOpen: true,
        })

        await mouseMoveItemAtIndex(index)

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
      })

      test('it highlights successive items item', async () => {
        renderSelect({
          isOpen: true,
        })

        await mouseMoveItemAtIndex(3)

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(3),
        )

        await mouseMoveItemAtIndex(2)

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(2),
        )

        await mouseMoveItemAtIndex(1)

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(1),
        )
      })

      test('it removes highlight from the previously highlighted item', async () => {
        const index = 1
        const previousIndex = 2
        renderSelect({
          isOpen: true,
          initialHighlightedIndex: previousIndex,
        })
        const toggleButton = getToggleButton()

        await mouseMoveItemAtIndex(index)

        expect(toggleButton).not.toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(previousIndex),
        )
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
      })

      it('keeps highlight on multiple events', async () => {
        const index = 1
        renderSelect({
          isOpen: true,
        })

        await mouseMoveItemAtIndex(index)
        await mouseMoveItemAtIndex(index)
        await mouseMoveItemAtIndex(index)

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(index),
        )
      })

      it('removes highlight from previous item even if current item is disabled', async () => {
        const disabledIndex = 1
        const highlightedIndex = 2

        renderSelect({
          items,
          isOpen: true,
          isItemDisabled(_item, index) {
            return index === disabledIndex
          },
        })
        const toggleButton = getToggleButton()

        await mouseMoveItemAtIndex(highlightedIndex)

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        await mouseMoveItemAtIndex(disabledIndex)
        expect(toggleButton).toHaveAttribute('aria-activedescendant', '')
      })

      // Test that we don't call the mouse move handler on mobile.
      test('does not set highlight the item if a touch event ocurred', async () => {
        let touchEndHandler
        const index = 1

        renderSelect({
          isOpen: true,
          environment: {
            addEventListener: (name, handler) => {
              // eslint-disable-next-line jest/no-conditional-in-test
              if (name === 'touchend') {
                touchEndHandler = handler
              }
            },
            removeEventListener: () => {},
            document: {
              createElement: () => {},
              getElementById: () => {},
              activeElement: () => {},
              body: {},
            },
            Node: () => {},
          },
        })

        act(() => touchEndHandler({target: null}))
        await mouseMoveItemAtIndex(index)

        expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
      })
    })

    describe('on click', () => {
      test('it selects the item', async () => {
        const index = 1
        renderSelect({
          initialIsOpen: true,
          defaultHighlightedIndex: 3,
        })

        await clickOnItemAtIndex(index)

        expect(getItems()).toHaveLength(0)
        expect(getToggleButton()).toHaveTextContent(items[index])

        await clickOnToggleButton()

        expect(getItemAtIndex(index)).toHaveAttribute('aria-selected', 'true')
      })

      test('it selects the item and resets to user defined defaults', async () => {
        const index = 1
        renderSelect({
          defaultIsOpen: true,
          defaultHighlightedIndex: 2,
        })
        const toggleButton = getToggleButton()

        await clickOnItemAtIndex(index)

        expect(toggleButton).toHaveTextContent(items[index])
        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(2),
        )
      })

      test('it selects the item and resets to user defined defaults, but considers disabled status for an item', async () => {
        const index = 1
        const defaultHighlightedIndex = 2
        renderSelect({
          defaultIsOpen: true,
          defaultHighlightedIndex,
          isItemDisabled(_item, idx) {
            return idx === defaultHighlightedIndex
          },
        })
        const toggleButton = getToggleButton()

        await clickOnItemAtIndex(index)

        expect(toggleButton).toHaveTextContent(items[index])
        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute('aria-activedescendant', '')
      })
    })
  })

  describe('scrolling', () => {
    test('is performed by the menu to the item if highlighted and not 100% visible', async () => {
      const scrollIntoView = jest.fn()
      renderSelect({
        initialIsOpen: true,
        scrollIntoView,
      })

      await keyDownOnToggleButton('{End}')

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
        const {getItemProps} = useSelect({items})
        getItemProps({disabled: true, index: 9})
      })

      expect(console.warn.mock.calls[0][0]).toMatchInlineSnapshot(
        `Passing "disabled" as an argument to getItemProps is not supported anymore. Please use the isItemDisabled prop from useSelect.`,
      )
    })
  })
})
