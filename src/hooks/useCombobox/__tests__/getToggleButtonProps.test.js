import {act} from '@testing-library/react-hooks'
import {
  renderCombobox,
  renderUseCombobox,
  items,
  defaultIds,
  clickOnToggleButton,
  getInput,
  getItems,
} from '../testUtils'

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

    test('assign tabindex of -1', () => {
      const {result} = renderUseCombobox()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.tabIndex).toEqual(-1)
    })

    test('assign default value to aria-controls', () => {
      const {result} = renderUseCombobox()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-controls']).toEqual(`${defaultIds.menuId}`)
    })

    test('assign custom value passed by user to aria-controls', () => {
      const props = {
        menuId: 'my-custom-menu-id',
      }
      const {result} = renderUseCombobox(props)
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-controls']).toEqual(`${props.menuId}`)
    })

    test("assign 'false' value to aria-expanded when menu is closed", () => {
      const {result} = renderUseCombobox({isOpen: false})
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-expanded']).toEqual(false)
    })

    test("assign 'true' value to aria-expanded when menu is open", () => {
      const {result} = renderUseCombobox({isOpen: true})

      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-expanded']).toEqual(false)
    })

    test('omit event handlers when disabled', () => {
      const {result} = renderUseCombobox()
      const toggleButtonProps = result.current.getToggleButtonProps({
        disabled: true,
      })

      expect(toggleButtonProps.onClick).toBeUndefined()
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
      test('opens the closed menu', async () => {
        renderCombobox()

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)
      })

      test('closes the open menu', async () => {
        renderCombobox({
          initialIsOpen: true,
        })

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(0)
      })

      test('opens and closes menu at consecutive clicks', async () => {
        renderCombobox()

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(0)

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(0)
      })

      test('opens the closed menu without any option highlighted', async () => {
        renderCombobox()

        await clickOnToggleButton()

        expect(getInput()).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu with selected option highlighted', async () => {
        const selectedIndex = 3
        renderCombobox({
          initialSelectedItem: items[selectedIndex],
        })

        await clickOnToggleButton()

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', async () => {
        const initialHighlightedIndex = 3
        renderCombobox({
          initialHighlightedIndex,
        })

        await clickOnToggleButton()

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        await clickOnToggleButton()
        await clickOnToggleButton()

        expect(getInput()).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', async () => {
        const defaultHighlightedIndex = 3
        renderCombobox({
          defaultHighlightedIndex,
        })
        const input = getInput()

        await clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        await clickOnToggleButton()
        await clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', async () => {
        const highlightedIndex = 3
        renderCombobox({
          highlightedIndex,
        })
        const input = getInput()

        await clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        await clickOnToggleButton()
        await clickOnToggleButton()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and sets focus on the input', async () => {
        renderCombobox()

        await clickOnToggleButton()

        expect(getInput()).toHaveFocus()
      })
    })
  })
})
