/* eslint-disable jest/no-disabled-tests */
import {act as rtlAct} from '@testing-library/react-hooks'
import {fireEvent, cleanup} from '@testing-library/react'
import {noop} from '../../../utils'
import {setup, setupHook, defaultIds, dataTestIds, items} from '../testUtils'

describe('getInputProps', () => {
  afterEach(cleanup)

  describe('hook props', () => {
    test('assign default value to id', () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps()

      expect(inputProps.id).toEqual(defaultIds.inputId)
    })

    test('assign custom value passed by user to id', () => {
      const props = {
        inputId: 'my-custom-input-id',
      }
      const {result} = setupHook(props)
      const inputProps = result.current.getInputProps()

      expect(inputProps.id).toEqual(props.inputId)
    })

    test("assign 'list' to 'aria-autocomplete'", () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-autocomplete']).toEqual('list')
    })

    test("assign 'off' to autoComplete", () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps()

      expect(inputProps.autoComplete).toEqual('off')
    })

    test('assign default value to aria-controls', () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-controls']).toEqual(`${defaultIds.menuId}`)
    })

    test('assign custom value passed by user to aria-controls', () => {
      const props = {
        menuId: 'my-custom-menu-id',
      }
      const {result} = setupHook(props)
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-controls']).toEqual(`${props.menuId}`)
    })

    test('assign id of highlighted item to aria-activedescendant if item is highlighted', () => {
      const {result} = setupHook({highlightedIndex: 2})
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-activedescendant']).toEqual(
        defaultIds.getItemId(2),
      )
    })

    test('do not assign aria-activedescendant if no item is highlighted', () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-activedescendant']).toBeUndefined()
    })

    test('assign default value to aria-labelledby', () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-labelledby']).toEqual(`${defaultIds.labelId}`)
    })

    test('assign custom value passed by user to aria-labelledby', () => {
      const props = {
        labelId: 'my-custom-label-id',
      }
      const {result} = setupHook(props)
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-labelledby']).toEqual(`${props.labelId}`)
    })

    test("handlers are not called if it's disabled", () => {
      const {result} = setupHook()
      const inputProps = result.current.getInputProps({
        disabled: true,
      })

      expect(inputProps.onChange).toBeUndefined()
      expect(inputProps.onKeyDown).toBeUndefined()
      expect(inputProps.onBlur).toBeUndefined()
      expect(inputProps.disabled).toBe(true)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = setupHook()

      expect(result.current.getInputProps({foo: 'bar'})).toHaveProperty(
        'foo',
        'bar',
      )
    })

    test('custom ref passed by the user is used', () => {
      const {result} = setupHook()
      const focus = jest.fn()

      rtlAct(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus})
        result.current.toggleMenu()
      })

      expect(focus).toHaveBeenCalledTimes(1)
    })

    test('custom ref with custom name passed by the user is used', () => {
      const {result} = setupHook()
      const focus = jest.fn()

      rtlAct(() => {
        const {blablaRef} = result.current.getInputProps({refKey: 'blablaRef'})
        blablaRef({focus})
        result.current.toggleMenu()
      })

      expect(focus).toHaveBeenCalledTimes(1)
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = setupHook()

      rtlAct(() => {
        const {ref: inputRef, onKeyDown} = result.current.getInputProps({
          onKeyDown: userOnKeyDown,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onKeyDown({key: 'Escape', preventDefault: noop})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(false)
    })

    test("event handler onKeyDown is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnKeyDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = setupHook()

      rtlAct(() => {
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
      const {result} = setupHook()

      rtlAct(() => {
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
      const {result} = setupHook()

      rtlAct(() => {
        const {ref: inputRef, onBlur} = result.current.getInputProps({
          onBlur: userOnBlur,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onBlur({key: 'Escape', preventDefault: noop})
      })

      expect(userOnBlur).toHaveBeenCalledTimes(1)
      expect(result.current.isOpen).toBe(true)
    })

    test('event handler onChange is called along with downshift handler', () => {
      const userOnChange = jest.fn()
      const {result} = setupHook()

      rtlAct(() => {
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
      const {result} = setupHook()

      rtlAct(() => {
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
      const {result} = setupHook()

      rtlAct(() => {
        const {ref: inputRef, onChange} = result.current.getInputProps({
          onChange: userOnInput,
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
      const {result} = setupHook()

      rtlAct(() => {
        const {ref: inputRef, onChange} = result.current.getInputProps({
          onChange: userOnInput,
        })

        inputRef({focus: noop})
        result.current.toggleMenu()
        onChange({target: {value: 'a'}})
      })

      expect(userOnInput).toHaveBeenCalledTimes(1)
      expect(result.current.inputValue).toBe('')
    })
  })

  describe('initial focus', () => {
    test('is grabbed when isOpen is passed as true', () => {
      const wrapper = setup({isOpen: true})
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(document.activeElement).toBe(input)
    })

    test('is grabbed when initialIsOpen is passed as true', () => {
      const wrapper = setup({initialIsOpen: true})
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(document.activeElement).toBe(input)
    })

    test('is grabbed when defaultIsOpen is passed as true', () => {
      const wrapper = setup({defaultIsOpen: true})
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(document.activeElement).toBe(input)
    })

    test('is not grabbed when initial open is set to default (false)', () => {
      const wrapper = setup({})
      const input = wrapper.getByTestId(dataTestIds.input)

      expect(document.activeElement).not.toBe(input)
    })
  })

  describe('event handlers', () => {
    describe('on key down', () => {
      describe('character key', () => {
        test('should update the value of the input', () => {
          const wrapper = setup({isOpen: true})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.change(input, {target: {value: 'c'}})
          expect(input.value).toBe('c')

          fireEvent.change(input, {target: {value: 'ca'}})
          expect(input.value).toBe('ca')
        })
      })

      describe('arrow up', () => {
        test('it opens the menu and highlights the last option', () => {
          const wrapper = setup()
          const input = wrapper.getByTestId(dataTestIds.input)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(input, {key: 'ArrowUp'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(items.length - 1),
          )
          expect(menu.childNodes).toHaveLength(items.length)
        })

        test('it highlights the last option number if none is highlighted', () => {
          const wrapper = setup({isOpen: true})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowUp'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('it highlights the previous item', () => {
          const initialHighlightedIndex = 2
          const wrapper = setup({isOpen: true, initialHighlightedIndex})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowUp'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(initialHighlightedIndex - 1),
          )
        })

        test('with shift it highlights the 5th previous item', () => {
          const initialHighlightedIndex = 6
          const wrapper = setup({isOpen: true, initialHighlightedIndex})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {
            key: 'ArrowUp',
            shiftKey: true,
          })

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(initialHighlightedIndex - 5),
          )
        })

        test('with shift it highlights the last item if not enough items remaining', () => {
          const initialHighlightedIndex = 1
          const wrapper = setup({isOpen: true, initialHighlightedIndex})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {
            key: 'ArrowUp',
            shiftKey: true,
          })

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('will stop at 0 if circularNavigatios is false', () => {
          const wrapper = setup({
            isOpen: true,
            initialHighlightedIndex: 0,
            circularNavigation: false,
          })
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowUp'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
        })

        test('will continue from 0 to last item if circularNavigatios is default', () => {
          const wrapper = setup({
            isOpen: true,
            initialHighlightedIndex: 0,
          })
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowUp'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(items.length - 1),
          )
        })
      })

      describe('arrow down', () => {
        test("it opens the menu and highlights option number '0'", () => {
          const wrapper = setup()
          const input = wrapper.getByTestId(dataTestIds.input)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
          expect(menu.childNodes).toHaveLength(items.length)
        })

        // ToDo: Figure out why it triggers Blur on second ArrowDown
        test.skip('it opens the menu and highlights initialHighlightedIndex only once', () => {
          const wrapper = setup({initialHighlightedIndex: 2})
          const input = wrapper.getByTestId(dataTestIds.input)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(2),
          )
          expect(menu.childNodes).toHaveLength(items.length)

          fireEvent.keyDown(input, {key: 'Escape'})
          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
          expect(menu.childNodes).toHaveLength(items.length)
        })

        // ToDo: Figure out why it triggers Blur on second ArrowDown
        test.skip('it opens the menu and highlights defaultHighlightedIndex always', () => {
          const wrapper = setup({defaultHighlightedIndex: 2})
          const input = wrapper.getByTestId(dataTestIds.input)
          const menu = wrapper.getByTestId(dataTestIds.menu)

          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(2),
          )
          expect(menu.childNodes).toHaveLength(items.length)

          fireEvent.keyDown(input, {key: 'Escape'})
          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(2),
          )
          expect(menu.childNodes).toHaveLength(items.length)
        })

        test("it highlights option number '0' if none is highlighted", () => {
          const wrapper = setup({isOpen: true})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
        })

        test('it highlights the next item', () => {
          const initialHighlightedIndex = 2
          const wrapper = setup({isOpen: true, initialHighlightedIndex})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(initialHighlightedIndex + 1),
          )
        })

        test('with shift it highlights the next 5th item', () => {
          const initialHighlightedIndex = 2
          const wrapper = setup({isOpen: true, initialHighlightedIndex})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {
            key: 'ArrowDown',
            shiftKey: true,
          })

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(initialHighlightedIndex + 5),
          )
        })

        test('with shift it highlights first item if not enough next items remaining', () => {
          const initialHighlightedIndex = items.length - 2
          const wrapper = setup({isOpen: true, initialHighlightedIndex})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {
            key: 'ArrowDown',
            shiftKey: true,
          })

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
        })

        test('will stop at last item if circularNavigatios is false', () => {
          const wrapper = setup({
            isOpen: true,
            initialHighlightedIndex: items.length - 1,
            circularNavigation: false,
          })
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('will continue from last item to 0 if circularNavigatios is default', () => {
          const wrapper = setup({
            isOpen: true,
            initialHighlightedIndex: items.length - 1,
          })
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.keyDown(input, {key: 'ArrowDown'})

          expect(input.getAttribute('aria-activedescendant')).toBe(
            defaultIds.getItemId(0),
          )
        })
      })

      test('end it highlights the last option number', () => {
        const wrapper = setup({isOpen: true, initialHighlightedIndex: 2})
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.keyDown(input, {key: 'End'})

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(items.length - 1),
        )
      })

      test('home it highlights the first option number', () => {
        const wrapper = setup({isOpen: true, initialHighlightedIndex: 2})
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.keyDown(input, {key: 'Home'})

        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(0),
        )
      })

      test('escape it has the menu closed, item removed and focused kept on input', () => {
        const wrapper = setup({
          initialIsOpen: true,
          initialHighlightedIndex: 2,
          initialSelectedItem: items[0],
        })
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.keyDown(input, {key: 'Escape'})

        expect(input.childNodes).toHaveLength(0)
        expect(input.value).toBe('')
        expect(document.activeElement).toBe(input)
      })

      test('enter it closes the menu and selects highlighted item', () => {
        const initialHighlightedIndex = 2
        const wrapper = setup({
          initialIsOpen: true,
          initialHighlightedIndex,
        })
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.keyDown(input, {key: 'Enter'})

        expect(input.childNodes).toHaveLength(0)
        expect(input.value).toEqual(items[initialHighlightedIndex])
      })

      test('enter selects highlighted item and resets to user defaults', () => {
        const defaultHighlightedIndex = 2
        const wrapper = setup({
          defaultHighlightedIndex,
          defaultIsOpen: true,
        })
        const menu = wrapper.getByTestId(dataTestIds.menu)
        const input = wrapper.getByTestId(dataTestIds.input)

        fireEvent.keyDown(input, {key: 'Enter'})

        expect(input.value).toEqual(items[defaultHighlightedIndex])
        expect(menu.childNodes).toHaveLength(items.length)
        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test("other than the ones supported don't affect anything", () => {
        const wrapper = setup({
          initialIsOpen: true,
          initialHighlightedIndex: 2,
          initialSelectedItem: items[2],
        })
        const input = wrapper.getByTestId(dataTestIds.input)
        const menu = wrapper.getByTestId(dataTestIds.menu)

        fireEvent.keyDown(input, {key: 'Alt'})
        fireEvent.keyDown(input, {key: 'Control'})

        expect(document.activeElement).toBe(input)
        expect(input.value).toEqual(items[2])
        expect(input.getAttribute('aria-activedescendant')).toBe(
          defaultIds.getItemId(2),
        )
        expect(menu.childNodes).toHaveLength(items.length)
      })

      describe('on blur', () => {
        test('the open menu will be closed and highlighted item will be selected', () => {
          const initialHighlightedIndex = 2
          const wrapper = setup({
            initialIsOpen: true,
            initialHighlightedIndex,
          })
          const menu = wrapper.getByTestId(dataTestIds.menu)
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.blur(input)

          expect(menu.childNodes).toHaveLength(0)
          expect(input.value).toEqual(items[initialHighlightedIndex])
        })

        test('the open menu will be closed and highlighted item will not be selected if the highlight by mouse leaves the menu', () => {
          const initialHighlightedIndex = 2
          const wrapper = setup({
            initialIsOpen: true,
            initialHighlightedIndex,
          })
          const menu = wrapper.getByTestId(dataTestIds.menu)
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.mouseLeave(menu)
          fireEvent.blur(input)

          expect(menu.childNodes).toHaveLength(0)
          expect(input.value).toEqual('')
        })

        test('the value in the input will stay the same', () => {
          const wrapper = setup({initialIsOpen: true})
          const input = wrapper.getByTestId(dataTestIds.input)

          fireEvent.change(input, {target: {value: 'bla'}})
          fireEvent.blur(input)

          expect(input.value).toBe('bla')
        })
      })
    })
  })
})
