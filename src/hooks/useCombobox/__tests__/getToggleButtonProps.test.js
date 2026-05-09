import {
  act,
  renderCombobox,
  renderUseCombobox,
  items,
  defaultIds,
  clickOnToggleButton,
  getInput,
  getItems,
} from './utils'

jest.mock('../../utils', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const utils = jest.requireActual('../../utils')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const hooksUtils = jest.requireActual('../../../utils')

  return {
    ...utils,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    useGetterPropsCalledChecker: () => hooksUtils.noop,
  }
})

// We are using React 18.
jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useId() {
      return 'test-id'
    },
  }
})

beforeEach(jest.resetAllMocks)
afterAll(jest.restoreAllMocks)

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

      expect(toggleButtonProps['aria-expanded']).toEqual(true)
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
        const {user} = renderCombobox()

        await clickOnToggleButton(user)

        expect(getItems()).toHaveLength(items.length)
      })

      test('closes the open menu', async () => {
        const {user} = renderCombobox({
          initialIsOpen: true,
        })

        await clickOnToggleButton(user)

        expect(getItems()).toHaveLength(0)
      })

      test('opens and closes menu at consecutive clicks', async () => {
        const {user} = renderCombobox()

        await clickOnToggleButton(user)

        expect(getItems()).toHaveLength(items.length)

        await clickOnToggleButton(user)

        expect(getItems()).toHaveLength(0)

        await clickOnToggleButton(user)

        expect(getItems()).toHaveLength(items.length)

        await clickOnToggleButton(user)

        expect(getItems()).toHaveLength(0)
      })

      test('opens the closed menu without any option highlighted', async () => {
        const {user} = renderCombobox()

        await clickOnToggleButton(user)

        expect(getInput()).toHaveAttribute('aria-activedescendant', '')
      })

      test('opens the closed menu with selected option highlighted', async () => {
        const selectedIndex = 3
        const {user} = renderCombobox({
          initialSelectedItem: items[selectedIndex],
        })

        await clickOnToggleButton(user)

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', async () => {
        const initialHighlightedIndex = 3
        const {user} = renderCombobox({
          initialHighlightedIndex,
        })

        await clickOnToggleButton(user)

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        await clickOnToggleButton(user)
        await clickOnToggleButton(user)

        expect(getInput()).toHaveAttribute('aria-activedescendant', '')
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', async () => {
        const defaultHighlightedIndex = 3
        const {user} = renderCombobox({
          defaultHighlightedIndex,
        })
        const input = getInput()

        await clickOnToggleButton(user)

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        await clickOnToggleButton(user)
        await clickOnToggleButton(user)

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', async () => {
        const highlightedIndex = 3
        const {user} = renderCombobox({
          highlightedIndex,
        })
        const input = getInput()

        await clickOnToggleButton(user)

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        await clickOnToggleButton(user)
        await clickOnToggleButton(user)

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and sets focus on the input', async () => {
        const {user} = renderCombobox()

        await clickOnToggleButton(user)

        expect(getInput()).toHaveFocus()
      })

      test('opens the closed menu and sets no focus if there is no environment', async () => {
        const {user} = renderCombobox({environment: undefined})

        await clickOnToggleButton(user)

        expect(getInput()).not.toHaveFocus()
      })
    })
  })
})
