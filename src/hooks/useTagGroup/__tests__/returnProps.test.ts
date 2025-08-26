import useTagGroup from '..'
import {renderUseTagGroup, act, defaultProps} from './utils'

import * as stateChangeTypes from '../stateChangeTypes'

describe('returnProps', () => {
  test('should have stateChangeTypes attached to hook', () => {
    expect(useTagGroup).toHaveProperty('stateChangeTypes', stateChangeTypes)
  })

  describe('prop getters', () => {
    test('are returned as functions', () => {
      const {result} = renderUseTagGroup()

      expect(result.current.getTagGroupProps).toBeInstanceOf(Function)
      expect(result.current.getTagProps).toBeInstanceOf(Function)
      expect(result.current.getTagRemoveProps).toBeInstanceOf(Function)
    })
  })

  describe('actions', () => {
    test('addItem adds an item to the group', () => {
      const {result} = renderUseTagGroup()

      const previousItems = result.current.items

      act(() => {
        result.current.addItem('test')
      })

      expect(result.current.items).toEqual([...previousItems, 'test'])
    })

    test('addItem keeps the active item if previously set', () => {
      const {result} = renderUseTagGroup({initialActiveIndex: 2})

      act(() => {
        result.current.addItem('test')
      })

      expect(result.current.activeIndex).toEqual(2)
    })

    test('addItem makes the last item active if there is no previous active item', () => {
      const {result} = renderUseTagGroup({initialActiveIndex: -1})

      act(() => {
        result.current.addItem('test')
      })

      expect(result.current.activeIndex).toEqual(result.current.items.length - 1)
    })

    test('addItem adds an item to the group at the index specified', () => {
      const {result} = renderUseTagGroup()

      const previousItems = result.current.items

      act(() => {
        result.current.addItem('test', 0)
      })

      expect(result.current.items).toEqual(['test', ...previousItems])
    })
  })

  describe('state and props', () => {
    test('activeIndex is returned', () => {
      const {result} = renderUseTagGroup()

      expect(result.current.activeIndex).toBe(
        defaultProps.initialItems.length - 1,
      )
    })

    test('items is returned', () => {
      const {result} = renderUseTagGroup()

      expect(result.current.items).toBe(defaultProps.initialItems)
    })
  })
})
