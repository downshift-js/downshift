import {getInitialValue} from '../getInitialValue'

test('returns the default value if all other values are undefined', () => {
  const value = getInitialValue(undefined, undefined, undefined, 'ciao')

  expect(value).toEqual('ciao')
})

test('returns the controlled prop value if it is defined', () => {
  const value = getInitialValue('hello', 'hi', 'ola', 'ciao')

  expect(value).toEqual('hello')
})

test('returns the initial value if it is defined', () => {
  const value = getInitialValue(undefined, 'hi', 'ola', 'ciao')

  expect(value).toEqual('hi')
})

test('returns the default value if it is defined', () => {
  const value = getInitialValue(undefined, undefined, 'ola', 'ciao')

  expect(value).toEqual('ola')
})
