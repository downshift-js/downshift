import React from 'react'
import {
  renderUseCombobox,
  renderCombobox,
  getInput,
  keyDownOnInput,
} from '../testUtils'
import {items, defaultIds, MemoizedItem} from '../../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseCombobox()
  const firstRenderResult = result.current
  rerender()
  const secondRenderResult = result.current
  expect(firstRenderResult).toEqual(secondRenderResult)
})

test('will skip disabled items after component rerenders and items are memoized', async () => {
  function renderItem(props) {
    return <MemoizedItem key={props.index} {...props} />
  }
  function isItemDisabled(_item, index) {
    return index === items.length - 2
  }

  const {rerender} = renderCombobox({
    isItemDisabled,
    isOpen: true,
    initialHighlightedIndex: items.length - 1,
    renderItem,
  })

  rerender({renderItem, isOpen: true, isItemDisabled})
  await keyDownOnInput('{ArrowUp}')

  expect(getInput()).toHaveAttribute(
    'aria-activedescendant',
    defaultIds.getItemId(items.length - 3),
  )
})
