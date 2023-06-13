import React from 'react'
import {
  renderUseSelect,
  renderSelect,
  keyDownOnToggleButton,
  getToggleButton,
  items,
  defaultIds,
  MemoizedItem,
} from '../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseSelect()
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

  const {rerender} = renderSelect({
    isItemDisabled,
    isOpen: true,
    initialHighlightedIndex: items.length - 1,
    renderItem,
  })

  rerender({renderItem, isOpen: true, isItemDisabled})
  await keyDownOnToggleButton('{ArrowUp}')

  expect(getToggleButton()).toHaveAttribute(
    'aria-activedescendant',
    defaultIds.getItemId(items.length - 3),
  )
})
