/* eslint-disable jest/no-disabled-tests */
import {fireEvent, cleanup} from '@testing-library/react'
import {act as rtlAct} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {setup, dataTestIds, items, setupHook, defaultIds} from '../testUtils'

describe('getToggleButtonProps', () => {
  afterEach(cleanup)

  describe('hook props', () => {
    test('assign default value to id', () => {
      const {result} = setupHook()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.id).toEqual(defaultIds.toggleButtonId)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        toggleButtonId: 'my-custom-toggle-button-id',
      }
      const {result} = setupHook(props)
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.id).toEqual(props.toggleButtonId)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = setupHook()

      expect(result.current.getToggleButtonProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = setupHook()

      rtlAct(() => {
        const {ref: inputRef} = result.current.getInputProps()
        const {
          ref: toggleButtonRef,
          onClick,
        } = result.current.getToggleButtonProps({onClick: userOnClick})

        inputRef({focus: noop})
        toggleButtonRef({})
        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = setupHook()

      rtlAct(() => {
        const {ref: inputRef} = result.current.getInputProps()
        const {
          ref: toggleButtonRef,
          onClick,
        } = result.current.getToggleButtonProps({onClick: userOnClick})

        toggleButtonRef({focus: noop})
        inputRef({focus: noop})
        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('event handlers', () => {
    describe('on click', () => {
      test('opens the closed menu', () => {
        const wrapper = setup()
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(menu.childNodes).toHaveLength(items.length)
      })

      test('closes the open menu', () => {
        const wrapper = setup({initialIsOpen: true})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(menu.childNodes).toHaveLength(0)
      })

      test('opens and closes menu at consecutive clicks', () => {
        const wrapper = setup()
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(toggleButton)
        expect(menu.childNodes).toHaveLength(items.length)

        fireEvent.click(toggleButton)
        expect(menu.childNodes).toHaveLength(0)
        // fireEvent.blur(input)
        input.blur() // the code above does not blur.

        fireEvent.click(toggleButton)
        expect(menu.childNodes).toHaveLength(items.length)

        fireEvent.click(toggleButton)
        expect(menu.childNodes).toHaveLength(0)
      })

      test('opens the closed menu without any option highlighted', () => {
        const wrapper = setup()
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBeNull()
      })

      test('opens the closed menu with selected option highlighted', () => {
        const selectedIndex = 3
        const wrapper = setup({initialSelectedItem: items[selectedIndex]})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(toggleButton)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', () => {
        const initialHighlightedIndex = 3
        const wrapper = setup({initialHighlightedIndex})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(toggleButton)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(initialHighlightedIndex),
        )

        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)

        expect(input.getAttribute('aria-activedescendant')).toBeNull()
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', () => {
        const defaultHighlightedIndex = 3
        const wrapper = setup({defaultHighlightedIndex})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(toggleButton)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        fireEvent.click(toggleButton)
        // fireEvent.blur(input)
        input.blur() // the code above does not blur.
        fireEvent.click(toggleButton)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', () => {
        const highlightedIndex = 3
        const wrapper = setup({highlightedIndex})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(toggleButton)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(highlightedIndex),
        )

        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and sets focus on the input', () => {
        const wrapper = setup()
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(toggleButton)

        expect(document.activeElement).toBe(input)
      })

      test('closes the open menu and leaves focus on the toggleButton', () => {
        const wrapper = setup({initialIsOpen: true})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.click(toggleButton)

        expect(document.activeElement).toBe(input)
      })
    })
  })
})
