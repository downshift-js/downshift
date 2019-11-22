import {act} from '@testing-library/react-hooks'
import {cleanup} from '@testing-library/react'
import {noop} from '../../../utils'
import {items, setupHook} from '../testUtils'
import {defaultStateValues} from '../utils'

describe('returnProps', () => {
  afterEach(cleanup)

  describe('prop getters', () => {
    test('are returned as functions', () => {
      const {result} = setupHook()

      expect(result.current.getMenuProps).toBeInstanceOf(Function)
      expect(result.current.getItemProps).toBeInstanceOf(Function)
      expect(result.current.getLabelProps).toBeInstanceOf(Function)
      expect(result.current.getToggleButtonProps).toBeInstanceOf(Function)
      expect(result.current.getInputProps).toBeInstanceOf(Function)
      expect(result.current.getComboboxProps).toBeInstanceOf(Function)
    })
  })

  describe('actions', () => {
    test('openMenu opens the closed menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
      })
      expect(result.current.isOpen).toBe(true)
    })

    test('openMenu does nothing to open menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.openMenu()
      })
      expect(result.current.isOpen).toBe(true)
    })

    test('closeMenu closes the open menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.closeMenu()
      })
      expect(result.current.isOpen).toBe(false)
    })

    test('closeMenu does nothing to closed menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.closeMenu()
      })

      expect(result.current.isOpen).toBe(false)
    })

    test('toggleMenu opens closed menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.toggleMenu()
      })

      expect(result.current.isOpen).toBe(true)
    })

    test('toggleMenu closes open menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.toggleMenu()
      })

      expect(result.current.isOpen).toBe(false)
    })

    test('setHighlightedIndex sets highlightedIndex', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.setHighlightedIndex(2)
      })

      expect(result.current.highlightedIndex).toBe(2)
    })

    test('setInputValue sets inputValue', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.setInputValue("I'm Batman!")
      })

      expect(result.current.inputValue).toBe("I'm Batman!")
    })

    test('selectItem sets selectedItem', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.selectItem(items[2])
      })

      expect(result.current.selectedItem).toBe(items[2])
    })

    test('reset sets the state to default values', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.selectItem(items[2])
        result.current.setHighlightedIndex(3)
        result.current.setInputValue('bla-blu')
        result.current.reset()
      })

      expect(result.current.selectedItem).toBe(defaultStateValues.selectedItem)
      expect(result.current.highlightedIndex).toBe(
        defaultStateValues.highlightedIndex,
      )
      expect(result.current.inputValue).toBe(defaultStateValues.inputValue)
      expect(result.current.isOpen).toBe(defaultStateValues.isOpen)
    })

    test('reset sets the state to default prop values passed by user', () => {
      const props = {
        defaultIsOpen: false,
        defaultHighlightedIndex: 3,
        defaultSelectedItem: items[2],
        defaultInputValue: 'my-default',
      }
      const {result} = setupHook(props)

      act(() => {
        const {ref: inputRef} = result.current.getInputProps()
        inputRef({focus: noop})
        result.current.openMenu()
        result.current.selectItem(items[4])
        result.current.setHighlightedIndex(1)
        result.current.setInputValue('something different')
        result.current.reset()
      })

      expect(result.current.selectedItem).toBe(props.defaultSelectedItem)
      expect(result.current.highlightedIndex).toBe(
        props.defaultHighlightedIndex,
      )
      expect(result.current.isOpen).toBe(props.defaultIsOpen)
      expect(result.current.inputValue).toBe(props.defaultInputValue)
    })
  })

  describe('state and props', () => {
    test('highlightedIndex is returned', () => {
      const {result} = setupHook({highlightedIndex: 4})

      expect(result.current.highlightedIndex).toBe(4)
    })

    test('isOpen is returned', () => {
      const {result} = setupHook({isOpen: false})

      expect(result.current.isOpen).toBe(false)
    })

    test('selectedItem is returned', () => {
      const {result} = setupHook({selectedItem: items[1]})

      expect(result.current.selectedItem).toBe(items[1])
    })
  })
})
