import {pickState} from '../utils'

test('pickState only picks state that downshift cares about', () => {
  const otherStateToSet = {
    isOpen: true,
    foo: 0,
  }
  const result = pickState(otherStateToSet)
  const expected = {isOpen: true}
  const resultKeys = Object.keys(result)
  const expectedKeys = Object.keys(expected) 
  resultKeys.sort()
  expectedKeys.sort()
  expect(result).toEqual(expected)
  expect(resultKeys).toEqual(expectedKeys)
})
