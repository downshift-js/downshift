import {act} from '@testing-library/react-hooks'

import {renderUseMultipleSelection} from '../testUtils'
import * as stateChangeTypes from '../stateChangeTypes'
import useMultipleSelection from '..'

describe('returnProps', () => {
  test('should have stateChangeTypes attached to hook', () => {
    expect(useMultipleSelection).toHaveProperty(
      'stateChangeTypes',
      stateChangeTypes,
    )
  })

  describe('prop getters', () => {
    test('are returned as functions', () => {
      const {result} = renderUseMultipleSelection()

      expect(result.current.getDropdownProps).toBeInstanceOf(Function)
      expect(result.current.getSelectedItemProps).toBeInstanceOf(Function)
    })
  })

  describe('actions', () => {
    test('addSelectedItem adds an item to the selected array', () => {
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.addSelectedItem('test')
      })

      expect(result.current.selectedItems).toStrictEqual(['test'])
    })

    test('removeSelectedItem removes an item from the selected array and keeps active index if not last item', () => {
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: ['test', 'more test'],
        initialActiveIndex: 0,
      })

      act(() => {
        result.current.removeSelectedItem('test')
      })

      expect(result.current.selectedItems).toStrictEqual(['more test'])
      expect(result.current.activeIndex).toEqual(0)
    })

    test('removeSelectedItem removes an item from the selected array and decreases active index if last item', () => {
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: ['test', 'more test'],
        initialActiveIndex: 1,
      })

      act(() => {
        result.current.removeSelectedItem('more test')
      })

      expect(result.current.selectedItems).toStrictEqual(['test'])
      expect(result.current.activeIndex).toEqual(0)
    })

    test('removeSelectedItem handles undefined item without modifying the selected array or the active index', () => {
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: ['test', 'more test'],
        initialActiveIndex: 1,
      })

      act(() => {
        result.current.removeSelectedItem(undefined)
      })

      expect(result.current.selectedItems).toStrictEqual(['test', 'more test'])
      expect(result.current.activeIndex).toEqual(1)
    })

    test('removeSelectedItem handles null item without modifying the selected array or the active index', () => {
      const {result} = renderUseMultipleSelection({
        initialSelectedItems: ['test', 'more test'],
        initialActiveIndex: 1,
      })

      act(() => {
        result.current.removeSelectedItem(null)
      })

      expect(result.current.selectedItems).toStrictEqual(['test', 'more test'])
      expect(result.current.activeIndex).toEqual(1)
    })

    test('setActiveIndex sets activeIndex', () => {
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.setActiveIndex(3)
      })

      expect(result.current.activeIndex).toBe(3)
    })

    test('setSelectedItems sets selectedItems', () => {
      const inputItems = [1, 2, 3]
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.setSelectedItems(inputItems)
      })

      expect(result.current.selectedItems).toBe(inputItems)
    })

    test('reset sets the state to default values', () => {
      const {result} = renderUseMultipleSelection()

      act(() => {
        result.current.setSelectedItems([1, 2, 3])
        result.current.setActiveIndex(5)
        result.current.reset()
      })

      expect(result.current.activeIndex).toBe(-1)
      expect(result.current.selectedItems).toStrictEqual([])
    })

    test('reset sets the state to default prop values passed by user', () => {
      const {result} = renderUseMultipleSelection({
        defaultSelectedItems: [3, 4],
        defaultActiveIndex: 0,
      })

      act(() => {
        result.current.setSelectedItems([1, 2])
        result.current.setActiveIndex(1)
        result.current.reset()
      })

      expect(result.current.activeIndex).toBe(0)
      expect(result.current.selectedItems).toStrictEqual([3, 4])
    })
  })

  describe('state and props', () => {
    test('activeIndex is returned', () => {
      const {result} = renderUseMultipleSelection({activeIndex: 4})

      expect(result.current.activeIndex).toBe(4)
    })

    test('selectedItems is returned', () => {
      const itemsInput = [1, 2, 3]
      const {result} = renderUseMultipleSelection({selectedItems: itemsInput})

      expect(result.current.selectedItems).toBe(itemsInput)
    })
  })
})
