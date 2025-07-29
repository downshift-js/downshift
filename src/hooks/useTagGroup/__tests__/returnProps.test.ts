import useTagGroup from '..'
import {renderUseTagGroup, act, defaultProps} from '../testUtils'

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
