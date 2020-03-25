import {act} from '@testing-library/react-hooks'

import {renderUseMultipleSelection} from '../testUtils'

describe('returnProps', () => {
  describe('prop getters', () => {
    test('are returned as functions', () => {
      const {result} = renderUseMultipleSelection()

      expect(result.current.getDropdownProps).toBeInstanceOf(Function)
      expect(result.current.getItemProps).toBeInstanceOf(Function)
    })
  })

  describe('actions', () => {
    test('addItem adds an item to the selected array', () => {
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.addItem('test')
      })

      expect(result.current.items).toStrictEqual(['test'])
    })

    test('removeItem removes an item from the selected array and keeps active index if not last item', () => {
      const {result} = renderUseMultipleSelection({
        initialItems: ['test', 'more test'],
        initialActiveIndex: 0,
      })

      act(() => {
        result.current.removeItem('test')
      })

      expect(result.current.items).toStrictEqual(['more test'])
      expect(result.current.activeIndex).toEqual(0)
    })

    test('removeItem removes an item from the selected array and decreases active index if last item', () => {
      const {result} = renderUseMultipleSelection({
        initialItems: ['test', 'more test'],
        initialActiveIndex: 1,
      })

      act(() => {
        result.current.removeItem('more test')
      })

      expect(result.current.items).toStrictEqual(['test'])
      expect(result.current.activeIndex).toEqual(0)
    })

    test('setActiveIndex sets activeIndex', () => {
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.setActiveIndex(3)
      })

      expect(result.current.activeIndex).toBe(3)
    })

    test('setItems sets items', () => {
      const inputItems = [1, 2, 3]
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.setItems(inputItems)
      })

      expect(result.current.items).toBe(inputItems)
    })

    test('reset sets the state to default values', () => {
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.setItems([1, 2, 3])
        result.current.setActiveIndex(5)
        result.current.reset()
      })

      expect(result.current.activeIndex).toBe(-1)
      expect(result.current.items).toStrictEqual([])
    })

    test('reset sets the state to default prop values passed by user', () => {
      const {result} = renderUseMultipleSelection({
        defaultItems: [3, 4],
        defaultActiveIndex: 0,
      })

      act(() => {
        result.current.setItems([1, 2])
        result.current.setActiveIndex(1)
        result.current.reset()
      })

      expect(result.current.activeIndex).toBe(0)
      expect(result.current.items).toStrictEqual([3, 4])
    })
  })

  describe('state and props', () => {
    test('activeIndex is returned', () => {
      const {result} = renderUseMultipleSelection({activeIndex: 4})

      expect(result.current.activeIndex).toBe(4)
    })

    test('items is returned', () => {
      const itemsInput = [1, 2, 3]
      const {result} = renderUseMultipleSelection({items: itemsInput})

      expect(result.current.items).toBe(itemsInput)
    })
  })
})
