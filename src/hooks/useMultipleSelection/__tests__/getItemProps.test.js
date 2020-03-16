import {act} from '@testing-library/react-hooks'

import {renderUseMultipleSelection} from '../testUtils'
import {items} from '../../testUtils'

describe('getItemProps', () => {
  describe('hook props', () => {
    test("assign '-1' to tabindex for a non-active item", () => {
      const {result} = renderUseMultipleSelection()
      const itemProps = result.current.getItemProps({index: 0, item: items[0]})

      expect(itemProps.tabIndex).toEqual(-1)
    })

    test("assign '0' to tabindex for an active item", () => {
      const {result} = renderUseMultipleSelection({activeIndex: 0})
      const itemProps = result.current.getItemProps({index: 0, item: items[0]})

      expect(itemProps.tabIndex).toEqual(0)
    })
  })

  describe('user props', () => {
    test('are passed down', () => {
      const {result} = renderUseMultipleSelection()

      expect(
        result.current.getItemProps({index: 1, item: items[1], foo: 'bar'}),
      ).toHaveProperty('foo', 'bar')
    })

    test('custom ref passed by the user is used', () => {
      const {result} = renderUseMultipleSelection()
      const refFn = jest.fn()
      const itemNode = {}

      act(() => {
        const {ref} = result.current.getItemProps({
          index: 1,
          item: items[1],
          ref: refFn,
        })

        ref(itemNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(itemNode)
    })

    test('custom ref with custom name passed by the user is used', () => {
      const {result} = renderUseMultipleSelection()
      const refFn = jest.fn()
      const itemNode = {}

      act(() => {
        const {blablaRef} = result.current.getItemProps({
          index: 1,
          item: items[1],
          refKey: 'blablaRef',
          blablaRef: refFn,
        })

        blablaRef(itemNode)
      })

      expect(refFn).toHaveBeenCalledTimes(1)
      expect(refFn).toHaveBeenCalledWith(itemNode)
    })

    test('event handler onClick is called along with downshift handler', () => {
      const userOnClick = jest.fn()
      const {result} = renderUseMultipleSelection({
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onClick} = result.current.getItemProps({
          index: 1,
          item: items[1],
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(1)
    })

    test("event handler onClick is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnClick = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseMultipleSelection({
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onClick} = result.current.getItemProps({
          index: 1,
          item: items[1],
          onClick: userOnClick,
        })

        onClick({})
      })

      expect(userOnClick).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(-1)
    })

    test('event handler onKeyDown is called along with downshift handler', () => {
      const userOnKeyDown = jest.fn()
      const {result} = renderUseMultipleSelection({
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onKeyDown} = result.current.getItemProps({
          index: 1,
          item: items[1],
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowLeft'})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(0)
    })

    test("event handler onKeyDown is called without downshift handler if 'preventDownshiftDefault' is passed in user event", () => {
      const userOnKeyDown = jest.fn(event => {
        event.preventDownshiftDefault = true
      })
      const {result} = renderUseMultipleSelection({
        initialItems: [items[0], items[1]],
      })

      act(() => {
        const {onKeyDown} = result.current.getItemProps({
          index: 1,
          item: items[1],
          onKeyDown: userOnKeyDown,
        })

        onKeyDown({key: 'ArrowLeft'})
      })

      expect(userOnKeyDown).toHaveBeenCalledTimes(1)
      expect(result.current.activeIndex).toBe(-1)
    })
  })
})
