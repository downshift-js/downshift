import * as React from 'react'
import {act, renderHook, fireEvent, createEvent} from '@testing-library/react'
import * as stateChangeTypes from '../stateChangeTypes'
import {noop} from '../../../utils-ts'
import {
  renderUseCombobox,
  renderCombobox,
  items,
  defaultIds,
  changeInputValue,
  getInput,
  getItems,
  keyDownOnInput,
  mouseLeaveItemAtIndex,
  mouseMoveItemAtIndex,
  tab,
  clickOnInput,
  initialFocusAndOpenTestCases,
  initialNoFocusOrOpenTestCases,
} from '../testUtils'
import utils from '../../utils'
import useCombobox from '..'

describe('getInputProps', () => {
  describe('hook props', () => {
    test("assign 'combobox' to role", () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps.role).toEqual('combobox')
    })

    test('assign default value to id', () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps.id).toEqual(defaultIds.inputId)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        inputId: 'my-custom-input-id',
      }
      const {result} = renderUseCombobox(props)
      const inputProps = result.current.getInputProps()

      expect(inputProps.id).toEqual(props.inputId)
    })

    test("assign 'list' to 'aria-autocomplete'", () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-autocomplete']).toEqual('list')
    })

    test("assign 'off' to autoComplete", () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps.autoComplete).toEqual('off')
    })

    test('assign default value to aria-controls', () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-controls']).toEqual(`${defaultIds.menuId}`)
    })

    test('assign custom value passed by user to aria-controls', () => {
      const props = {
        menuId: 'my-custom-menu-id',
      }
      const {result} = renderUseCombobox(props)
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-controls']).toEqual(`${props.menuId}`)
    })

    test('assign id of highlighted item to aria-activedescendant if item is highlighted and menu is open', () => {
      const {result} = renderUseCombobox({highlightedIndex: 2, isOpen: true})
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-activedescendant']).toEqual(
        defaultIds.getItemId(2),
      )
    })

    test('assign no aria-activedescendant if item is highlighted and menu is closed', () => {
      const {result} = renderUseCombobox({highlightedIndex: 2})
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-activedescendant']).toBe('')
    })

    test('do not assign aria-activedescendant if no item is highlighted', () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-activedescendant']).toBe('')
    })

    test('do not assign aria-activedescendant if no item is highlighted and menu is open', () => {
      const {result} = renderUseCombobox({isOpen: true})
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-activedescendant']).toBe('')
    })

    test('assign default value to aria-labelledby', () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-labelledby']).toEqual(`${defaultIds.labelId}`)
    })

    test('assign custom value passed by user to aria-labelledby', () => {
      const props = {
        labelId: 'my-custom-label-id',
      }
      const {result} = renderUseCombobox(props)
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-labelledby']).toEqual(`${props.labelId}`)
    })

    test("assign 'false' value to aria-expanded when menu is closed", () => {
      const {result} = renderUseCombobox({isOpen: false})
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-expanded']).toEqual(false)
    })

    test("assign 'true' value to aria-expanded when menu is open", () => {
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()

        inputRef({focus: noop})
        result.current.toggleMenu()
      })

      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-expanded']).toEqual(true)
    })

    test('handlers are not returned if input is disabled', () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps({
        disabled: true,
      })

      expect(inputProps.onChange).toBeUndefined()
      expect(inputProps.onKeyDown).toBeUndefined()
      expect(inputProps.onBlur).toBeUndefined()
      expect(inputProps.onClick).toBeUndefined()
      expect(inputProps.disabled).toBe(true)
    })

    test("do not assign 'aria-labelledby' if it has aria-label", () => {
      const ariaLabel = 'not so fast'
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps({'aria-label': ariaLabel})

      expect(inputProps['aria-labelledby']).toBeUndefined()
      expect(inputProps['aria-label']).toBe(ariaLabel)
    })

    test('handlers are returned if input is not disabled', () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps.onChange).toBeDefined()
      expect(inputProps.onKeyDown).toBeDefined()
      expect(inputProps.onClick).toBeDefined()
      expect(inputProps.onBlur).toBeDefined()
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseCombobox()

      expect(result.current.getInputProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('custom ref passed by the user is used', () => {
      const {result} = renderUseCombobox()
      const refFn = jest.fn()
      const inputNode = {}

      act(() => {
        const {ref} = result.current.getInputProps({ref: refFn})

        ref(inputNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(inputNode)
    })

    test('custom ref with custom name passed by the user is used', () => {
      const {result} = renderUseCombobox()
      const refFn = jest.fn()
      const inputNode = {}

      act(() => {
        const {blablaRef} = result.current.getInputProps({
          refKey: 'blablaRef',
          blablaRef: refFn,
        })

        blablaRef(inputNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(inputNode)
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = renderUseCombobox()

      const {ref: inputRef, onKeyDown} = result.current.getInputProps({
        onKeyDown: userOnKeyDown,
      })
      inputRef({focus: noop})
      act(() => {
        result.current.toggleMenu()
      })
      act(() => {
        onKeyDown({key: 'Escape', preventDefault: noop, stopPropagation: noop})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })

    test("event handler onKeyDown is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnKeyDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef, onKeyDown} = result.current.getInputProps({
          onKeyDown: userOnKeyDown,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onKeyDown({key: 'Escape', preventDefault: noop})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test('event handler onBlur is called along with downshift handler', () => {
      const userOnBlur = jest.fn()
      const {result} = renderUseCombobox({initialIsOpen: true})

      act(() => {
        const {ref: inputRef, onBlur} = result.current.getInputProps({
          onBlur: userOnBlur,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onBlur({})
      })

      expect(userOnBlur).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })

    test("event handler onBlur is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnBlur = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef, onBlur} = result.current.getInputProps({
          onBlur: userOnBlur,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onBlur({preventDefault: noop})
      })

      expect(userOnBlur).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test('event handler onChange is called along with downshift handler', () => {
      const userOnChange = jest.fn()
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef, onChange} = result.current.getInputProps({
          onChange: userOnChange,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onChange({target: {value: 'lalaland'}})
      })

      expect(userOnChange).toHaveBeenCalledTimes(1)
      expect(result.current.inputValue).toBe('lalaland')
    })

    test("event handler onChange is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnChange = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef, onChange} = result.current.getInputProps({
          onChange: userOnChange,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onChange({target: {value: 'lalaland'}})
      })

      expect(userOnChange).toHaveBeenCalledTimes(1)
      expect(result.current.inputValue).toBe('')
    })

    test('event handler onInput is called along with downshift handler', () => {
      const userOnInput = jest.fn()
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef, onChange} = result.current.getInputProps({
          onInput: userOnInput,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onChange({target: {value: 'a'}})
      })

      expect(userOnInput).toHaveBeenCalledTimes(1)
      expect(result.current.inputValue).toBe('a')
    })

    test("event handler onInput is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnInput = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef, onChange} = result.current.getInputProps({
          onInput: userOnInput,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onChange({target: {value: 'a'}})
      })

      expect(userOnInput).toHaveBeenCalledTimes(1)
      expect(result.current.inputValue).toBe('')
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseCombobox()

      act(() => {
        const {ref: inputRef, onClick} = result.current.getInputProps({
          onClick: userOnClick,
        })

        inputRef({focus: noop})
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
        const {ref: inputRef, onClick} = result.current.getInputProps({
          onClick: userOnClick,
        })

        inputRef({focus: noop})
        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('initial focus', () => {
    test.each(initialFocusAndOpenTestCases)(
      'is grabbed when initialIsOpen: %s, defaultIsOpen: %s, props.isOpen: %s',
      (initialIsOpen, defaultIsOpen, isOpen) => {
        renderCombobox({isOpen, defaultIsOpen, initialIsOpen})

        expect(getInput()).toHaveFocus()
        expect(getItems()).toHaveLength(items.length)
      },
    )

    test.each(initialNoFocusOrOpenTestCases)(
      'is not grabbed when initialIsOpen: %s, defaultIsOpen: %s, props.isOpen: %s',
      (initialIsOpen, defaultIsOpen, isOpen) => {
        renderCombobox({isOpen, defaultIsOpen, initialIsOpen})

        expect(getInput()).not.toHaveFocus()
        expect(getItems()).toHaveLength(0)
      },
    )
  })

  describe('event handlers', () => {
    describe('on change', () => {
      test('should open the menu and keep the input value', async () => {
        renderCombobox()

        await changeInputValue('california')

        expect(getItems()).toHaveLength(items.length)
        expect(getInput()).toHaveValue('california')
      })

      test('should remove the highlightedIndex', async () => {
        renderCombobox({initialHighlightedIndex: 2})

        await changeInputValue('california')

        expect(getInput()).toHaveAttribute('aria-activedescendant', '')
      })

      test('should reset to defaultHighlightedIndex', async () => {
        const defaultHighlightedIndex = 2
        renderCombobox({defaultHighlightedIndex})

        await changeInputValue('a')

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        await keyDownOnInput('{ArrowDown}')

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex + 1),
        )

        await changeInputValue('a')

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('should not reset to defaultHighlightedIndex if disabled', async () => {
        const defaultHighlightedIndex = 2
        renderCombobox({
          defaultHighlightedIndex,
          isItemDisabled(_item, index) {
            return index === defaultHighlightedIndex
          },
        })

        await keyDownOnInput('{ArrowDown}')
        await changeInputValue('a')

        expect(getInput()).toHaveAttribute('aria-activedescendant', '')
      })
    })

    describe('on key down', () => {
      describe('arrow up', () => {
        test('it prevents the default event behavior', () => {
          renderCombobox()
          const input = getInput()
          const keyDownEvent = createEvent.keyDown(input, {key: 'ArrowUp'})

          fireEvent(input, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
        })

        test('it does not open or highlight anything if there are no options', async () => {
          renderCombobox({items: []})

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test('it does not highlight anything if there are no options', async () => {
          renderCombobox({
            items: [],
            isOpen: true,
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test('it opens the menu and highlights the last option', async () => {
          renderCombobox()

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('it opens the closed menu with selected option highlighted', async () => {
          const selectedIndex = 4
          renderCombobox({
            initialSelectedItem: items[selectedIndex],
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(selectedIndex),
          )
        })

        test('it opens the closed menu at initialHighlightedIndex, but on first arrow up only', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            initialHighlightedIndex,
            initialIsOpen: true,
          })

          await keyDownOnInput('{Escape}')
          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('it opens the closed menu at defaultHighlightedIndex, on every arrow up', async () => {
          const defaultHighlightedIndex = 3
          renderCombobox({
            defaultHighlightedIndex,
          })
          const input = getInput()

          await keyDownOnInput('{ArrowUp}')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )

          await keyDownOnInput('{Escape}')
          await keyDownOnInput('{ArrowUp}')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test('initialHighlightedIndex is ignored if item is disabled', async () => {
          const initialHighlightedIndex = 2
          const isItemDisabled = jest
            .fn()
            .mockImplementation(
              item => items.indexOf(item) === initialHighlightedIndex,
            )
          renderCombobox({
            initialHighlightedIndex,
            isItemDisabled,
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
          expect(isItemDisabled.mock.calls.slice(0, 2)).toMatchSnapshot()
        })

        test('initialHighlightedIndex is ignored and defaultHighlightedIndex is chosen if enabled', async () => {
          const initialHighlightedIndex = 0
          const defaultHighlightedIndex = 2
          renderCombobox({
            initialHighlightedIndex,
            defaultHighlightedIndex,
            isItemDisabled(item) {
              return items.indexOf(item) === initialHighlightedIndex
            },
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test('defaultHighlightedIndex is ignored if item is disabled', async () => {
          const defaultHighlightedIndex = 2
          const isItemDisabled = jest
            .fn()
            .mockImplementation(
              item => items.indexOf(item) === defaultHighlightedIndex,
            )
          renderCombobox({
            defaultHighlightedIndex,
            isItemDisabled,
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
          expect(isItemDisabled.mock.calls.slice(0, 3)).toMatchSnapshot()
        })

        test('both defaultHighlightedIndex and initialHighlightedIndex are ignored if items are disabled', async () => {
          const initialHighlightedIndex = 1
          const defaultHighlightedIndex = 2
          renderCombobox({
            initialHighlightedIndex,
            defaultHighlightedIndex,
            isItemDisabled(item) {
              return [
                initialHighlightedIndex,
                defaultHighlightedIndex,
              ].includes(items.indexOf(item))
            },
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('it opens the closed menu and keeps focus on the combobox', async () => {
          renderCombobox()

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveFocus()
        })

        test('it highlights the last option number if none is highlighted', async () => {
          renderCombobox({isOpen: true})

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('it highlights the previous item', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex - 1),
          )
        })

        test('with Alt it selects the item and closes the menu', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            initialIsOpen: true,
            initialHighlightedIndex,
          })
          const input = getInput()

          await keyDownOnInput('{Alt>}{ArrowUp}{/Alt}')

          expect(getItems()).toHaveLength(0)
          expect(input).toHaveValue(items[initialHighlightedIndex])
        })

        test('with Alt it opens the menu without any additional change', async () => {
          renderCombobox()

          await keyDownOnInput('{Alt>}{ArrowUp}{/Alt}')

          expect(getItems()).toHaveLength(items.length)
          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('with Alt selects highlighted item and resets to user defaults', async () => {
          const defaultHighlightedIndex = 2
          renderCombobox({
            defaultHighlightedIndex,
            defaultIsOpen: true,
          })
          const input = getInput()

          await keyDownOnInput('{Alt>}{ArrowUp}{/Alt}')

          expect(input).toHaveValue(items[defaultHighlightedIndex])
          expect(getItems()).toHaveLength(items.length)
          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test('with Alt closes the menu without resetting to user defaults if no item is highlighted', async () => {
          const defaultHighlightedIndex = 2
          const initialSelectedItem = items[0]
          renderCombobox({
            defaultHighlightedIndex,
            defaultIsOpen: true,
            initialSelectedItem,
          })
          const input = getInput()

          await mouseMoveItemAtIndex(defaultHighlightedIndex)
          await mouseLeaveItemAtIndex(defaultHighlightedIndex)
          await keyDownOnInput('{Alt>}{ArrowUp}{/Alt}')

          expect(input).toHaveValue(initialSelectedItem)
          expect(getItems()).toHaveLength(0)
          expect(input).toHaveAttribute('aria-activedescendant', '')
        })

        test('with Alt closes the menu without resetting to user defaults if lhe list is empty', async () => {
          const defaultHighlightedIndex = 2
          const initialSelectedItem = items[0]
          renderCombobox({
            defaultHighlightedIndex,
            defaultIsOpen: true,
            initialSelectedItem,
            items: [],
          })
          const input = getInput()

          await keyDownOnInput('{Alt>}{ArrowUp}{/Alt}')

          expect(input).toHaveValue(initialSelectedItem)
          expect(getItems()).toHaveLength(0)
          expect(input).toHaveAttribute('aria-activedescendant', '')
        })

        test('will continue from 0 to last item', async () => {
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex: 0,
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('skips disabled items', async () => {
          renderCombobox({
            isItemDisabled(_item, index) {
              return index === 2
            },
            initialIsOpen: true,
            initialHighlightedIndex: 3,
          })

          await keyDownOnInput('{ArrowUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(1),
          )
        })
      })

      describe('arrow down', () => {
        test('it prevents the default event behavior', () => {
          renderCombobox()
          const input = getInput()
          const keyDownEvent = createEvent.keyDown(input, {key: 'ArrowDown'})

          fireEvent(input, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
        })

        test('it does not opne on highlight anything if there are no options', async () => {
          renderCombobox({items: []})

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test('it does not highlight anything if there are no options', async () => {
          renderCombobox({
            items: [],
            isOpen: true,
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute('aria-activedescendant', '')
          expect(getItems()).toHaveLength(0)
        })

        test("it opens the menu and highlights option number '0'", async () => {
          renderCombobox()

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('opens the closed menu with selected option highlighted', async () => {
          const selectedIndex = 4
          renderCombobox({
            initialSelectedItem: items[selectedIndex],
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(selectedIndex),
          )
        })

        test('it opens the menu and highlights initialHighlightedIndex only once', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            initialHighlightedIndex,
            initialIsOpen: true,
          })

          await keyDownOnInput('{Escape}')
          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('it opens the menu and highlights defaultHighlightedIndex always', async () => {
          const defaultHighlightedIndex = 2
          renderCombobox({
            defaultHighlightedIndex,
          })
          const input = getInput()

          await keyDownOnInput('{ArrowDown}')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
          expect(getItems()).toHaveLength(items.length)

          await keyDownOnInput('{Escape}')
          await keyDownOnInput('{ArrowDown}')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('initialHighlightedIndex is ignored if item is disabled', async () => {
          const initialHighlightedIndex = 2
          const isItemDisabled = jest
            .fn()
            .mockImplementation(
              item => items.indexOf(item) === initialHighlightedIndex,
            )
          renderCombobox({
            initialHighlightedIndex,
            isItemDisabled,
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
          expect(isItemDisabled.mock.calls.slice(0, 2)).toMatchSnapshot()
        })

        test('initialHighlightedIndex is ignored and defaultHighlightedIndex is chosen if enabled', async () => {
          const initialHighlightedIndex = 0
          const defaultHighlightedIndex = 2
          renderCombobox({
            initialHighlightedIndex,
            defaultHighlightedIndex,
            isItemDisabled(item) {
              return items.indexOf(item) === initialHighlightedIndex
            },
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test('defaultHighlightedIndex is ignored if item is disabled', async () => {
          const defaultHighlightedIndex = 2
          const isItemDisabled = jest
            .fn()
            .mockImplementation(
              item => items.indexOf(item) === defaultHighlightedIndex,
            )
          renderCombobox({
            defaultHighlightedIndex,
            isItemDisabled,
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
          expect(isItemDisabled.mock.calls.slice(0, 3)).toMatchSnapshot()
        })

        test('both defaultHighlightedIndex and initialHighlightedIndex are ignored if items are disabled', async () => {
          const initialHighlightedIndex = 1
          const defaultHighlightedIndex = 2
          renderCombobox({
            initialHighlightedIndex,
            defaultHighlightedIndex,
            isItemDisabled(item) {
              return [
                initialHighlightedIndex,
                defaultHighlightedIndex,
              ].includes(items.indexOf(item))
            },
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('opens the closed menu and keeps focus on the button', async () => {
          renderCombobox()

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveFocus()
        })

        test("it highlights option number '0' if none is highlighted", async () => {
          renderCombobox({isOpen: true})

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('it highlights the next item', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex + 1),
          )
        })

        test('with Alt it opens the menu and highlights no item', async () => {
          renderCombobox()

          await keyDownOnInput('{Alt>}{ArrowDown}{/Alt}')

          expect(getInput()).toHaveAttribute('aria-activedescendant', '')
        })

        test('with Alt it opens the menu and highlights with selected item highlighted', async () => {
          const itemIndex = 8
          renderCombobox({selectedItem: items[itemIndex]})

          await keyDownOnInput('{Alt>}{ArrowDown}{/Alt}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(itemIndex),
          )
        })

        test('with Alt it highlights the next item without any additional change', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({initialHighlightedIndex, isOpen: true})

          await keyDownOnInput('{Alt>}{ArrowDown}{/Alt}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex + 1),
          )
        })

        test('will continue from last item to 0', async () => {
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex: items.length - 1,
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('skips disabled items', async () => {
          renderCombobox({
            isItemDisabled(_item, index) {
              return index === 2
            },
            initialIsOpen: true,
            initialHighlightedIndex: 1,
          })

          await keyDownOnInput('{ArrowDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(3),
          )
        })
      })

      describe('end', () => {
        test('highlights the last option number', async () => {
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex: 2,
          })

          await keyDownOnInput('{End}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('prevents the default event and calls dispatch only when menu is open', () => {
          const {rerender, renderSpy} = renderCombobox({isOpen: false})
          const input = getInput()
          const keyDownEvent = createEvent.keyDown(input, {key: 'End'})

          renderSpy.mockClear()
          fireEvent(input, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(false)
          expect(renderSpy).not.toHaveBeenCalled()

          rerender({isOpen: true})
          renderSpy.mockClear()
          fireEvent(input, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
          expect(renderSpy).toHaveBeenCalledTimes(1)
        })

        test('highlights previous non-disabled option', async () => {
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex: 0,
            isItemDisabled(_item, index) {
              return index === items.length - 1
            },
          })

          await keyDownOnInput('{End}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 2),
          )
        })
      })

      describe('home', () => {
        test('home highlights the first option number', async () => {
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex: 2,
          })

          await keyDownOnInput('{Home}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('home prevents the default event calls dispatch only when menu is open', () => {
          const {rerender, renderSpy} = renderCombobox({isOpen: false})
          const input = getInput()
          const keyDownEvent = createEvent.keyDown(input, {key: 'Home'})

          renderSpy.mockClear()
          fireEvent(input, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(false)
          expect(renderSpy).not.toHaveBeenCalled()

          rerender({isOpen: true})
          renderSpy.mockClear()
          fireEvent(input, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
          expect(renderSpy).toHaveBeenCalledTimes(1) // re-render on key
        })

        test('highlights next non-disabled option', async () => {
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex: 2,
            isItemDisabled(_item, index) {
              return index === 0
            },
          })

          await keyDownOnInput('{Home}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(1),
          )
        })
      })

      describe('escape', () => {
        test('with menu open has the menu closed and focused kept on input', async () => {
          renderCombobox({
            initialIsOpen: true,
            initialHighlightedIndex: 2,
            initialSelectedItem: items[0],
          })
          const input = getInput()

          await keyDownOnInput('{Escape}')

          expect(getItems()).toHaveLength(0)
          expect(input).toHaveValue(items[0])
          expect(input).toHaveFocus()
        })

        test('with closed menu has item removed and focused kept on input', async () => {
          renderCombobox({
            initialHighlightedIndex: 2,
            initialSelectedItem: items[0],
          })
          const input = getInput()

          await keyDownOnInput('{Escape}')

          expect(getItems()).toHaveLength(0)
          expect(input).toHaveValue('')
          expect(input).toHaveFocus()
        })

        test('prevents the rerender when menu is closed, no selectedItem and no inputValue', async () => {
          const {renderSpy, rerender} = renderCombobox({
            isOpen: false,
            inputValue: '',
          })

          await keyDownOnInput('{Escape}') // focus input and close the menu.
          renderSpy.mockClear()

          await keyDownOnInput('{Escape}')

          expect(renderSpy).toHaveBeenCalledTimes(0) // no re-render

          rerender({isOpen: true, inputValue: ''})
          renderSpy.mockClear() // reset rerender and initial render
          await keyDownOnInput('{Escape}')

          expect(renderSpy).toHaveBeenCalledTimes(1) // re-render on key

          rerender({isOpen: false, inputValue: 'still'})
          renderSpy.mockClear() // reset rerender and initial render
          await keyDownOnInput('{Escape}')

          expect(renderSpy).toHaveBeenCalledTimes(1) // re-render on key
        })

        test('stops propagation when it closes the menu or clears the input', () => {
          renderCombobox({
            initialIsOpen: true,
            initialSelectedItem: items[0],
          })
          const input = getInput()
          const keyDownEvents = [
            createEvent.keyDown(input, {key: 'Escape'}),
            createEvent.keyDown(input, {key: 'Escape'}),
            createEvent.keyDown(input, {key: 'Escape'}),
          ]

          for (let index = 0; index < keyDownEvents.length; index++) {
            fireEvent(input, keyDownEvents[index])
            expect(keyDownEvents[index].defaultPrevented).toBe(
              index !== keyDownEvents.length - 1,
            )
          }
        })
      })

      describe('enter', () => {
        test('closes the menu and selects highlighted item', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            initialIsOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnInput('{Enter}')

          expect(getItems()).toHaveLength(0)
          expect(getInput()).toHaveValue(items[initialHighlightedIndex])
        })

        test('selects highlighted item and resets to user defaults', async () => {
          const defaultHighlightedIndex = 2
          renderCombobox({
            defaultHighlightedIndex,
            defaultIsOpen: true,
          })
          const input = getInput()

          await keyDownOnInput('{Enter}')

          expect(input).toHaveValue(items[defaultHighlightedIndex])
          expect(getItems()).toHaveLength(items.length)
          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
        })

        test('closes the menu without resetting to user defaults if no item is highlighted', async () => {
          const defaultHighlightedIndex = 2
          const initialSelectedItem = items[0]
          renderCombobox({
            defaultHighlightedIndex,
            defaultIsOpen: true,
            initialSelectedItem,
          })
          const input = getInput()

          await mouseMoveItemAtIndex(defaultHighlightedIndex)
          await mouseLeaveItemAtIndex(defaultHighlightedIndex)
          await keyDownOnInput('{Enter}')

          expect(input).toHaveValue(initialSelectedItem)
          expect(getItems()).toHaveLength(0)
          expect(input).toHaveAttribute('aria-activedescendant', '')
        })

        test('closes the menu without resetting to user defaults if the list is empty', async () => {
          const defaultHighlightedIndex = 2
          const initialSelectedItem = items[0]
          renderCombobox({
            defaultHighlightedIndex,
            defaultIsOpen: true,
            initialSelectedItem,
            items: [],
          })
          const input = getInput()

          await keyDownOnInput('{Enter}')

          expect(input).toHaveValue(initialSelectedItem)
          expect(getItems()).toHaveLength(0)
          expect(input).toHaveAttribute('aria-activedescendant', '')
        })

        test('while IME composing will not select highlighted item', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            initialHighlightedIndex,
            initialIsOpen: true,
          })
          const input = getInput()

          fireEvent.keyDown(getInput(), {key: 'Enter', keyCode: 229})

          expect(input).toHaveValue('')
          expect(getItems()).toHaveLength(items.length)
          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex),
          )

          await keyDownOnInput('{Enter}')

          expect(input).toHaveValue(items[2])
          expect(getItems()).toHaveLength(0)
          expect(input).toHaveAttribute('aria-activedescendant', '')
        })

        test('with a closed menu does nothing', async () => {
          renderCombobox({
            initialHighlightedIndex: 2,
            initialIsOpen: false,
          })

          await keyDownOnInput('{Enter}')

          expect(getItems()).toHaveLength(0)
          expect(getInput()).not.toHaveValue()
        })

        test('with an open menu closes the menu without a highlightedIndex', async () => {
          renderCombobox({
            initialIsOpen: true,
          })

          await keyDownOnInput('{Enter}')

          expect(getItems()).toHaveLength(0)
          expect(getInput()).not.toHaveValue()
        })

        test('with closed menu or composing event, it will not rerender or prevent event default', () => {
          const {renderSpy, rerender} = renderCombobox({
            isOpen: false,
            highlightedIndex: -1,
          })
          const input = getInput()
          let keyDownEvent = createEvent.keyDown(input, {key: 'Enter'})

          renderSpy.mockClear()
          fireEvent(input, keyDownEvent)

          expect(renderSpy).not.toHaveBeenCalled()
          expect(keyDownEvent.defaultPrevented).toBe(false)

          keyDownEvent = createEvent.keyDown(input, {
            key: 'Enter',
            keyCode: 229,
          })
          rerender({
            isOpen: true,
            highlightedIndex: 2,
          })
          renderSpy.mockClear()
          fireEvent(input, keyDownEvent)

          expect(renderSpy).not.toHaveBeenCalled()
          expect(keyDownEvent.defaultPrevented).toBe(false)

          keyDownEvent = createEvent.keyDown(input, {key: 'Enter'})
          fireEvent(input, keyDownEvent)

          expect(renderSpy).toHaveBeenCalledTimes(1)
          expect(keyDownEvent.defaultPrevented).toBe(true)
        })
      })

      test('tab it closes the menu and selects highlighted item', async () => {
        const initialHighlightedIndex = 2
        renderCombobox(
          {initialIsOpen: true, initialHighlightedIndex: 2},
          ui => {
            return (
              <>
                {ui}
                <div tabIndex={0}>Second element</div>
              </>
            )
          },
        )

        await tab()

        expect(getItems()).toHaveLength(0)
        expect(getInput()).toHaveValue(items[initialHighlightedIndex])
      })

      test('tab closes the menu if there is no highlighted item', async () => {
        const defaultHighlightedIndex = 2
        const initialSelectedItem = items[0]

        renderCombobox(
          {
            defaultHighlightedIndex,
            defaultIsOpen: true,
            initialSelectedItem,
          },
          ui => {
            return (
              <>
                {ui}
                <div tabIndex={0}>Second element</div>
              </>
            )
          },
        )

        await mouseMoveItemAtIndex(defaultHighlightedIndex)
        await mouseLeaveItemAtIndex(defaultHighlightedIndex)
        await tab()

        expect(getItems()).toHaveLength(0)
        expect(getInput()).toHaveValue(initialSelectedItem)
      })

      test('tab closes the menu if there is no items', async () => {
        const defaultHighlightedIndex = 2
        const initialSelectedItem = items[0]

        renderCombobox(
          {
            defaultHighlightedIndex,
            defaultIsOpen: true,
            initialSelectedItem,
            items: [],
          },
          ui => {
            return (
              <>
                {ui}
                <div tabIndex={0}>Second element</div>
              </>
            )
          },
        )

        await tab()

        expect(getItems()).toHaveLength(0)
        expect(getInput()).toHaveValue(initialSelectedItem)
      })

      test('shift+tab it closes the menu', async () => {
        const initialHighlightedIndex = 2
        renderCombobox(
          {initialIsOpen: true, initialHighlightedIndex: 2},
          ui => {
            return (
              <>
                <div tabIndex={0}>First element</div>
                {ui}
              </>
            )
          },
        )

        await tab(true)

        expect(getItems()).toHaveLength(0)
        expect(getInput()).toHaveValue(items[initialHighlightedIndex])
      })

      test("other than the ones supported don't affect anything", async () => {
        const highlightedIndex = 2
        renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex: highlightedIndex,
          initialSelectedItem: items[highlightedIndex],
        })
        const input = getInput()

        await keyDownOnInput('{Alt}')
        await keyDownOnInput('{Control}')

        expect(input).toHaveFocus()
        expect(input).toHaveValue(items[highlightedIndex])
        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
        expect(getItems()).toHaveLength(items.length)
      })

      describe('pageUp', () => {
        test('pageUp jumps highlight up by 10 options', async () => {
          const initialHighlightedIndex = 12
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnInput('{PageUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex - 10),
          )
        })

        test('skips the disabled option to the previous non-disabled one', async () => {
          const initialHighlightedIndex = 12
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
            isItemDisabled(_item, index) {
              return index === 2
            },
          })

          await keyDownOnInput('{PageUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(1),
          )
        })

        test('jumps highlight the first option if highlightedIndex is 10 or smaller', async () => {
          const initialHighlightedIndex = 7
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnInput('{PageUp}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('prevents the default event behavior with the menu open', () => {
          renderCombobox({isOpen: true})
          const toggleButton = getInput()
          const keyDownEvent = createEvent.keyDown(toggleButton, {
            key: 'PageUp',
          })

          fireEvent(toggleButton, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
        })

        test('does not prevent the default event behavior with the menu closed', () => {
          renderCombobox()
          const toggleButton = getInput()
          const keyDownEvent = createEvent.keyDown(toggleButton, {
            key: 'PageUp',
          })

          fireEvent(toggleButton, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(false)
        })
      })

      describe('pageDown', () => {
        test('pageDown jumps highlight down by 10 options', async () => {
          const initialHighlightedIndex = 12
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnInput('{PageDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex + 10),
          )
        })

        test('skips the disabled option to the next non-disabled one', async () => {
          const initialHighlightedIndex = 2
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
            isItemDisabled(_item, index) {
              return index === 12
            },
          })

          await keyDownOnInput('{PageDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(13),
          )
        })

        test('pageDown jumps highlight the last option if highlightedIndex is closer than 10 indeces to the end', async () => {
          const initialHighlightedIndex = items.length - 5
          renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          await keyDownOnInput('{PageDown}')

          expect(getInput()).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('pageDown prevents the default event behavior with the menu open', () => {
          renderCombobox({isOpen: true})
          const toggleButton = getInput()
          const keyDownEvent = createEvent.keyDown(toggleButton, {
            key: 'PageDown',
          })

          fireEvent(toggleButton, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(true)
        })

        test('pageDown does not prevent the default event behavior with the menu closed', () => {
          renderCombobox()
          const toggleButton = getInput()
          const keyDownEvent = createEvent.keyDown(toggleButton, {
            key: 'PageDown',
          })

          fireEvent(toggleButton, keyDownEvent)

          expect(keyDownEvent.defaultPrevented).toBe(false)
        })
      })
    })

    describe('on blur', () => {
      test('by tab the open menu will be closed and highlighted item will be selected', async () => {
        const initialHighlightedIndex = 2
        renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        await tab()

        expect(getItems()).toHaveLength(0)
        expect(getInput()).toHaveValue(items[initialHighlightedIndex])
      })

      test('by tab the open menu will be closed and highlighted item will not be selected if the highlight by mouse leaves the menu', async () => {
        const initialHighlightedIndex = 2
        renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        await mouseMoveItemAtIndex(initialHighlightedIndex)
        await mouseLeaveItemAtIndex(initialHighlightedIndex)
        await tab()

        expect(getItems()).toHaveLength(0)
        expect(getInput()).toHaveValue('')
      })

      test('by tab the value in the input will stay the same', async () => {
        const inputValue = 'test me'
        renderCombobox({
          initialIsOpen: true,
        })

        await changeInputValue(inputValue)
        await tab()

        expect(getInput()).toHaveValue(inputValue)
      })

      test('by mouse is not triggered if target is within downshift', () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        const {container} = renderCombobox({
          isOpen: true,
          highlightedIndex: 0,
          stateReducer,
        })
        const input = getInput()
        document.body.appendChild(container)

        fireEvent.mouseDown(input)
        fireEvent.mouseUp(input)

        expect(stateReducer).not.toHaveBeenCalled()

        fireEvent.mouseDown(document.body)
        fireEvent.mouseUp(document.body)

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          {
            highlightedIndex: 0,
            inputValue: '',
            isOpen: true,
            selectedItem: null,
          },
          expect.objectContaining({
            type: stateChangeTypes.InputBlur,
            changes: {
              highlightedIndex: -1,
              inputValue: '',
              isOpen: false,
              selectedItem: null,
            },
          }),
        )
      })

      test('by touch is not triggered if target is within downshift', () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        const {container} = renderCombobox({
          isOpen: true,
          highlightedIndex: 0,
          stateReducer,
        })
        const input = getInput()
        document.body.appendChild(container)

        fireEvent.touchStart(input)
        fireEvent.touchMove(input)
        fireEvent.touchEnd(input)

        expect(stateReducer).not.toHaveBeenCalled()

        fireEvent.touchStart(document.body)
        fireEvent.touchEnd(document.body)

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          {
            highlightedIndex: 0,
            inputValue: '',
            isOpen: true,
            selectedItem: null,
          },
          expect.objectContaining({
            type: stateChangeTypes.InputBlur,
            changes: {
              highlightedIndex: -1,
              inputValue: '',
              isOpen: false,
              selectedItem: null,
            },
          }),
        )
      })

      test('from the last element in the tab order, the open menu will be closed and highlighted item will be selected', () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        renderCombobox({
          isOpen: true,
          highlightedIndex: 0,
          stateReducer,
        })

        // tab from the last element in the tab order ends up on the body.
        const body = {}
        const actualBody = document.body
        global.document = {...document, activeElement: body, body}
        fireEvent.blur(getInput(), {relatedTarget: null}) // and also has relatedTarget: null, like when blur is performed by tab change

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          {
            highlightedIndex: 0,
            inputValue: '',
            isOpen: true,
            selectedItem: null,
          },
          expect.objectContaining({
            type: stateChangeTypes.InputBlur,
            changes: {
              highlightedIndex: -1,
              inputValue: '',
              isOpen: false,
              selectedItem: null,
            },
          }),
        )
        global.document = {...document, body: actualBody}
      })

      test('by tab change the open menu will be closed and highlighted item will not be selected', () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        renderCombobox({
          isOpen: true,
          highlightedIndex: 0,
          stateReducer,
        })
        const input = getInput()

        fireEvent.blur(input, {relatedTarget: null}) // to simulate blur by tab change

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          {
            highlightedIndex: 0,
            inputValue: '',
            isOpen: true,
            selectedItem: null,
          },
          expect.objectContaining({
            type: stateChangeTypes.InputBlur,
            changes: {
              highlightedIndex: -1,
              inputValue: '',
              isOpen: false,
              selectedItem: null,
            },
          }),
        )
      })

      test('does nothing in environment is not defined', async () => {
        const initialHighlightedIndex = 2
        renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex,
          environment: undefined,
        })

        await tab()

        expect(getItems()).toHaveLength(items.length)
        expect(getInput()).not.toHaveValue()
      })
    })

    test('on focus does nothing', async () => {
      renderCombobox()

      await tab()

      expect(getItems()).toHaveLength(0)
    })

    describe('on click', () => {
      test('it opens the menu', async () => {
        renderCombobox()

        await clickOnInput()

        expect(getItems()).toHaveLength(items.length)
      })

      test('it closes the open menu', async () => {
        renderCombobox({initialIsOpen: true})

        await clickOnInput()

        expect(getItems()).toHaveLength(0)
      })

      test('toggles the menu', async () => {
        renderCombobox()

        await clickOnInput()

        expect(getItems()).toHaveLength(items.length)

        await clickOnInput()

        expect(getItems()).toHaveLength(0)

        await clickOnInput()

        expect(getItems()).toHaveLength(items.length)
      })

      test('it opens the menu with selected option highlighted', async () => {
        const selectedIndex = 4
        renderCombobox({
          initialSelectedItem: items[selectedIndex],
        })

        await clickOnInput()

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(selectedIndex),
        )
      })

      test('it opens the closed menu at initialHighlightedIndex, but on first click only', async () => {
        const initialHighlightedIndex = 2
        renderCombobox({
          initialHighlightedIndex,
        })
        const input = getInput()

        await clickOnInput()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        await clickOnInput()
        await clickOnInput()

        expect(input).toHaveAttribute('aria-activedescendant', '')
      })

      test('it opens the closed menu at defaultHighlightedIndex, on every click', async () => {
        const defaultHighlightedIndex = 3
        renderCombobox({
          defaultHighlightedIndex,
        })
        const input = getInput()

        await clickOnInput()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )

        await clickOnInput()
        await clickOnInput()

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('initialHighlightedIndex is ignored if item is disabled', async () => {
        const initialHighlightedIndex = 2
        const isItemDisabled = jest
          .fn()
          .mockImplementation(
            item => items.indexOf(item) === initialHighlightedIndex,
          )
        renderCombobox({
          initialHighlightedIndex,
          isItemDisabled,
        })

        await clickOnInput()

        expect(getInput()).toHaveAttribute('aria-activedescendant', '')
        expect(isItemDisabled).toHaveBeenNthCalledWith(
          1,
          items[initialHighlightedIndex],
          initialHighlightedIndex,
        )
      })

      test('initialHighlightedIndex is ignored and defaultHighlightedIndex is chosen if enabled', async () => {
        const initialHighlightedIndex = 0
        const defaultHighlightedIndex = 2
        renderCombobox({
          initialHighlightedIndex,
          defaultHighlightedIndex,
          isItemDisabled(item) {
            return items.indexOf(item) === initialHighlightedIndex
          },
        })

        await clickOnInput()

        expect(getInput()).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('defaultHighlightedIndex is ignored if item is disabled', async () => {
        const defaultHighlightedIndex = 2
        const isItemDisabled = jest
          .fn()
          .mockImplementation(
            item => items.indexOf(item) === defaultHighlightedIndex,
          )
        renderCombobox({
          defaultHighlightedIndex,
          isItemDisabled,
        })

        await clickOnInput()

        expect(getInput()).toHaveAttribute('aria-activedescendant', '')
        expect(isItemDisabled).toHaveBeenNthCalledWith(
          1,
          items[defaultHighlightedIndex],
          defaultHighlightedIndex,
        )
      })

      test('both defaultHighlightedIndex and initialHighlightedIndex are ignored if items are disabled', async () => {
        const initialHighlightedIndex = 0
        const defaultHighlightedIndex = 2
        renderCombobox({
          initialHighlightedIndex,
          defaultHighlightedIndex,
          isItemDisabled(item) {
            return [initialHighlightedIndex, defaultHighlightedIndex].includes(
              items.indexOf(item),
            )
          },
        })

        await clickOnInput()

        expect(getInput()).toHaveAttribute('aria-activedescendant', '')
      })
    })
  })

  describe('non production errors', () => {
    beforeEach(() => {
      // usually it is disabled by test utils.
      const {useGetterPropsCalledChecker} = jest.requireActual('../../utils')
      jest
        .spyOn(utils, 'useGetterPropsCalledChecker')
        .mockImplementation(useGetterPropsCalledChecker)
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    test('will be displayed if getInputProps is not called', () => {
      renderHook(() => {
        const {getMenuProps} = useCombobox({items})
        getMenuProps({}, {suppressRefError: true})
      })

      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: You forgot to call the getInputProps getter function on your component / element.`,
      )
    })

    test('will not be displayed if getInputProps is not called on subsequent renders', () => {
      let firstRender = true
      const {rerender} = renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({
          items,
        })
        getMenuProps({}, {suppressRefError: true})

        // eslint-disable-next-line jest/no-if, jest/no-conditional-in-test
        if (firstRender) {
          firstRender = false
          getInputProps({}, {suppressRefError: true})
        }
      })

      rerender()

      expect(console.error).not.toHaveBeenCalled()
    })

    test('will be displayed if element ref is not set and suppressRefError is false', () => {
      renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({
          items,
        })

        getMenuProps({}, {suppressRefError: true})
        getInputProps()
      })

      expect(console.error.mock.calls[0][0]).toMatchInlineSnapshot(
        `downshift: The ref prop "ref" from getInputProps was not applied correctly on your element.`,
      )
    })

    test('will not be displayed if element ref is not set and suppressRefError is true', () => {
      renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({
          items,
        })

        getMenuProps({}, {suppressRefError: true})
        getInputProps({}, {suppressRefError: true})
      })

      expect(console.error).not.toHaveBeenCalled()
    })

    test('will not be displayed if called with a correct ref', () => {
      const refFn = jest.fn()
      const inputNode = {}

      renderHook(() => {
        const {getInputProps, getMenuProps} = useCombobox({
          items,
        })

        getMenuProps({}, {suppressRefError: true})

        const {ref} = getInputProps({
          ref: refFn,
        })
        ref(inputNode)
      })

      expect(console.error).not.toHaveBeenCalled()
    })
  })
})
