import {renderUseSelect, renderMemoizedSelect} from '../testUtils'
import {items, defaultIds} from '../../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseSelect()
  const firstRenderResult = result.current
  rerender()
  const secondRenderResult = result.current
  expect(firstRenderResult).toEqual(secondRenderResult)
})


test('will skip disabled items after component rerenders and items are memoized', () => {
  const {keyDownOnMenu, menu, rerender} = renderMemoizedSelect({
    isOpen: true,
    initialHighlightedIndex: items.length - 1,
  })

  rerender();
  keyDownOnMenu('ArrowUp')

  expect(menu).toHaveAttribute(
    'aria-activedescendant',
    defaultIds.getItemId(items.length - 3),
  )
})
