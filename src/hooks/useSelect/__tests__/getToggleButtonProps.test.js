/* eslint-disable jest/no-disabled-tests */
import {act as reactAct} from '@testing-library/react'
import {act as reactHooksAct, renderHook} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {renderUseSelect, renderSelect} from '../testUtils'
import {items, defaultIds} from '../../testUtils'
import useSelect from '..'

jest.useFakeTimers()

describe('getToggleButtonProps', () => {
  describe('hook props', () => {
    test('assign default value to aria-labelledby', () => {
      const {result} = renderUseSelect()
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
      const {result} = renderUseSelect(props)
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-labelledby']).toEqual(
        `${props.labelId} ${props.toggleButtonId}`,
      )
    })

    test('assign default value to id', () => {
      const {result} = renderUseSelect()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.id).toEqual(defaultIds.toggleButtonId)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        toggleButtonId: 'my-custom-toggle-button-id',
      }
      const {result} = renderUseSelect(props)
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.id).toEqual(props.toggleButtonId)
    })

    test("assign 'listbbox' to aria-haspopup", () => {
      const {result} = renderUseSelect()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-haspopup']).toEqual('listbox')
    })

    test("assign 'false' value to aria-expanded when menu is closed", () => {
      const {result} = renderUseSelect({isOpen: false})
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-expanded']).toEqual(false)
    })

    test("assign 'true' value to aria-expanded when menu is open", () => {
      const {result} = renderUseSelect({isOpen: true})
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-expanded']).toEqual(true)
    })

    test('omit event handlers when disabled', () => {
      const {result} = renderUseSelect()
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
      const {result} = renderUseSelect()

      expect(result.current.getToggleButtonProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseSelect()

      reactHooksAct(() => {
        const {onClick} = result.current.getToggleButtonProps({
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = renderUseSelect()

      reactHooksAct(() => {
        const {onKeyDown} = result.current.getToggleButtonProps({
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowDown', preventDefault: noop})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseSelect()

      reactHooksAct(() => {
        const {onClick} = result.current.getToggleButtonProps({
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })

    test("event handler onKeyDown is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnKeyDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseSelect()

      reactHooksAct(() => {
        const {onKeyDown} = result.current.getToggleButtonProps({
          onKeyDown: userOnKeyDown,
        })

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
        const {clickOnToggleButton, getItems} = renderSelect()

        clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)
      })

      test('closes the open menu', () => {
        const {clickOnToggleButton, getItems} = renderSelect({
          initialIsOpen: true,
        })

        clickOnToggleButton()

        expect(getItems()).toHaveLength(0)
      })

      test('opens and closes menu at consecutive clicks', () => {
        const {clickOnToggleButton, getItems} = renderSelect()

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
        const {clickOnToggleButton, menu} = renderSelect()

        clickOnToggleButton()

        expect(menu).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu with selected option highlighted', () => {
        const selectedIndex = 3
        const {clickOnToggleButton, menu} = renderSelect({
          initialSelectedItem: items[selectedIndex],
        })

        clickOnToggleButton()

        expect(menu).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', () => {
        const initialHighlightedIndex = 3
        const {clickOnToggleButton, menu} = renderSelect({
          initialHighlightedIndex,
        })

        clickOnToggleButton()

        expect(menu).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(menu).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', () => {
        const defaultHighlightedIndex = 3
        const {clickOnToggleButton, menu} = renderSelect({
          defaultHighlightedIndex,
        })

        clickOnToggleButton()

        expect(menu).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(menu).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', () => {
        const highlightedIndex = 3
        const {clickOnToggleButton, menu} = renderSelect({
          highlightedIndex,
        })

        clickOnToggleButton()

        expect(menu).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(menu).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and moves focus on the menu', () => {
        const {clickOnToggleButton, menu} = renderSelect()

        clickOnToggleButton()

        expect(menu).toHaveFocus()
      })

      test('closes the open menu and keeps focus on the toggle button', () => {
        const {clickOnToggleButton, toggleButton} = renderSelect({
          initialIsOpen: true,
        })

        clickOnToggleButton()

        expect(toggleButton).toHaveFocus()
      })
    })

    describe('on keydown', () => {
      describe('character key', () => {
        afterEach(() => {
          reactAct(() => jest.runAllTimers())
        })

        const startsWithCharacter = (option, character) => {
          return option.toLowerCase().startsWith(character.toLowerCase())
        }

        test('should select the first item that starts with that key', () => {
          const char = 'c'
          const expectedItem = items.find(item =>
            startsWithCharacter(item, char),
          )
          const {keyDownOnToggleButton, toggleButton} = renderSelect()

          keyDownOnToggleButton(char)

          expect(toggleButton).toHaveTextContent(expectedItem)
        })

        test('should select the second item that starts with that key after typing it twice', () => {
          const char = 'c'
          const expectedItem = items
            .slice(
              items.indexOf(
                items.find(item => startsWithCharacter(item, char)),
              ) + 1,
            )
            .find(item => startsWithCharacter(item, char))
          const {keyDownOnToggleButton, toggleButton} = renderSelect()

          keyDownOnToggleButton(char)
          reactAct(() => jest.runAllTimers())
          keyDownOnToggleButton(char)

          expect(toggleButton).toHaveTextContent(expectedItem)
        })

        test('should select the first item again if the items are depleated', () => {
          const char = 'b'
          const expectedItem = items.find(item =>
            startsWithCharacter(item, char),
          )
          const {keyDownOnToggleButton, toggleButton} = renderSelect()

          keyDownOnToggleButton(char)
          reactAct(() => jest.runAllTimers())
          keyDownOnToggleButton(char)
          reactAct(() => jest.runAllTimers())
          keyDownOnToggleButton(char)

          expect(toggleButton).toHaveTextContent(expectedItem)
        })

        test('should not select anything if no item starts with that key', () => {
          const char = 'x'
          const {keyDownOnToggleButton, toggleButton} = renderSelect()

          keyDownOnToggleButton(char)

          expect(toggleButton).toHaveTextContent('Elements')
        })

        test('should select the first item that starts with the keys typed in rapid succession', () => {
          const chars = ['c', 'a']
          const expectedItem = items.find(item =>
            startsWithCharacter(item, chars.join('')),
          )
          const {keyDownOnToggleButton, toggleButton} = renderSelect()

          keyDownOnToggleButton(chars[0])
          reactAct(() => jest.advanceTimersByTime(200))
          keyDownOnToggleButton(chars[1])

          expect(toggleButton).toHaveTextContent(expectedItem)
        })

        test('should become first character after timeout passes', () => {
          const chars = ['c', 'a', 'l']
          const expectedItem = items.find(item =>
            startsWithCharacter(item, chars[2]),
          )
          const {keyDownOnToggleButton, toggleButton} = renderSelect()

          keyDownOnToggleButton(chars[0])
          reactAct(() => jest.advanceTimersByTime(200))
          keyDownOnToggleButton(chars[1])
          reactAct(() => jest.runAllTimers())
          keyDownOnToggleButton(chars[2])

          expect(toggleButton).toHaveTextContent(expectedItem)
        })

        /* Here we just want to make sure the keys cleanup works. */
        test('should not go to the second option starting with the key if timeout did not pass', () => {
          const char = 'l'
          const expectedItem = items.find(item =>
            startsWithCharacter(item, char),
          )
          const {keyDownOnToggleButton, toggleButton} = renderSelect()

          keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.

          expect(toggleButton).toHaveTextContent(expectedItem)
        })
      })

      describe('arrow up', () => {
        test('it does not open or highlight anything if there are no options', () => {
          const {keyDownOnToggleButton, menu, getItems} = renderSelect({
            items: [],
          })

          keyDownOnToggleButton('ArrowUp')

          expect(menu).not.toHaveAttribute('aria-activedescendant')
          expect(getItems()).toHaveLength(0)
        })

        test('opens the closed menu with last option highlighted', () => {
          const {keyDownOnToggleButton, menu} = renderSelect()

          keyDownOnToggleButton('ArrowUp')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('opens the closed menu with selected option - 1 highlighted', () => {
          const selectedIndex = 4
          const {keyDownOnToggleButton, menu} = renderSelect({
            initialSelectedItem: items[selectedIndex],
          })

          keyDownOnToggleButton('ArrowUp')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(selectedIndex - 1),
          )
        })

        test('opens the closed menu at initialHighlightedIndex, but on first arrow up only', () => {
          const initialHighlightedIndex = 2
          const {keyDownOnToggleButton, keyDownOnMenu, menu} = renderSelect({
            initialHighlightedIndex,
          })

          keyDownOnToggleButton('ArrowUp')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex),
          )

          keyDownOnMenu('Escape')
          keyDownOnToggleButton('ArrowUp')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('arrow up opens the closed menu at defaultHighlightedIndex, on every arrow up', () => {
          const defaultHighlightedIndex = 3
          const {keyDownOnToggleButton, menu} = renderSelect({
            defaultHighlightedIndex,
          })

          keyDownOnToggleButton('ArrowUp')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )

          keyDownOnToggleButton('Escape')
          keyDownOnToggleButton('ArrowUp')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test.skip('prevents event default', () => {
          const preventDefault = jest.fn()
          const {keyDownOnToggleButton} = renderSelect()

          keyDownOnToggleButton('ArrowUp', {preventDefault})

          expect(preventDefault).toHaveBeenCalledTimes(1)
        })

        test('opens the closed menu and moves focus on the menu', () => {
          const {keyDownOnToggleButton, menu} = renderSelect()

          keyDownOnToggleButton('ArrowUp')

          expect(menu).toHaveFocus()
        })
      })

      describe('arrow down', () => {
        test('it does not open or highlight anything if there are no options', () => {
          const {keyDownOnToggleButton, menu, getItems} = renderSelect({
            items: [],
          })

          keyDownOnToggleButton('ArrowDown')

          expect(menu).not.toHaveAttribute('aria-activedescendant')
          expect(getItems()).toHaveLength(0)
        })

        test('opens the closed menu with first option highlighted', () => {
          const {keyDownOnToggleButton, menu} = renderSelect()

          keyDownOnToggleButton('ArrowDown')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('opens the closed menu with selected option + 1 highlighted', () => {
          const selectedIndex = 4
          const {keyDownOnToggleButton, menu} = renderSelect({
            initialSelectedItem: items[selectedIndex],
          })

          keyDownOnToggleButton('ArrowDown')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(selectedIndex + 1),
          )
        })

        test('opens the closed menu at initialHighlightedIndex, but on first arrow down only', () => {
          const initialHighlightedIndex = 3
          const {keyDownOnToggleButton, keyDownOnMenu, menu} = renderSelect({
            initialHighlightedIndex,
          })

          keyDownOnToggleButton('ArrowDown')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex),
          )

          keyDownOnMenu('Escape')
          keyDownOnToggleButton('ArrowDown')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('opens the closed menu at defaultHighlightedIndex, on every arrow down', () => {
          const defaultHighlightedIndex = 3
          const {keyDownOnToggleButton, keyDownOnMenu, menu} = renderSelect({
            defaultHighlightedIndex,
          })

          keyDownOnToggleButton('ArrowDown')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )

          keyDownOnMenu('Escape')
          keyDownOnToggleButton('ArrowDown')

          expect(menu).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        // also add for menu when this test works.
        test.skip('arrow down prevents event default', () => {
          const preventDefault = jest.fn()
          const {keyDownOnToggleButton} = renderSelect()

          keyDownOnToggleButton('ArrowDown', {preventDefault})

          expect(preventDefault).toHaveBeenCalledTimes(1)
        })

        test('opens the closed menu and focuses the list', () => {
          const {keyDownOnToggleButton, menu} = renderSelect()

          keyDownOnToggleButton('ArrowDown')

          expect(menu).toHaveFocus()
        })
      })

      test("other than te ones supported don't affect anything", () => {
        const {keyDownOnToggleButton, toggleButton, getItems} = renderSelect()

        keyDownOnToggleButton('Alt')
        keyDownOnToggleButton('Control')

        expect(toggleButton).toHaveTextContent('Elements')
        expect(toggleButton).not.toHaveAttribute('aria-activedescendant')
        expect(getItems()).toHaveLength(0)
      })
    })
  })

  describe('non production errors', () => {
    test('will be displayed if getMenuProps is not called', () => {
      renderHook(() => {
        const {getMenuProps} = useSelect({items})
        getMenuProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `"downshift: You forgot to call the getToggleButtonProps getter function on your component / element."`,
      )
    })

    test('will be displayed if element ref is not set and suppressRefError is false', () => {
      renderHook(() => {
        const {getMenuProps, getToggleButtonProps} = useSelect({
          items,
        })

        getMenuProps({}, {suppressRefError: true})
        getToggleButtonProps()
      })

      // eslint-disable-next-line no-console
      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `"downshift: The ref prop \\"ref\\" from getToggleButtonProps was not applied correctly on your menu element."`,
      )
    })

    test('will not be displayed if getMenuProps is not called but environment is production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      renderHook(() => {
        const {getMenuProps} = useSelect({
          items,
        })

        getMenuProps({}, {suppressRefError: true})
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
      process.env.NODE_ENV = originalEnv
    })

    test('will not be displayed if element ref is not set but environment is production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      renderHook(() => {
        const {getMenuProps, getToggleButtonProps} = useSelect({
          items,
        })

        getMenuProps({}, {suppressRefError: true})
        getToggleButtonProps()
      })

      // eslint-disable-next-line no-console
      expect(console.error).not.toHaveBeenCalled()
      process.env.NODE_ENV = originalEnv
    })
  })
})
