import {act} from '@testing-library/react-hooks'
import {cleanup} from '@testing-library/react'
import {items, renderUseSelect} from '../testUtils'

describe('returnProps', () => {
  afterEach(cleanup)

  describe('prop getters', () => {
    test('are returned as functions', () => {
      const {result} = renderUseSelect()

      expect(result.current.getMenuProps).toBeInstanceOf(Function)
      expect(result.current.getItemProps).toBeInstanceOf(Function)
      expect(result.current.getLabelProps).toBeInstanceOf(Function)
      expect(result.current.getToggleButtonProps).toBeInstanceOf(Function)
    })
  })

  describe('actions', () => {
    test('openMenu opens the closed menu', () => {
      const {result} = renderUseSelect()

      act(() => {
        result.current.openMenu()
      })

      expect(result.current.isOpen).toBe(true)
    })

    test('openMenu does nothing to open menu', () => {
      const {result} = renderUseSelect({initialIsOpen: true})

      act(() => {
        result.current.openMenu()
      })

      expect(result.current.isOpen).toBe(true)
    })

    test('closeMenu closes the open menu', () => {
      const {result} = renderUseSelect({initialIsOpen: true})

      act(() => {
        result.current.closeMenu()
      })

      expect(result.current.isOpen).toBe(false)
    })

    test('closeMenu does nothing to closed menu', () => {
      const {result} = renderUseSelect()

      act(() => {
        result.current.closeMenu()
      })

      expect(result.current.isOpen).toBe(false)
    })

    test('toggleMenu opens closed menu', () => {
      const {result} = renderUseSelect({})

      act(() => {
        result.current.toggleMenu()
      })

      expect(result.current.isOpen).toBe(true)
    })

    test('toggleMenu closes open menu', () => {
      const {result} = renderUseSelect({initialIsOpen: true})

      act(() => {
        result.current.toggleMenu()
      })

      expect(result.current.isOpen).toBe(false)
    })

    test('setHighlightedIndex sets highlightedIndex', () => {
      const {result} = renderUseSelect({initialIsOpen: true})

      act(() => {
        result.current.setHighlightedIndex(2)
      })

      expect(result.current.highlightedIndex).toBe(2)
    })

    test('selectItem sets selectedItem', () => {
      const {result} = renderUseSelect()

      act(() => {
        result.current.selectItem(items[2])
      })

      expect(result.current.selectedItem).toBe(items[2])
    })

    test('reset sets the state to default values', () => {
      const {result} = renderUseSelect()

      act(() => {
        result.current.openMenu()
        result.current.selectItem(items[2])
        result.current.setHighlightedIndex(3)
        result.current.reset()
      })

      expect(result.current.selectedItem).toBe(null)
      expect(result.current.highlightedIndex).toBe(-1)
      expect(result.current.isOpen).toBe(false)
      expect(result.current.inputValue).toBe('')
    })

    test('reset sets the state to default prop values passed by user', () => {
      const props = {
        defaultIsOpen: false,
        defaultHighlightedIndex: 3,
        defaultSelectedItem: items[2],
      }
      const {result} = renderUseSelect(props)

      act(() => {
        result.current.openMenu()
        result.current.selectItem(items[4])
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
      const {result} = renderUseSelect({highlightedIndex: 4})

      expect(result.current.highlightedIndex).toBe(4)
    })

    test('isOpen is returned', () => {
      const {result} = renderUseSelect({isOpen: false})

      expect(result.current.isOpen).toBe(false)
    })

    test('selectedItem is returned', () => {
      const {result} = renderUseSelect({selectedItem: items[1]})

      expect(result.current.selectedItem).toBe(items[1])
    })

    test('inputValue is returned', () => {
      const {result} = renderUseSelect({inputValue: 'bla'})

      expect(result.current.inputValue).toBe('bla')
    })
  })
})
