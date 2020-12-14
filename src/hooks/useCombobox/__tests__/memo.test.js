import {renderUseCombobox, renderMemoizedCombobox} from '../testUtils'
import {items, defaultIds} from '../../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseCombobox()
  const firstRenderResult = result.current
  rerender()
  const secondRenderResult = result.current
  expect(firstRenderResult).toEqual(secondRenderResult)
})

test('will skip disabled items after component rerenders and items are memoized', () => {
  const {keyDownOnInput, input, rerender} = renderMemoizedCombobox({
    isOpen: true,
    initialHighlightedIndex: items.length - 1,
  })

  rerender();
  keyDownOnInput('ArrowUp')

  expect(input).toHaveAttribute(
    'aria-activedescendant',
    defaultIds.getItemId(items.length - 3),
  )
})
