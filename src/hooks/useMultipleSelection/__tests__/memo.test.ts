import {renderUseMultipleSelection} from '../testUtils'

test('functions are memoized', () => {
  const {result, rerender} = renderUseMultipleSelection()
  const firstRenderResult = result.current.getDropdownProps
  rerender()
  const secondRenderResult = result.current.getDropdownProps
  expect(firstRenderResult).toEqual(secondRenderResult)
})
