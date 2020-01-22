/* eslint-disable jest/no-disabled-tests */
import React from 'react'
import userEvent from '@testing-library/user-event'
import {cleanup, act as reactAct, render} from '@testing-library/react'
import {act as reactHooksAct} from '@testing-library/react-hooks'
import {noop} from '../../../utils'
import {
  items,
  renderUseSelect,
  defaultIds,
  renderSelect,
  DropdownSelect,
} from '../testUtils'

jest.useFakeTimers()

describe('getToggleButtonProps', () => {
  afterEach(cleanup)

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

    test('assign id of highlighted item to aria-activedescendant if item is highlighted', () => {
      const highlightedIndex = 2
      const {result} = renderUseSelect({isOpen: true, highlightedIndex})
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-activedescendant']).toEqual(
        defaultIds.getItemId(highlightedIndex),
      )
    })

    test('do not assign aria-activedescendant if no item is highlighted', () => {
      const {result} = renderUseSelect()
      const toggleButtonProps = result.current.getToggleButtonProps()

      expect(toggleButtonProps['aria-activedescendant']).toBeUndefined()
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
        const {clickOnToggleButton, toggleButton} = renderSelect()

        clickOnToggleButton()

        expect(toggleButton).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu with selected option highlighted', () => {
        const selectedIndex = 3
        const {clickOnToggleButton, toggleButton} = renderSelect({
          initialSelectedItem: items[selectedIndex],
        })

        clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('opens the closed menu at initialHighlightedIndex, but on first click only', () => {
        const initialHighlightedIndex = 3
        const {clickOnToggleButton, toggleButton} = renderSelect({
          initialHighlightedIndex,
        })

        clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(toggleButton).not.toHaveAttribute('aria-activedescendant')
      })

      test('opens the closed menu at defaultHighlightedIndex, on every click', () => {
        const defaultHighlightedIndex = 3
        const {clickOnToggleButton, toggleButton} = renderSelect({
          defaultHighlightedIndex,
        })

        clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('opens the closed menu at highlightedIndex from props, on every click', () => {
        const highlightedIndex = 3
        const {clickOnToggleButton, toggleButton} = renderSelect({
          highlightedIndex,
        })

        clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )

        clickOnToggleButton()
        clickOnToggleButton()

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
      })

      test('opens the closed menu and keeps focus on the toggle button', () => {
        const {clickOnToggleButton, toggleButton} = renderSelect()

        clickOnToggleButton()

        expect(document.activeElement).toBe(toggleButton)
      })

      test('closes the open menu and keeps focus on the toggle button', () => {
        const {clickOnToggleButton, toggleButton} = renderSelect({
          initialIsOpen: true,
        })

        clickOnToggleButton()

        expect(document.activeElement).toBe(toggleButton)
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

        describe('with menu closed', () => {
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
            reactAct(() => jest.runTimersToTime(200))
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
            reactAct(() => jest.runTimersToTime(200))
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

        describe('with menu open', () => {
          test('should highlight the first item that starts with that key', () => {
            const char = 'c'
            const expectedIndex = defaultIds.getItemId(
              items.indexOf(
                items.find(item => startsWithCharacter(item, char)),
              ),
            )

            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton(char)

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              expectedIndex,
            )
          })

          test('should highlight the second item that starts with that key after typing it twice', () => {
            const char = 'c'
            const expectedIndex = defaultIds.getItemId(
              items.indexOf(
                items
                  .slice(
                    items.indexOf(
                      items.find(item => startsWithCharacter(item, char)),
                    ) + 1,
                  )
                  .find(item => startsWithCharacter(item, char)),
              ),
            )
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton(char)
            reactAct(() => {
              jest.runOnlyPendingTimers()
            })
            keyDownOnToggleButton(char)

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              expectedIndex,
            )
          })

          test('should highlight the first item again if the items are depleated', () => {
            const char = 'b'
            const expectedIndex = defaultIds.getItemId(
              items.indexOf(
                items.find(item => startsWithCharacter(item, char)),
              ),
            )
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton(char)
            reactAct(() => {
              jest.runOnlyPendingTimers()
            })
            keyDownOnToggleButton(char)
            reactAct(() => {
              jest.runOnlyPendingTimers()
            })
            keyDownOnToggleButton(char)

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              expectedIndex,
            )
          })

          test('should not highlight anything if no item starts with that key', () => {
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton('x')

            expect(toggleButton).not.toHaveAttribute('aria-activedescendant')
          })

          test('should highlight the first item that starts with the keys typed in rapid succession', () => {
            const chars = ['c', 'a']
            const expectedIndex = defaultIds.getItemId(
              items.indexOf(
                items.find(item => startsWithCharacter(item, chars.join(''))),
              ),
            )

            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton(chars[0])
            reactAct(() => jest.advanceTimersByTime(200))
            keyDownOnToggleButton(chars[1])

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              expectedIndex,
            )
          })

          test('should become first character after timeout passes', () => {
            const chars = ['c', 'a', 'l']
            const expectedIndex = defaultIds.getItemId(
              items.indexOf(
                items.find(item => startsWithCharacter(item, chars[2])),
              ),
            )
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton(chars[0])
            reactAct(() => jest.advanceTimersByTime(200))
            keyDownOnToggleButton(chars[1])
            reactAct(() => jest.runAllTimers())
            keyDownOnToggleButton(chars[2])

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              expectedIndex,
            )
          })

          /* Here we just want to make sure the keys cleanup works. */
          test('should not go to the second option starting with the key if timeout did not pass', () => {
            const char = 'c'
            const expectedIndex = defaultIds.getItemId(
              items.indexOf(
                items.find(item => startsWithCharacter(item, char)),
              ),
            )
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton(char)
            reactAct(() => jest.advanceTimersByTime(200)) // wait some time but not enough to trigger debounce.
            keyDownOnToggleButton(char)

            // highlight should stay on the first item starting with 'C'
            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              expectedIndex,
            )
          })
        })
      })

      describe('arrow up', () => {
        describe('with menu closed', () => {
          test('opens the closed menu with last option highlighted', () => {
            const {keyDownOnToggleButton, toggleButton} = renderSelect()

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(items.length - 1),
            )
          })

          test('opens the closed menu with selected option - 1 highlighted', () => {
            const selectedIndex = 4
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              initialSelectedItem: items[selectedIndex],
            })

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(selectedIndex - 1),
            )
          })

          test('opens the closed menu at initialHighlightedIndex, but on first arrow up only', () => {
            const initialHighlightedIndex = 2
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(initialHighlightedIndex),
            )

            keyDownOnToggleButton('Escape')
            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(items.length - 1),
            )
          })

          test('arrow up opens the closed menu at defaultHighlightedIndex, on every arrow up', () => {
            const defaultHighlightedIndex = 3
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              defaultHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(defaultHighlightedIndex),
            )

            keyDownOnToggleButton('Escape')
            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
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

          test('opens the closed menu and keeps focus on the toggle button', () => {
            const {
              keyDownOnToggleButton,
              focusToggleButton,
              toggleButton,
            } = renderSelect()

            focusToggleButton()
            keyDownOnToggleButton('ArrowUp')

            expect(document.activeElement).toBe(toggleButton)
          })
        })
        describe('with menu open', () => {
          test('it highlights the last option number if none is highlighted', () => {
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(items.length - 1),
            )
          })

          test('it highlights the previous item', () => {
            const initialHighlightedIndex = 2
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(initialHighlightedIndex - 1),
            )
          })

          test('with shift it highlights the 5th previous item', () => {
            const initialHighlightedIndex = 6
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowUp', {shiftKey: true})

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(initialHighlightedIndex - 5),
            )
          })

          test('with shift it highlights the first item if not enough items remaining', () => {
            const initialHighlightedIndex = 2
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowUp', {shiftKey: true})

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(0),
            )
          })

          test('will stop at 0 if circularNavigatios is falsy', () => {
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex: 0,
            })

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(0),
            )
          })

          test('will continue from 0 to last item if circularNavigatios is truthy', () => {
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex: 0,
              circularNavigation: true,
            })

            keyDownOnToggleButton('ArrowUp')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(items.length - 1),
            )
          })
        })
      })

      describe('arrow down', () => {
        describe('with menu closed', () => {
          test('opens the closed menu with first option highlighted', () => {
            const {keyDownOnToggleButton, toggleButton} = renderSelect()

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(0),
            )
          })

          test('opens the closed menu with selected option + 1 highlighted', () => {
            const selectedIndex = 4
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              initialSelectedItem: items[selectedIndex],
            })

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(selectedIndex + 1),
            )
          })

          test('opens the closed menu at initialHighlightedIndex, but on first arrow down only', () => {
            const initialHighlightedIndex = 3
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(initialHighlightedIndex),
            )

            keyDownOnToggleButton('Escape')
            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(0),
            )
          })

          test('opens the closed menu at defaultHighlightedIndex, on every arrow down', () => {
            const defaultHighlightedIndex = 3
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              defaultHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(defaultHighlightedIndex),
            )

            keyDownOnToggleButton('Escape')
            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
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
            const {
              keyDownOnToggleButton,
              focusToggleButton,
              toggleButton,
            } = renderSelect()

            focusToggleButton()
            keyDownOnToggleButton('ArrowDown')

            expect(document.activeElement).toBe(toggleButton)
          })
        })

        describe('with menu open', () => {
          test("it highlights option number '0' if none is highlighted", () => {
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
            })

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(0),
            )
          })
          test('it highlights the next item', () => {
            const initialHighlightedIndex = 2
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(initialHighlightedIndex + 1),
            )
          })

          test('with shift it highlights the next 5th item', () => {
            const initialHighlightedIndex = 2
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowDown', {shiftKey: true})

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(initialHighlightedIndex + 5),
            )
          })

          test('with shift it highlights last item if not enough next items remaining', () => {
            const initialHighlightedIndex = items.length - 2
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowDown', {shiftKey: true})

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(items.length - 1),
            )
          })

          test('will stop at last item if circularNavigatios is falsy', () => {
            const initialHighlightedIndex = items.length - 1
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
            })

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(items.length - 1),
            )
          })

          test('will continue from last item to 0 if circularNavigatios is truthy', () => {
            const initialHighlightedIndex = items.length - 1
            const {keyDownOnToggleButton, toggleButton} = renderSelect({
              isOpen: true,
              initialHighlightedIndex,
              circularNavigation: true,
            })

            keyDownOnToggleButton('ArrowDown')

            expect(toggleButton).toHaveAttribute(
              'aria-activedescendant',
              defaultIds.getItemId(0),
            )
          })
        })
      })

      test('end it highlights the last option number', () => {
        const {keyDownOnToggleButton, toggleButton} = renderSelect({
          isOpen: true,
          initialHighlightedIndex: 2,
        })

        keyDownOnToggleButton('End')

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(items.length - 1),
        )
      })

      test('home it highlights the first option number', () => {
        const {keyDownOnToggleButton, toggleButton} = renderSelect({
          isOpen: true,
          initialHighlightedIndex: 2,
        })

        keyDownOnToggleButton('Home')

        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(0),
        )
      })

      test('escape it has the menu closed', () => {
        const {keyDownOnToggleButton, getItems} = renderSelect({
          initialIsOpen: true,
        })

        keyDownOnToggleButton('Escape')

        expect(getItems()).toHaveLength(0)
      })

      test('escape it has the focus moved to toggleButton', () => {
        const {
          keyDownOnToggleButton,
          focusToggleButton,
          toggleButton,
        } = renderSelect({
          initialIsOpen: true,
        })

        focusToggleButton()
        keyDownOnToggleButton('Escape')

        expect(document.activeElement).toBe(toggleButton)
      })

      test('enter it closes the menu and selects highlighted item', () => {
        const initialHighlightedIndex = 2
        const {keyDownOnToggleButton, getItems, toggleButton} = renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        keyDownOnToggleButton('Enter')

        expect(getItems()).toHaveLength(0)
        expect(toggleButton).toHaveTextContent(items[initialHighlightedIndex])
      })

      test('enter selects highlighted item and resets to user defaults', () => {
        const defaultHighlightedIndex = 2
        const {keyDownOnToggleButton, getItems, toggleButton} = renderSelect({
          defaultHighlightedIndex,
          defaultIsOpen: true,
        })

        keyDownOnToggleButton('Enter')

        expect(toggleButton).toHaveTextContent(items[defaultHighlightedIndex])
        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('enter it has the focus kept on the toggleButton', () => {
        const {
          keyDownOnToggleButton,
          focusToggleButton,
          toggleButton,
        } = renderSelect({initialIsOpen: true})

        focusToggleButton()
        keyDownOnToggleButton('Enter')

        expect(document.activeElement).toBe(toggleButton)
      })

      test('space it closes the menu and selects highlighted item', () => {
        const initialHighlightedIndex = 2
        const {keyDownOnToggleButton, toggleButton, getItems} = renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        keyDownOnToggleButton(' ')

        expect(getItems()).toHaveLength(0)
        expect(toggleButton).toHaveTextContent(items[initialHighlightedIndex])
      })

      test('space it selects highlighted item and resets to user defaults', () => {
        const defaultHighlightedIndex = 2
        const {keyDownOnToggleButton, toggleButton, getItems} = renderSelect({
          defaultHighlightedIndex,
          defaultIsOpen: true,
        })

        keyDownOnToggleButton(' ')

        expect(toggleButton).toHaveTextContent(items[defaultHighlightedIndex])
        expect(getItems()).toHaveLength(items.length)
        expect(toggleButton).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('space it has the focus moved kept on the toggleButton', () => {
        const {
          keyDownOnToggleButton,
          focusToggleButton,
          toggleButton,
        } = renderSelect({initialIsOpen: true})

        focusToggleButton()
        keyDownOnToggleButton(' ')

        expect(document.activeElement).toBe(toggleButton)
      })

      test('tab it closes the menu and does not select highlighted item', () => {
        const initialHighlightedIndex = 2
        const {focusToggleButton, tab, getItems, toggleButton} = renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        focusToggleButton()
        tab()

        expect(getItems()).toHaveLength(0)
        expect(toggleButton).toHaveTextContent('Elements')
      })

      test('shift+tab it closes the menu', () => {
        const initialHighlightedIndex = 2
        const {focusToggleButton, tab, getItems, toggleButton} = renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        focusToggleButton()
        tab(true)

        expect(getItems()).toHaveLength(0)
        expect(toggleButton).toHaveTextContent('Elements')
      })

      test('shift tab has the focus moved to previous element', () => {
        const {getByText} = render(
          <>
            <div tabIndex={0}>First element</div>
            <DropdownSelect />
            <div tabIndex={0}>Second element</div>
          </>,
        )
        const toggleButton = getByText('Elements')

        toggleButton.focus()
        userEvent.tab({shift: true})

        expect(document.activeElement).not.toEqual(toggleButton)
        expect(document.activeElement).toEqual(getByText(/First element/))
      })

      test('tab has the focus moved to next element', () => {
        const {getByText} = render(
          <>
            <div tabIndex={0}>First element</div>
            <DropdownSelect />
            <div tabIndex={0}>Second element</div>
          </>,
        )
        const toggleButton = getByText('Elements')

        toggleButton.focus()
        userEvent.tab()

        expect(document.activeElement).not.toEqual(toggleButton)
        expect(document.activeElement).toEqual(getByText(/Second element/))
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

    describe('blur', () => {
      test('should not select highlighted item but close the menu', () => {
        const initialHighlightedIndex = 2
        const {
          focusToggleButton,
          getItems,
          blurToggleButton,
          toggleButton,
        } = renderSelect({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        focusToggleButton()
        blurToggleButton()

        expect(getItems()).toHaveLength(0)
        expect(toggleButton).toHaveTextContent('Element')
      })

      test('by focusing another element should behave as a normal blur', () => {
        const {getByText, queryAllByRole} = render(
          <>
            <DropdownSelect initialIsOpen={true} initialHighlightedIndex={2} />
            <div tabIndex={0}>Second element</div>
          </>,
        )
        const toggleButton = getByText('Elements')

        toggleButton.focus()
        getByText(/Second element/).focus()

        expect(queryAllByRole('option')).toHaveLength(0)
        expect(toggleButton).toHaveTextContent('Element')
      })
    })
  })
})
