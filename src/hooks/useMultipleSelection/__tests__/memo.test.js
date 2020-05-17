import {renderUseMultipleSelection} from '../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseMultipleSelection()
  const firstRenderResult = result.current
  rerender()
  const secondRenderResult = result.current
  expect(firstRenderResult).toEqual(secondRenderResult)
})
