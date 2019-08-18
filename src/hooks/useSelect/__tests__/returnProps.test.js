import {act} from '@testing-library/react-hooks'
import {cleanup} from '@testing-library/react'
import {noop} from '../../utils'
import {options, setupHook} from '../testUtils'
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
    })
  })

  describe('actions', () => {
    test('openMenu opens the closed menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.openMenu()
      })
      expect(result.current.isOpen).toBe(true)
    })

    test('openMenu does nothing to open menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.openMenu()
        result.current.openMenu()
      })
      expect(result.current.isOpen).toBe(true)
    })

    test('closeMenu closes the open menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        const {ref: toggleButtonRef} = result.current.getToggleButtonProps()
        toggleButtonRef({focus: noop})
        result.current.openMenu()
        result.current.closeMenu()
      })
      expect(result.current.isOpen).toBe(false)
    })

    test('closeMenu does nothing to closed menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        const {ref: toggleButtonRef} = result.current.getToggleButtonProps()
        toggleButtonRef({focus: noop})
        result.current.closeMenu()
      })

      expect(result.current.isOpen).toBe(false)
    })

    test('toggleMenu opens closed menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.toggleMenu()
      })

      expect(result.current.isOpen).toBe(true)
    })

    test('toggleMenu closes open menu', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: toggleButtonRef} = result.current.getToggleButtonProps()
        toggleButtonRef({focus: noop})
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.openMenu()
        result.current.toggleMenu()
      })

      expect(result.current.isOpen).toBe(false)
    })

    test('setHighlightedIndex sets highlightedIndex', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.openMenu()
        result.current.setHighlightedIndex(2)
      })

      expect(result.current.highlightedIndex).toBe(2)
    })

    test('setSelectedItem sets selectedItem', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.openMenu()
        result.current.setSelectedItem(options[2])
      })

      expect(result.current.selectedItem).toBe(options[2])
    })

    test('reset sets the state to default values', () => {
      const {result} = setupHook({})

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.openMenu()
        result.current.setSelectedItem(options[2])
        result.current.setHighlightedIndex(3)
        result.current.reset()
      })

      expect(result.current.selectedItem).toBe(defaultStateValues.selectedItem)
      expect(result.current.highlightedIndex).toBe(
        defaultStateValues.highlightedIndex,
      )
      expect(result.current.isOpen).toBe(defaultStateValues.isOpen)
    })

    test('reset sets the state to default prop values passed by user', () => {
      const props = {
        defaultIsOpen: false,
        defaultHighlightedIndex: 3,
        defaultSelectedItem: options[2],
      }
      const {result} = setupHook(props)

      act(() => {
        const {ref: menuRef} = result.current.getMenuProps()
        menuRef({focus: noop})
        result.current.openMenu()
        result.current.setSelectedItem(options[4])
        result.current.setHighlightedIndex(1)
        result.current.reset()
      })

      expect(result.current.selectedItem).toBe(props.defaultSelectedItem)
      expect(result.current.highlightedIndex).toBe(
        props.defaultHighlightedIndex,
      )
      expect(result.current.isOpen).toBe(props.defaultIsOpen)
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
      const {result} = setupHook({selectedItem: options[1]})

      expect(result.current.selectedItem).toBe(options[1])
    })

    test('items is returned', () => {
      const {result} = setupHook({items: ['1', '2']})

      expect(result.current.items).toEqual(['1', '2'])
    })
  })
})
