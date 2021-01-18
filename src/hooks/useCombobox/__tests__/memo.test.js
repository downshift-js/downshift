import React from 'react'
import {renderUseCombobox, renderCombobox} from '../testUtils'
import {items, defaultIds, MemoizedItem} from '../../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseCombobox()
  const firstRenderResult = result.current
  rerender()
  const secondRenderResult = result.current
  expect(firstRenderResult).toEqual(secondRenderResult)
})

test('will skip disabled items after component rerenders and items are memoized', () => {
  function renderItem(props) {
    return (
      <MemoizedItem disabled={props.index === items.length - 2} {...props} />
    )
  }

  const {keyDownOnInput, input, rerender} = renderCombobox({
    isOpen: true,
    initialHighlightedIndex: items.length - 1,
    renderItem,
  })

  rerender({renderItem})
  keyDownOnInput('ArrowUp')

  expect(input).toHaveAttribute(
    'aria-activedescendant',
    defaultIds.getItemId(items.length - 3),
  )
})
