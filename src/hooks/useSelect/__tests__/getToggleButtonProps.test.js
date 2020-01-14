/* eslint-disable jest/no-disabled-tests */
import {fireEvent, cleanup, act as reactAct} from '@testing-library/react'
import {act as reactHooksAct} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {setup, dataTestIds, items, setupHook, defaultIds} from '../testUtils'

describe('getToggleButtonProps', () => {
  afterEach(cleanup)

  describe('hook props', () => {
    test('assign default value to aria-labelledby', () => {
      const {result} = setupHook()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-labelledby']).toEqual(
        `${defaultIds.labelId} ${defaultIds.toggleButtonId}`,
      )
    })

    test('assign custom value passed by user to aria-labelledby', () => {
      const props = {
        labelId: 'my-custom-label-id',
        toggleButtonId: 'my-custom-toggle-button-id',
      }
      const {result} = setupHook(props)
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-labelledby']).toEqual(
        `${props.labelId} ${props.toggleButtonId}`,
      )
    })

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

    test("assign 'listbbox' to aria-haspopup", () => {
      const {result} = setupHook()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-haspopup']).toEqual('listbox')
    })

    test("assign 'false' value to aria-expanded when menu is closed", () => {
      const {result} = setupHook({isOpen: false})
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-expanded']).toEqual(false)
    })

    test("assign 'true' value to aria-expanded when menu is open", () => {
      const {result} = setupHook()

      reactHooksAct(() => {
        const {ref: menuRef} = result.current.getMenuProps()

        menuRef({focus: noop})
        result.current.toggleMenu()
      })

      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-expanded']).toEqual(true)
    })

    test('omit event handlers when disabled', () => {
      const {result} = setupHook()
      const toggleButtonProps = result.current.getToggleButtonProps({
        disabled: true,
      })

      expect(toggleButtonProps.onClick).toBeUndefined()
      expect(toggleButtonProps.onKeyDown).toBeUndefined()
      expect(toggleButtonProps.disabled).toBe(true)
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

      reactHooksAct(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        const {
          ref: toggleButtonRef,
          onClick,
        } = result.current.getToggleButtonProps({onClick: userOnClick})

        menuRef({focus: noop})
        toggleButtonRef({})
        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = setupHook()

      reactHooksAct(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        const {
          ref: toggleButtonRef,
          onKeyDown,
        } = result.current.getToggleButtonProps({onKeyDown: userOnKeyDown})

        menuRef({focus: noop})
        toggleButtonRef({})
        onKeyDown({key: 'ArrowDown', preventDefault: noop})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = setupHook()

      reactHooksAct(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        const {
          ref: toggleButtonRef,
          onClick,
        } = result.current.getToggleButtonProps({onClick: userOnClick})

        toggleButtonRef({focus: noop})
        menuRef({focus: noop})
        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })

    test("event handler onKeyDown is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnKeyDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = setupHook()

      reactHooksAct(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        const {
          ref: toggleButtonRef,
          onKeyDown,
        } = result.current.getToggleButtonProps({onKeyDown: userOnKeyDown})

        toggleButtonRef({focus: noop})
        menuRef({focus: noop})
        onKeyDown({
          key: 'ArrowDown',
          preventDefault: noop,
        })
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
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
        const wrapper = setup({})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)
        expect(menu.childNodes).toHaveLength(items.length)

        fireEvent.click(toggleButton)
        expect(menu.childNodes).toHaveLength(0)

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
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', () => {
        const initialHighlightedIndex = 3
        const wrapper = setup({initialHighlightedIndex})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(initialHighlightedIndex),
        )

        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBeNull()
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', () => {
        const defaultHighlightedIndex = 3
        const wrapper = setup({defaultHighlightedIndex})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', () => {
        const highlightedIndex = 3
        const wrapper = setup({highlightedIndex})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(highlightedIndex),
        )

        fireEvent.click(toggleButton)
        fireEvent.click(toggleButton)

        expect(menu.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and sets focus on the menu', () => {
        const wrapper = setup()
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.click(toggleButton)

        expect(document.activeElement).toBe(menu)
      })

      test('closes the open menu and sets focus on the toggle button', () => {
        const wrapper = setup({initialIsOpen: true})
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

        fireEvent.click(toggleButton)

        expect(document.activeElement).toBe(toggleButton)
      })
    })

    describe('on keydown', () => {
      describe('character key', () => {
        jest.useFakeTimers()

        afterEach(() => {
          reactAct(() => jest.runAllTimers())
        })

        const startsWithCharacter = (option, character) => {
          return option.toLowerCase().startsWith(character.toLowerCase())
        }

        test('should select the first item that starts with that key', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {key: 'c'})

          expect(toggleButton.textContent).toEqual(
            items[items.findIndex(option => startsWithCharacter(option, 'c'))],
          )
        })

        test('should select the second item that starts with that key after typing it twice', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const firstIndex = items.findIndex(option =>
            startsWithCharacter(option, 'c'),
          )

          fireEvent.keyDown(toggleButton, {key: 'c'})
          reactAct(() => jest.runAllTimers())
          fireEvent.keyDown(toggleButton, {key: 'c'})

          expect(toggleButton.textContent).toEqual(
            items[
              firstIndex +
                1 +
                items
                  .slice(firstIndex + 1)
                  .findIndex(option => startsWithCharacter(option, 'c'))
            ],
          )
        })

        test('should select the first item again if the items are depleated', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {key: 'b'})
          reactAct(() => jest.runAllTimers())
          fireEvent.keyDown(toggleButton, {key: 'b'})
          reactAct(() => jest.runAllTimers())
          fireEvent.keyDown(toggleButton, {key: 'b'})

          expect(toggleButton.textContent).toEqual(
            items[items.findIndex(option => startsWithCharacter(option, 'b'))],
          )
        })

        test('should not select anything if no item starts with that key', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {key: 'x'})

          expect(toggleButton.textContent).toEqual('Elements')
        })

        test('should select the first item that starts with the keys typed in rapid succession', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {key: 'c'})
          fireEvent.keyDown(toggleButton, {key: 'a'})

          expect(toggleButton.textContent).toEqual(
            items[items.findIndex(option => startsWithCharacter(option, 'ca'))],
          )
        })

        test('should become first character after timeout passes', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {key: 'c'})
          fireEvent.keyDown(toggleButton, {key: 'a'})
          reactAct(() => jest.runAllTimers())
          fireEvent.keyDown(toggleButton, {key: 'l'})

          expect(toggleButton.textContent).toEqual(
            items[items.findIndex(option => startsWithCharacter(option, 'l'))],
          )
        })

        /* Here we just want to make sure the keys cleanup works. */
        test('should not go to the second option starting with the key if timeout did not pass', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {key: 'l'})
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          fireEvent.keyDown(toggleButton, {key: 'l'})
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          fireEvent.keyDown(toggleButton, {key: 'l'})
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          fireEvent.keyDown(toggleButton, {key: 'l'})

          // highlight should stay on the first item starting with 'L'
          expect(toggleButton.textContent).toEqual(
            items[items.findIndex(option => startsWithCharacter(option, 'l'))],
          )
        })
      })

      describe('arrow up', () => {
        test('opens the closed menu with last option highlighted', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowUp'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('opens the closed menu with selected option - 1 highlighted', () => {
          const selectedIndex = 3
          const wrapper = setup({initialSelectedItem: items[selectedIndex]})
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowUp'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(selectedIndex - 1),
          )
        })

        test('opens the closed menu at initialHighlightedIndex, but on first arrow up only', () => {
          const initialHighlightedIndex = 3
          const wrapper = setup({initialHighlightedIndex})
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowUp'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(initialHighlightedIndex),
          )

          fireEvent.keyDown(menu, {key: 'Escape'})
          fireEvent.keyDown(toggleButton, {key: 'ArrowUp'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('arrow up opens the closed menu at defaultHighlightedIndex, on every arrow up', () => {
          const defaultHighlightedIndex = 3
          const wrapper = setup({defaultHighlightedIndex})
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowUp'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(defaultHighlightedIndex),
          )

          fireEvent.keyDown(menu, {key: 'Escape'})
          fireEvent.keyDown(toggleButton, {key: 'ArrowUp'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test.skip('prevents event default', () => {
          const wrapper = setup()
          const preventDefault = jest.fn()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {
            key: 'ArrowUp',
            preventDefault,
          })

          expect(preventDefault).toHaveBeenCalledTimes(1)
        })

        test('opens the closed menu and focuses the list', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowUp'})

          expect(document.activeElement).toBe(menu)
        })
      })

      describe('arrow down', () => {
        test('opens the closed menu with first option highlighted', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowDown'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
        })

        test('opens the closed menu with selected option + 1 highlighted', () => {
          const selectedIndex = 3
          const wrapper = setup({initialSelectedItem: items[selectedIndex]})
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowDown'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(selectedIndex + 1),
          )
        })

        test('opens the closed menu at initialHighlightedIndex, but on first arrow down only', () => {
          const initialHighlightedIndex = 3
          const wrapper = setup({initialHighlightedIndex})
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowDown'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(initialHighlightedIndex),
          )

          fireEvent.keyDown(menu, {key: 'Escape'})
          fireEvent.keyDown(toggleButton, {key: 'ArrowDown'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
        })

        test('opens the closed menu at defaultHighlightedIndex, on every arrow down', () => {
          const defaultHighlightedIndex = 3
          const wrapper = setup({defaultHighlightedIndex})
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowDown'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(defaultHighlightedIndex),
          )

          fireEvent.keyDown(menu, {key: 'Escape'})
          fireEvent.keyDown(toggleButton, {key: 'ArrowDown'})

          expect(menu.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        // also add for menu when this test works.
        test.skip('arrow down prevents event default', () => {
          const wrapper = setup()
          const preventDefault = jest.fn()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)

          fireEvent.keyDown(toggleButton, {
            key: 'ArrowDown',
            preventDefault,
          })

          expect(preventDefault).toHaveBeenCalledTimes(1)
        })

        test('opens the closed menu and focuses the list', () => {
          const wrapper = setup()
          const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(toggleButton, {key: 'ArrowDown'})

          expect(document.activeElement).toBe(menu)
        })
      })

      test("other than te ones supported don't affect anything", () => {
        const wrapper = setup()
        const toggleButton = wrapper.getByTestId(dataTestIds.toggleButton)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.keyDown(toggleButton, {key: 'Alt'})
        fireEvent.keyDown(toggleButton, {key: 'Control'})

        expect(toggleButton.textContent).toEqual('Elements')
        expect(menu.getAttribute('aria-activedescendant')).toBeNull()
        expect(menu.childNodes).toHaveLength(0)
      })
    })
  })
})
