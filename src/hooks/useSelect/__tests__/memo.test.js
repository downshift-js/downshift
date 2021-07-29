import React from 'react'
import {renderUseSelect, renderSelect} from '../testUtils'
import {items, defaultIds, MemoizedItem} from '../../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseSelect()
  const firstRenderResult = result.current
  rerender()
  const secondRenderResult = result.current
  expect(firstRenderResult).toEqual(secondRenderResult)
})

test('will skip disabled items after component rerenders and items are memoized', () => {
  function renderItem(props) {
    return (
      <MemoizedItem
        key={props.index}
        disabled={props.index === items.length - 2}
        {...props}
      />
    )
  }

  const {keyDownOnMenu, menu, rerender} = renderSelect({
    isOpen: true,
    initialHighlightedIndex: items.length - 1,
    renderItem,
  })

  rerender({renderItem, isOpen: true})
  keyDownOnMenu('ArrowUp')

  expect(menu).toHaveAttribute(
    'aria-activedescendant',
    defaultIds.getItemId(items.length - 3),
  )
})
