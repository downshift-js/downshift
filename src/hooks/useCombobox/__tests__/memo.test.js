import {renderUseCombobox} from '../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseCombobox()
  const firstRenderResult = result.current
  rerender()
  const secondRenderResult = result.current
  expect(firstRenderResult).toEqual(secondRenderResult)
})
