import {getItemAndIndex} from '../getItemAndIndex'

test('returns the props if both are passed', () => {
  const item = {hi: 'hello'}
  const index = 5

  expect(getItemAndIndex(item, index, [item], 'bla')).toEqual([item, index])
})

test('throws error when index is not passed and item is not found in the array', () => {
  const item = {hi: 'hello'}
  const errorMessage = 'no item found'

  expect(() => getItemAndIndex(item, undefined, [], errorMessage)).toThrow(
    errorMessage,
  )
})

test('returns the item and the index found', () => {
  const item = {hi: 'hello'}

  expect(getItemAndIndex(item, undefined, [item], 'bla')).toEqual([item, 0])
})

test('throws error when item is not passed and item is not found in the array', () => {
  const item = {hi: 'hello'}
  const errorMessage = 'no item found at index'

  expect(() =>
    getItemAndIndex(undefined, 1, [item], errorMessage),
  ).toThrow(errorMessage)
})

test('returns the index and the item found', () => {
  const item = {hi: 'hello'}
  const index = 0

  expect(getItemAndIndex(undefined, index, [item], 'bla')).toEqual([item, 0])
})

test('throws error when both index and item are not passed', () => {
  const errorMessage = 'it is all wrong'
  
  expect(() =>
    getItemAndIndex(undefined, undefined, [{item: 'bla'}], errorMessage),
  ).toThrow(errorMessage)
})
