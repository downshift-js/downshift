/* eslint-disable jest/no-disabled-tests */
import {act} from '@testing-library/react-hooks'
import {renderCombobox, renderUseCombobox} from '../testUtils'
import {items, defaultIds} from '../../testUtils'

describe('getToggleButtonProps', () => {
  describe('hook props', () => {
    test('assign default value to id', () => {
      const {result} = renderUseCombobox()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.id).toEqual(defaultIds.toggleButtonId)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        toggleButtonId: 'my-custom-toggle-button-id',
      }
      const {result} = renderUseCombobox(props)
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.id).toEqual(props.toggleButtonId)
    })

    test('omit event handlers when disabled', () => {
      const {result} = renderUseCombobox()
      const toggleButtonProps = result.current.getToggleButtonProps({
        disabled: true,
      })

      expect(toggleButtonProps.onClick).toBeUndefined()
      // eslint-disable-next-line jest-dom/prefer-enabled-disabled
      expect(toggleButtonProps.disabled).toBe(true)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseCombobox()

      expect(result.current.getToggleButtonProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseCombobox()

      act(() => {
        const {onClick} = result.current.getToggleButtonProps({
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox()

      act(() => {
        const {onClick} = result.current.getToggleButtonProps({
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('event handlers', () => {
    describe('on click', () => {
      test('opens the closed menu', () => {
        const {getItems, clickOnToggleButton} = renderCombobox()

        clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)
      })

      test('closes the open menu', () => {
        const {getItems, clickOnToggleButton} = renderCombobox({
          initialIsOpen: true,
        })

        clickOnToggleButton()

        expect(getItems()).toHaveLength(0)
      })

      test('opens and closes menu at consecutive clicks', () => {
        const {getItems, clickOnToggleButton} = renderCombobox()

        clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)

        clickOnToggleButton()

        expect(getItems()).toHaveLength(0)

        clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)

        clickOnToggleButton()

        expect(getItems()).toHaveLength(0)
      })

      test('opens the closed menu without any option highlighted', () => {
        const {input, clickOnToggleButton} = renderCombobox()

        clickOnToggleButton()

        expect(input).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu with selected option highlighted', () => {
        const selectedIndex = 3
        const {input, clickOnToggleButton} = renderCombobox({
          initialSelectedItem: items[selectedIndex],
        })

        clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', () => {
        const initialHighlightedIndex = 3
        const {input, clickOnToggleButton} = renderCombobox({
          initialHighlightedIndex,
        })

        clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(input).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', () => {
        const defaultHighlightedIndex = 3
        const {input, clickOnToggleButton} = renderCombobox({
          defaultHighlightedIndex,
        })

        clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', () => {
        const highlightedIndex = 3
        const {input, clickOnToggleButton} = renderCombobox({
          highlightedIndex,
        })

        clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and sets focus on the input', () => {
        const {clickOnToggleButton, input} = renderCombobox()

        clickOnToggleButton()

        expect(input).toHaveFocus()
      })
    })
  })
})
