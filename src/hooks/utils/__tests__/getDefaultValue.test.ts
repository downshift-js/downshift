import {getDefaultValue} from '../getDefaultValue'

test('getDefaultValue will not return undefined as value', () => {
  const value = getDefaultValue(undefined, 'hello')

  expect(value).toEqual('hello')
})

test('getDefaultValue will return the default value if it is defined', () => {
  const value = getDefaultValue('hi', 'hello')

  expect(value).toEqual('hi')
})

