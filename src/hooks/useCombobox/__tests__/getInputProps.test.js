/* eslint-disable jest/no-disabled-tests */
import * as React from 'react'
import {act} from '@testing-library/react-hooks'
import {fireEvent, cleanup} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stateChangeTypes from '../stateChangeTypes'
import {noop} from '../../../utils'
import {renderUseCombobox, renderCombobox} from '../testUtils'
import {items, defaultIds} from '../../testUtils'

describe('getInputProps', () => {
  afterEach(cleanup)

  describe('hook props', () => {
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

      expect(inputProps['aria-activedescendant']).toBeUndefined()
    })

    test('do not assign aria-activedescendant if no item is highlighted', () => {
      const {result} = renderUseCombobox()
      const inputProps = result.current.getInputProps()

      expect(inputProps['aria-activedescendant']).toBeUndefined()
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

    test("handlers are not called if it's disabled", () => {
      const {result} = renderUseCombobox()
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

      act(() => {
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
      const {result} = renderUseCombobox()

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
        onBlur({key: 'Escape', preventDefault: noop})
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
      const {result} = renderUseCombobox()

      act(() => {
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
      const {input} = renderCombobox({isOpen: true})

      expect(input).toHaveFocus()
    })

    test('is grabbed when initialIsOpen is passed as true', () => {
      const {input} = renderCombobox({initialIsOpen: true})

      expect(input).toHaveFocus()
    })

    test('is grabbed when defaultIsOpen is passed as true', () => {
      const {input} = renderCombobox({defaultIsOpen: true})

      expect(input).toHaveFocus()
    })

    test('is not grabbed when initial open is set to default (false)', () => {
      const {input} = renderCombobox()

      expect(input).not.toHaveFocus()
    })
  })

  describe('event handlers', () => {
    test('on change should open the menu and keep the input value', async () => {
      const {changeInputValue, getItems, input} = renderCombobox()

      await changeInputValue('california')

      expect(getItems()).toHaveLength(items.length)
      expect(input).toHaveValue('california')
    })

    describe('on key down', () => {
      describe('arrow up', () => {
        test('it does not open or highlight anything if there are no options', () => {
          const {keyDownOnInput, getItems, input} = renderCombobox({items: []})

          keyDownOnInput('ArrowUp')

          expect(input).not.toHaveAttribute('aria-activedescendant')
          expect(getItems()).toHaveLength(0)
        })

        test('it does not highlight anything if there are no options', () => {
          const {keyDownOnInput, getItems, input} = renderCombobox({
            items: [],
            isOpen: true,
          })

          keyDownOnInput('ArrowUp')

          expect(input).not.toHaveAttribute('aria-activedescendant')
          expect(getItems()).toHaveLength(0)
        })

        test('it opens the menu and highlights the last option', () => {
          const {keyDownOnInput, getItems, input} = renderCombobox()

          keyDownOnInput('ArrowUp')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('it highlights the last option number if none is highlighted', () => {
          const {keyDownOnInput, input} = renderCombobox({isOpen: true})

          keyDownOnInput('ArrowUp')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('it highlights the previous item', () => {
          const initialHighlightedIndex = 2
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          keyDownOnInput('ArrowUp')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex - 1),
          )
        })

        test('with shift it highlights the 5th previous item', () => {
          const initialHighlightedIndex = 6
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          keyDownOnInput('ArrowUp', {shiftKey: true})

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex - 5),
          )
        })

        test('with shift it highlights the last item if not enough items remaining', () => {
          const initialHighlightedIndex = 1
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          keyDownOnInput('ArrowUp', {shiftKey: true})

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('will stop at 0 if circularNavigatios is false', () => {
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex: 0,
            circularNavigation: false,
          })

          keyDownOnInput('ArrowUp')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('will continue from 0 to last item if circularNavigatios is default', () => {
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex: 0,
          })

          keyDownOnInput('ArrowUp')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })
      })

      describe('arrow down', () => {
        test('it does not opne on highlight anything if there are no options', () => {
          const {keyDownOnInput, getItems, input} = renderCombobox({items: []})

          keyDownOnInput('ArrowDown')

          expect(input).not.toHaveAttribute('aria-activedescendant')
          expect(getItems()).toHaveLength(0)
        })

        test('it does not highlight anything if there are no options', () => {
          const {keyDownOnInput, getItems, input} = renderCombobox({
            items: [],
            isOpen: true,
          })

          keyDownOnInput('ArrowDown')

          expect(input).not.toHaveAttribute('aria-activedescendant')
          expect(getItems()).toHaveLength(0)
        })

        test("it opens the menu and highlights option number '0'", () => {
          const {input, keyDownOnInput, getItems} = renderCombobox()

          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('it opens the menu and highlights initialHighlightedIndex only once', () => {
          const initialHighlightedIndex = 2
          const {keyDownOnInput, input, getItems} = renderCombobox({
            initialHighlightedIndex,
          })

          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex),
          )
          expect(getItems()).toHaveLength(items.length)

          keyDownOnInput('Escape')
          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test('it opens the menu and highlights defaultHighlightedIndex always', () => {
          const defaultHighlightedIndex = 2
          const {keyDownOnInput, input, getItems} = renderCombobox({
            defaultHighlightedIndex,
          })

          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
          expect(getItems()).toHaveLength(items.length)

          keyDownOnInput('Escape')
          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(defaultHighlightedIndex),
          )
          expect(getItems()).toHaveLength(items.length)
        })

        test("it highlights option number '0' if none is highlighted", () => {
          const {keyDownOnInput, input} = renderCombobox({isOpen: true})

          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('it highlights the next item', () => {
          const initialHighlightedIndex = 2
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex + 1),
          )
        })

        test('with shift it highlights the next 5th item', () => {
          const initialHighlightedIndex = 2
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          keyDownOnInput('ArrowDown', {shiftKey: true})

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(initialHighlightedIndex + 5),
          )
        })

        test('with shift it highlights first item if not enough next items remaining', () => {
          const initialHighlightedIndex = items.length - 2
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex,
          })

          keyDownOnInput('ArrowDown', {shiftKey: true})

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })

        test('will stop at last item if circularNavigatios is false', () => {
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex: items.length - 1,
            circularNavigation: false,
          })

          keyDownOnInput('ArrowDown', {shiftKey: true})

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(items.length - 1),
          )
        })

        test('will continue from last item to 0 if circularNavigatios is default', () => {
          const {keyDownOnInput, input} = renderCombobox({
            isOpen: true,
            initialHighlightedIndex: items.length - 1,
          })

          keyDownOnInput('ArrowDown')

          expect(input).toHaveAttribute(
            'aria-activedescendant',
            defaultIds.getItemId(0),
          )
        })
      })

      test('end it highlights the last option number', () => {
        const {keyDownOnInput, input} = renderCombobox({
          isOpen: true,
          initialHighlightedIndex: 2,
        })

        keyDownOnInput('End')

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(items.length - 1),
        )
      })

      test('home it highlights the first option number', () => {
        const {keyDownOnInput, input} = renderCombobox({
          isOpen: true,
          initialHighlightedIndex: 2,
        })

        keyDownOnInput('Home')

        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(0),
        )
      })

      test('escape it has the menu closed, item removed and focused kept on input', () => {
        const {keyDownOnInput, input, getItems} = renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex: 2,
          initialSelectedItem: items[0],
        })

        keyDownOnInput('Escape')

        expect(getItems()).toHaveLength(0)
        expect(input.value).toBe('')
        expect(input).toHaveFocus()
      })

      test('enter it closes the menu and selects highlighted item', () => {
        const initialHighlightedIndex = 2
        const {keyDownOnInput, input, getItems} = renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        keyDownOnInput('Enter')

        expect(getItems()).toHaveLength(0)
        expect(input.value).toEqual(items[initialHighlightedIndex])
      })

      test('enter selects highlighted item and resets to user defaults', () => {
        const defaultHighlightedIndex = 2
        const {keyDownOnInput, input, getItems} = renderCombobox({
          defaultHighlightedIndex,
          defaultIsOpen: true,
        })

        keyDownOnInput('Enter')

        expect(input.value).toEqual(items[defaultHighlightedIndex])
        expect(getItems()).toHaveLength(items.length)
        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(defaultHighlightedIndex),
        )
      })

      test('enter while IME composing will not select highlighted item', () => {
        const initialHighlightedIndex = 2
        const {keyDownOnInput, input, getItems} = renderCombobox({
          initialHighlightedIndex,
          initialIsOpen: true,
        })

        keyDownOnInput('Enter', {keyCode: 229})

        expect(input.value).toEqual('')
        expect(getItems()).toHaveLength(items.length)
        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(initialHighlightedIndex),
        )

        keyDownOnInput('Enter')

        expect(input.value).toEqual(items[2])
        expect(getItems()).toHaveLength(0)
        expect(input).not.toHaveAttribute('aria-activedescendant')
      })

      test('enter on an input with a closed menu does nothing', () => {
        const {keyDownOnInput, renderSpy} = renderCombobox({
          initialHighlightedIndex: 2,
          initialIsOpen: false,
        })
        expect(renderSpy).toHaveBeenCalledTimes(1)
        keyDownOnInput('Enter')
        expect(renderSpy).toHaveBeenCalledTimes(1)
      })

      test('enter on an input with an open menu does nothing without a highlightedIndex', () => {
        const {keyDownOnInput, renderSpy} = renderCombobox({
          initialIsOpen: true,
        })
        expect(renderSpy).toHaveBeenCalledTimes(1)
        keyDownOnInput('Enter')
        expect(renderSpy).toHaveBeenCalledTimes(1)
      })

      test('tab it closes the menu and selects highlighted item', () => {
        const initialHighlightedIndex = 2
        const {input, getItems} = renderCombobox(
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

        userEvent.tab()

        expect(getItems()).toHaveLength(0)
        expect(input.value).toEqual(items[initialHighlightedIndex])
      })

      test('shift+tab it closes the menu', () => {
        const initialHighlightedIndex = 2
        const {input, getItems} = renderCombobox(
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

        userEvent.tab()

        expect(getItems()).toHaveLength(0)
        expect(input.value).toEqual(items[initialHighlightedIndex])
      })

      test("other than the ones supported don't affect anything", () => {
        const highlightedIndex = 2
        const {keyDownOnInput, input, getItems} = renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex: highlightedIndex,
          initialSelectedItem: items[highlightedIndex],
        })

        keyDownOnInput('Alt')
        keyDownOnInput('Control')

        expect(input).toHaveFocus()
        expect(input.value).toEqual(items[highlightedIndex])
        expect(input).toHaveAttribute(
          'aria-activedescendant',
          defaultIds.getItemId(highlightedIndex),
        )
        expect(getItems()).toHaveLength(items.length)
      })
    })

    describe('on blur', () => {
      test('the open menu will be closed and highlighted item will be selected', () => {
        const initialHighlightedIndex = 2
        const {input, getItems, blurInput} = renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        blurInput()

        expect(getItems()).toHaveLength(0)
        expect(input.value).toEqual(items[initialHighlightedIndex])
      })

      test('the open menu will be closed and highlighted item will not be selected if the highlight by mouse leaves the menu', () => {
        const initialHighlightedIndex = 2
        const {blurInput, mouseLeaveMenu, getItems, input} = renderCombobox({
          initialIsOpen: true,
          initialHighlightedIndex,
        })

        mouseLeaveMenu()
        blurInput()

        expect(getItems()).toHaveLength(0)
        expect(input.value).toEqual('')
      })

      test('the value in the input will stay the same', async () => {
        const inputValue = 'test me'
        const {blurInput, changeInputValue, input} = renderCombobox({
          initialIsOpen: true,
        })

        await changeInputValue(inputValue)
        blurInput()

        expect(input.value).toBe(inputValue)
      })

      test('by mouse is not triggered if target is within downshift', () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        const {input, container} = renderCombobox({
          isOpen: true,
          stateReducer,
        })
        document.body.appendChild(container)

        fireEvent.mouseDown(input)
        fireEvent.mouseUp(input)

        expect(stateReducer).not.toHaveBeenCalled()

        fireEvent.mouseDown(document.body)
        fireEvent.mouseUp(document.body)

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          expect.objectContaining({}),
          expect.objectContaining({type: stateChangeTypes.InputBlur}),
        )
      })

      test('by touch is not triggered if target is within downshift', () => {
        const stateReducer = jest.fn().mockImplementation(s => s)
        const {container, input} = renderCombobox({
          isOpen: true,
          stateReducer,
        })
        document.body.appendChild(container)

        fireEvent.touchStart(input)
        fireEvent.touchMove(input)
        fireEvent.touchEnd(input)

        expect(stateReducer).not.toHaveBeenCalled()

        fireEvent.touchStart(document.body)
        fireEvent.touchEnd(document.body)

        expect(stateReducer).toHaveBeenCalledTimes(1)
        expect(stateReducer).toHaveBeenCalledWith(
          expect.objectContaining({}),
          expect.objectContaining({type: stateChangeTypes.InputBlur}),
        )
      })
    })
  })
})
