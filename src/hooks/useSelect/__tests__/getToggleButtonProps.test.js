import * as React from 'react'
import {
  act as reactAct,
  createEvent,
  fireEvent,
  screen,
} from '@testing-library/react'
import {act as reactHooksAct, renderHook} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {
  renderUseSelect,
  renderSelect,
  getItemIndexByCharacter,
  clickOnToggleButton,
  getItems,
  getToggleButton,
  keyDownOnToggleButton,
  tab,
} from '../testUtils'
import utils from '../../utils'
import {items, defaultIds} from '../../testUtils'
import useSelect from '..'
import * as stateChangeTypes from '../stateChangeTypes'

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

    test('assigns the role of combobox, tabindex 0, aria-haspopup listbox and aria-controls pointing to the menu', () => {
      const {result} = renderUseSelect()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps.role).toEqual('combobox')
      expect(toggleButtonProps.tabIndex).toEqual(0)
      expect(toggleButtonProps['aria-controls']).toEqual(defaultIds.menuId)
      expect(toggleButtonProps['aria-haspopup']).toEqual('listbox')
    })

    test('assign id of highlighted item to aria-activedescendant if item is highlighted and menu is open', () => {
      const {result} = renderUseSelect({highlightedIndex: 2, isOpen: true})
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-activedescendant']).toEqual(
        defaultIds.getItemId(2),
      )
    })

    test('do not assign aria-activedescendant if item is highlighted and menu is closed', () => {
      const {result} = renderUseSelect({highlightedIndex: 2})
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-activedescendant']).toEqual('')
    })

    test('do not assign aria-activedescendant if no item is highlighted', () => {
      const {result} = renderUseSelect()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-activedescendant']).toEqual('')
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

    test('event handler onBlur is called along with downshift handler', () => {
      const userOnBlur = jest.fn()
      const {result} = renderUseSelect({initialIsOpen: true})

      reactHooksAct(() => {
        const {onBlur} = result.current.getToggleButtonProps({
          onBlur: userOnBlur,
        })

        onBlur({})
      })

      expect(userOnBlur).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })

    test("event handler onBlur is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnBlur = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseSelect({initialIsOpen: true})

      reactHooksAct(() => {
        const {onBlur} = result.current.getToggleButtonProps({
          onBlur: userOnBlur,
        })

        onBlur({})
      })

      expect(userOnBlur).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })
  })

  describe('event handlers', () => {
    describe('on click', () => {
      test('opens the closed menu', async () => {
        renderSelect()

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(items.length)
      })

      test('closes the open menu', async () => {
        renderSelect({
          initialIsOpen: true,
        })

        await clickOnToggleButton()

        expect(getItems()).toHaveLength(0)
      })

      test('opens and closes menu at consecutive clicks', async () => {
        renderSelect()

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
        renderSelect()

        await clickOnToggleButton()

        expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
      })

      test('opens the closed menu with selected option highlighted', async () => {
        const selectedIndex = 3
        renderSelect({
          initialSelectedItem: items[selectedIndex],
        })
        getToggleButton()

        await clickOnToggleButton()

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', async () => {
        const initialHighlightedIndex = 3
        renderSelect({
          initialHighlightedIndex,
        })
        const toggleButton = getToggleButton()

        await clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        await clickOnToggleButton()
        await clickOnToggleButton()

        expect(toggleButton).toHaveAttribute('aria-activedescendant', '')
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', async () => {
        const defaultHighlightedIndex = 3
        renderSelect({
          defaultHighlightedIndex,
        })
        const toggleButton = getToggleButton()

        await clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        await clickOnToggleButton()
        await clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', async () => {
        const highlightedIndex = 3
        renderSelect({
          highlightedIndex,
        })
        const toggleButton = getToggleButton()

        await clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        await clickOnToggleButton()
        await clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and keepns focus on the button', async () => {
        renderSelect()
        getToggleButton()

        await clickOnToggleButton()

        expect(getToggleButton()).toHaveFocus()
      })

      test('closes the open menu and keeps focus on the toggle button', async () => {
        renderSelect({
          initialIsOpen: true,
        })

        await clickOnToggleButton()

        expect(getToggleButton()).toHaveFocus()
      })
    })

    describe('on keydown', () => {
      describe('character key', () => {
        beforeEach(jest.useFakeTimers)
        afterEach(() => {
          reactAct(() => jest.runAllTimers())
        })
        afterAll(jest.useRealTimers)

        test('should highlight the first item that starts with that key', async () => {
          const char = 'c'
          const expectedItemId = defaultIds.getItemId(
            getItemIndexByCharacter(char),
          )
          renderSelect()

          await keyDownOnToggleButton(char)

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            expectedItemId,
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('should highlight the second item that starts with that key after typing it twice', async () => {
          const char = 'c'
          const expectedItemId = defaultIds.getItemId(
            getItemIndexByCharacter(char, getItemIndexByCharacter(char) + 1),
          )

          renderSelect()

          await keyDownOnToggleButton(char)
          reactAct(jest.runOnlyPendingTimers)
          await keyDownOnToggleButton(char)

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            expectedItemId,
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('should highlight the first item again if the items are depleated', async () => {
          const char = 'b'
          const expectedItemId = defaultIds.getItemId(
            getItemIndexByCharacter(char),
          )
          renderSelect()

          await keyDownOnToggleButton(char)
          reactAct(jest.runOnlyPendingTimers)
          await keyDownOnToggleButton(char)
          reactAct(jest.runOnlyPendingTimers)
          await keyDownOnToggleButton(char)

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            expectedItemId,
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('should not highlight anything if no item starts with that key', async () => {
          const char = 'x'
          renderSelect()

          await keyDownOnToggleButton(char)

          expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(items.length)
        })

        test('should highlight the first item that starts with the keys typed in rapid succession', async () => {
          const chars = ['c', 'a']
          const expectedItemId = defaultIds.getItemId(
            getItemIndexByCharacter(chars.join('')),
          )
          renderSelect()

          await keyDownOnToggleButton(chars[0])
          reactAct(() => jest.advanceTimersByTime(200))
          await keyDownOnToggleButton(chars[1])

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            expectedItemId,
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('should become first character after timeout passes', async () => {
          const chars = ['c', 'a', 'l']
          const expectedItemId = defaultIds.getItemId(
            getItemIndexByCharacter(chars[2]),
          )
          renderSelect()

          await keyDownOnToggleButton(chars[0])
          reactAct(() => jest.advanceTimersByTime(200))
          await keyDownOnToggleButton(chars[1])
          reactAct(() => jest.runAllTimers())
          await keyDownOnToggleButton(chars[2])

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            expectedItemId,
          )
          expect(getItems()).toHaveLength(items.length)
        })

        /* Here we just want to make sure the keys cleanup works. */
        test('should not go to the second option starting with the key if timeout did not pass', async () => {
          const char = 'l'
          const expectedItemId = defaultIds.getItemId(
            getItemIndexByCharacter(char),
          )
          renderSelect()

          await keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          await keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          await keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
          await keyDownOnToggleButton(char)
          reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            expectedItemId,
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('should not attempt update after unmount', async () => {
          const consoleErrorSpy = jest.spyOn(console, 'error')
          const char = 'c'
          const {unmount} = renderSelect({
            isOpen: true,
          })

          // Enter key twice to queue up debounced call
          await keyDownOnToggleButton(char)
          await keyDownOnToggleButton(char)
          unmount()
          jest.runAllTimers()

          expect(consoleErrorSpy).not.toHaveBeenCalled()
        })
      })

      describe('arrow up', () => {
        test('it prevents the default event behavior', () => {
          renderSelect()
          const toggleButton = getToggleButton()
          const keyDownEvent = createEvent.keyDown(toggleButton, {
            key: 'ArrowUp',
          })

          fireEvent(toggleButton, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
        })

        test('it does not open or highlight anything if there are no options', async () => {
          renderSelect({
            items: [],
          })

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test('it does not highlight anything if there are no options', async () => {
          renderSelect({
            items: [],
            isOpen: true,
          })

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test('it opens the closed menu with last option highlighted', async () => {
          renderSelect()

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('it opens the closed menu with selected option highlighted', async () => {
          const selectedIndex = 4
          renderSelect({
            initialSelectedItem: items[selectedIndex],
          })

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(selectedIndex),
          )
        })

        test('it opens the closed menu at initialHighlightedIndex, but on first arrow up only', async () => {
          const initialHighlightedIndex = 2
          renderSelect({
            initialHighlightedIndex,
          })

          const toggleButton = getToggleButton()

          await keyDownOnToggleButton('{ArrowUp}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex),
          )

          await keyDownOnToggleButton('{Escape}')
          await keyDownOnToggleButton('{ArrowUp}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('it opens the closed menu at defaultHighlightedIndex, on every arrow up', async () => {
          const defaultHighlightedIndex = 3
          renderSelect({
            defaultHighlightedIndex,
          })
          const toggleButton = getToggleButton()

          await keyDownOnToggleButton('{ArrowUp}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )

          await keyDownOnToggleButton('{Escape}')
          await keyDownOnToggleButton('{ArrowUp}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test('it opens the closed menu and keeps focus on the combobox', async () => {
          renderSelect()

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveFocus()
        })

        test('highlights last option number if none is highlighted', async () => {
          renderSelect({
            isOpen: true,
          })

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('highlights the previous item', async () => {
          const initialHighlightedIndex = 2
          renderSelect({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex - 1),
          )
        })

        test('will stop at first item', async () => {
          renderSelect({
            isOpen: true,
            initialHighlightedIndex: 0,
          })

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('with Alt it selects the item and closes the menu', async () => {
          const initialHighlightedIndex = 2
          renderSelect({
            initialIsOpen: true,
            initialHighlightedIndex,
          })
          const toggleButton = getToggleButton()

          await keyDownOnToggleButton('{Alt>}{ArrowUp}{/Alt}')

          expect(getItems()).toHaveLength(0)
          expect(toggleButton).toHaveTextContent(items[initialHighlightedIndex])
        })

        test('with Alt it opens the menu without any additional change', async () => {
          renderSelect()

          await keyDownOnToggleButton('{Alt>}{ArrowUp}{/Alt}')

          expect(getItems()).toHaveLength(items.length)
          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })
      })

      describe('arrow down', () => {
        test('it prevents the default event behavior', () => {
          renderSelect()
          const toggleButton = getToggleButton()
          const keyDownEvent = createEvent.keyDown(toggleButton, {
            key: 'ArrowDown',
          })

          fireEvent(toggleButton, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
        })

        test('it does not open or highlight anything if there are no options', async () => {
          renderSelect({
            items: [],
          })

          await keyDownOnToggleButton('{ArrowDown}')

          expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test('it does not highlight anything if there are no options', async () => {
          renderSelect({
            items: [],
            isOpen: true,
          })

          await keyDownOnToggleButton('{ArrowUp}')

          expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test('opens the closed menu with first option highlighted', async () => {
          renderSelect()

          await keyDownOnToggleButton('{ArrowDown}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('opens the closed menu with selected option highlighted', async () => {
          const selectedIndex = 4
          renderSelect({
            initialSelectedItem: items[selectedIndex],
          })

          await keyDownOnToggleButton('{ArrowDown}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(selectedIndex),
          )
        })

        test('opens the closed menu at initialHighlightedIndex, but on first arrow down only', async () => {
          const initialHighlightedIndex = 3
          renderSelect({
            initialHighlightedIndex,
          })
          const toggleButton = getToggleButton()

          await keyDownOnToggleButton('{ArrowDown}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex),
          )

          await keyDownOnToggleButton('{Escape}')
          await keyDownOnToggleButton('{ArrowDown}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('opens the closed menu at defaultHighlightedIndex, on every arrow down', async () => {
          const defaultHighlightedIndex = 3
          renderSelect({
            defaultHighlightedIndex,
          })
          const toggleButton = getToggleButton()

          await keyDownOnToggleButton('{ArrowDown}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )

          await keyDownOnToggleButton('{Escape}')
          await keyDownOnToggleButton('{ArrowDown}')

          expect(toggleButton).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test('opens the closed menu and keeps focus on the button', async () => {
          renderSelect()

          await keyDownOnToggleButton('{ArrowDown}')

          expect(getToggleButton()).toHaveFocus()
        })

        test("it highlights option number '0' if none is highlighted", async () => {
          renderSelect({
            isOpen: true,
          })

          await keyDownOnToggleButton('{ArrowDown}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('it highlights the next item', async () => {
          const initialHighlightedIndex = 2
          renderSelect({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnToggleButton('{ArrowDown}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex + 1),
          )
        })

        test('with Alt it opens the menu and highlights no item', async () => {
          renderSelect()

          await keyDownOnToggleButton('{Alt>}{ArrowDown}{/Alt}')

          expect(getToggleButton()).toHaveAttribute('aria-activedescendant', '')
        })

        test('with Alt it opens the menu and highlights with selected item highlighted', async () => {
          const itemIndex = 8
          renderSelect({selectedItem: items[itemIndex]})

          await keyDownOnToggleButton('{Alt>}{ArrowDown}{/Alt}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(itemIndex),
          )
        })

        test('with Alt it highlights the next item without any additional change', async () => {
          const initialHighlightedIndex = 2
          renderSelect({initialHighlightedIndex, isOpen: true})

          await keyDownOnToggleButton('{Alt>}{ArrowDown}{/Alt}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex + 1),
          )
        })

        test('will stop at last item', async () => {
          renderSelect({
            isOpen: true,
            initialHighlightedIndex: items.length - 1,
          })

          await keyDownOnToggleButton('{ArrowDown}')

          expect(getToggleButton()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })
      })

      test('end opens the menu and highlights the last option', async () => {
        renderSelect()

        await keyDownOnToggleButton('{End}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(items.length - 1),
        )
      })

      test('end highlights the last option', async () => {
        renderSelect({
          isOpen: true,
          initialHighlightedIndex: 2,
        })

        await keyDownOnToggleButton('{End}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(items.length - 1),
        )
      })

      test('end prevents the default event behavior', () => {
        renderSelect()
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: 'End'})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('home opens the menu and highlights the first option', async () => {
        renderSelect()

        await keyDownOnToggleButton('{Home}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(0),
        )
      })

      test('home highlights the first option', async () => {
        renderSelect({
          isOpen: true,
          initialHighlightedIndex: 2,
        })

        await keyDownOnToggleButton('{Home}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(0),
        )
      })

      test('home prevents the default event behavior', () => {
        renderSelect()
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: 'Home'})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('escape has the menu closed and keeps focus on the button', async () => {
        renderSelect({
          initialIsOpen: true,
        })

        await keyDownOnToggleButton('{Escape}')

        expect(getItems()).toHaveLength(0)
        expect(getToggleButton()).toHaveFocus()
      })

      test('escape does nothing if menu is already closed', async () => {
        renderSelect()

        await keyDownOnToggleButton('{Escape}')

        expect(getItems()).toHaveLength(0)
        expect(getToggleButton()).toHaveFocus()
      })

      test('enter opens the menu without any item selected', async () => {
        renderSelect()
        const toggleButton = getToggleButton()

        await keyDownOnToggleButton('{Enter}')

        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute('aria-activedescendant', '')
        expect(toggleButton).toHaveFocus()
      })

      test('enter closes the menu and selects highlighted item', async () => {
        const initialHighlightedIndex = 2
        renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex,
        })
        const toggleButton = getToggleButton()

        await keyDownOnToggleButton('{Enter}')

        expect(getItems()).toHaveLength(0)
        expect(toggleButton).toHaveTextContent(items[initialHighlightedIndex])
        expect(toggleButton).toHaveFocus()
      })

      test('enter selects the highlighted item and resets to user defaults', async () => {
        const defaultHighlightedIndex = 2
        renderSelect({
          defaultHighlightedIndex,
          defaultIsOpen: true,
        })
        const toggleButton = getToggleButton()

        await keyDownOnToggleButton('{Enter}')

        expect(toggleButton).toHaveTextContent(items[defaultHighlightedIndex])
        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('enter prevents the default event behavior with the menu open', () => {
        renderSelect({isOpen: true})
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: 'Enter'})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('enter prevents the default event behavior with the menu closed', () => {
        renderSelect()
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: 'Enter'})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('space opens the menu without any item selected', async () => {
        renderSelect()
        const toggleButton = getToggleButton()

        await keyDownOnToggleButton(' ')

        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute('aria-activedescendant', '')
        expect(toggleButton).toHaveFocus()
      })

      test('space closes the menu and selects highlighted item', async () => {
        const initialHighlightedIndex = 2
        renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex,
        })
        const toggleButton = getToggleButton()

        await keyDownOnToggleButton(' ')

        expect(getItems()).toHaveLength(0)
        expect(toggleButton).toHaveTextContent(items[initialHighlightedIndex])
        expect(toggleButton).toHaveFocus()
      })

      test('space selects the highlighted item and resets to user defaults', async () => {
        const defaultHighlightedIndex = 2
        renderSelect({
          defaultHighlightedIndex,
          defaultIsOpen: true,
        })
        const toggleButton = getToggleButton()

        await keyDownOnToggleButton(' ')

        expect(toggleButton).toHaveTextContent(items[defaultHighlightedIndex])
        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('space prevents the default event behavior when select is open', () => {
        renderSelect({isOpen: true})
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: ' '})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('space prevents the default event behavior when select is closed', () => {
        renderSelect()
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: ' '})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('tab closes the menu and selects highlighted item', async () => {
        const initialHighlightedIndex = 2
        const firstFocusableItemTestId = 'test-id-1'
        const secondFocusableItemTestId = 'test-id-2'
        renderSelect({initialIsOpen: true, initialHighlightedIndex}, ui => {
          return (
            <>
              <div tabIndex={0} data-testid={firstFocusableItemTestId}>
                First element
              </div>
              {ui}
              <div tabIndex={0} data-testid={secondFocusableItemTestId}>
                Second element
              </div>
            </>
          )
        })

        // focus the toggle button in 2 tabs
        await tab()
        await tab()

        // now blur
        await tab()

        expect(getItems()).toHaveLength(0)
        expect(getToggleButton()).toHaveTextContent(
          items[initialHighlightedIndex],
        )
        expect(screen.getByTestId(secondFocusableItemTestId)).toHaveFocus()
      })

      test('shift+tab closes the menu and selects highlighted item', async () => {
        const initialHighlightedIndex = 1
        const firstFocusableItemTestId = 'test-id-1'
        const secondFocusableItemTestId = 'test-id-2'
        renderSelect({initialIsOpen: true, initialHighlightedIndex}, ui => {
          return (
            <>
              <div tabIndex={0} data-testid={firstFocusableItemTestId}>
                First element
              </div>
              {ui}
              <div tabIndex={0} data-testid={secondFocusableItemTestId}>
                Second element
              </div>
            </>
          )
        })

        // focus the toggle button in 2 tabs
        await tab()
        await tab()

        // now blur
        await tab(true)

        expect(getItems()).toHaveLength(0)
        expect(getToggleButton()).toHaveTextContent(
          items[initialHighlightedIndex],
        )
        expect(screen.getByTestId(firstFocusableItemTestId)).toHaveFocus()
      })

      test("other than te ones supported don't affect anything", async () => {
        renderSelect()
        const toggleButton = getToggleButton()

        await keyDownOnToggleButton('{Alt}')
        await keyDownOnToggleButton('{Control}')

        expect(toggleButton).toHaveTextContent('Elements')
        expect(toggleButton).toHaveAttribute('aria-activedescendant', '')
        expect(getItems()).toHaveLength(0)
      })

      test('pageUp jumps highlight up by 10 options', async () => {
        const initialHighlightedIndex = 12
        renderSelect({
          isOpen: true,
          initialHighlightedIndex,
        })

        await keyDownOnToggleButton('{PageUp}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex - 10),
        )
      })

      test('pageUp jumps highlight the first option if highlightedIndex is 10 or smaller', async () => {
        const initialHighlightedIndex = 7
        renderSelect({
          isOpen: true,
          initialHighlightedIndex,
        })

        await keyDownOnToggleButton('{PageUp}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(0),
        )
      })

      test('pageUp prevents the default event behavior with the menu open', () => {
        renderSelect({isOpen: true})
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: 'PageUp'})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('pageUp does not prevent the default event behavior with the menu closed', () => {
        renderSelect()
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {key: 'PageUp'})

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(false)
      })

      test('pageDown jumps highlight down by 10 options', async () => {
        const initialHighlightedIndex = 12
        renderSelect({
          isOpen: true,
          initialHighlightedIndex,
        })

        await keyDownOnToggleButton('{PageDown}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex + 10),
        )
      })

      test('pageDown jumps highlight the last option if highlightedIndex is closer than 10 indeces to the end', async () => {
        const initialHighlightedIndex = items.length - 5
        renderSelect({
          isOpen: true,
          initialHighlightedIndex,
        })

        await keyDownOnToggleButton('{PageDown}')

        expect(getToggleButton()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(items.length - 1),
        )
      })

      test('pageDown prevents the default event behavior with the menu open', () => {
        renderSelect({isOpen: true})
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {
          key: 'PageDown',
        })

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(true)
      })

      test('pageDown does not prevent the default event behavior with the menu closed', () => {
        renderSelect()
        const toggleButton = getToggleButton()
        const keyDownEvent = createEvent.keyDown(toggleButton, {
          key: 'PageDown',
        })

        fireEvent(toggleButton, keyDownEvent)

        expect(keyDownEvent.defaultPrevented).toBe(false)
      })
    })

    describe('blur', () => {
      test('by focusing another element should behave as a normal blur', async () => {
        const initialHighlightedIndex = 2
        renderSelect({initialIsOpen: true, initialHighlightedIndex}, ui => {
          return (
            <>
              {ui}
              <div tabIndex={0}>Second element</div>
            </>
          )
        })

        await tab() // focus the button
        screen.getByText(/Second element/).focus()

        expect(getItems()).toHaveLength(0)
        expect(getToggleButton()).toHaveTextContent(
          items[initialHighlightedIndex],
        )
      })

      test('by mouse is not triggered if target is within downshift', async () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        const {container} = renderSelect({
          isOpen: true,
          stateReducer,
        })
        const toggleButton = getToggleButton()
        document.body.appendChild(container)

        fireEvent.mouseDown(toggleButton)
        fireEvent.mouseUp(toggleButton)

        expect(stateReducer).not.toHaveBeenCalled()

        fireEvent.mouseDown(document.body)
        fireEvent.mouseUp(document.body)

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          expect.objectContaining({}),
          expect.objectContaining({type: stateChangeTypes.ToggleButtonBlur}),
        )
      })

      test('by touch is not triggered if target is within downshift', () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        const {container} = renderSelect({
          isOpen: true,
          stateReducer,
        })
        const toggleButton = getToggleButton()
        document.body.appendChild(container)

        fireEvent.touchStart(toggleButton)
        fireEvent.touchMove(toggleButton)
        fireEvent.touchEnd(toggleButton)

        expect(stateReducer).not.toHaveBeenCalled()

        fireEvent.touchStart(document.body)
        fireEvent.touchEnd(document.body)

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          expect.objectContaining({}),
          expect.objectContaining({type: stateChangeTypes.ToggleButtonBlur}),
        )
      })
    })
  })

  describe('non production errors', () => {
    beforeEach(() => {
      const {useGetterPropsCalledChecker} = jest.requireActual('../../utils')
      jest
        .spyOn(utils, 'useGetterPropsCalledChecker')
        .mockImplementation(useGetterPropsCalledChecker)
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    test('will be displayed if getToggleButtonProps is not called', () => {
      renderHook(() => {
        const {getMenuProps} = useSelect({items})
        getMenuProps({}, {suppressRefError: true})
      })

      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: You forgot to call the getToggleButtonProps getter function on your component / element.`,
      )
    })

    test('will not be displayed if getToggleButtonProps is not called on subsequent renders', () => {
      let firstRender = true
      const {rerender} = renderHook(() => {
        const {getMenuProps, getToggleButtonProps} = useSelect({items})
        getMenuProps({}, {suppressRefError: true})

        // eslint-disable-next-line jest/no-if
        if (firstRender) {
          firstRender = false
          getToggleButtonProps({}, {suppressRefError: true})
        }
      })

      rerender()

      expect(console.error).not.toHaveBeenCalled()
    })

    test('will be displayed if element ref is not set and suppressRefError is false', () => {
      renderHook(() => {
        const {getMenuProps, getToggleButtonProps} = useSelect({
          items,
        })

        getMenuProps({}, {suppressRefError: true})
        getToggleButtonProps()
      })

      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: The ref prop "ref" from getToggleButtonProps was not applied correctly on your element.`,
      )
    })

    test('will not be displayed if called with a correct ref', () => {
      const refFn = jest.fn()
      const toggleButtonNode = {}

      renderHook(() => {
        const {getToggleButtonProps, getMenuProps} = useSelect({
          items,
        })

        getMenuProps({}, {suppressRefError: true})

        const {ref} = getToggleButtonProps({
          ref: refFn,
        })
        ref(toggleButtonNode)
      })

      expect(console.error).not.toHaveBeenCalled()
    })
  })
})
