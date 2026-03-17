import {getInitialValue} from '../getInitialValue'

test('getInitialValue will return the controlled value if it is not undefined', () => {
  const value = getInitialValue(
    'value',
    'initialValue',
    'defaultValue',
    'defaultStateValue',
  )

  expect(value).toBe('value')
})

test('getInitialValue will return the initialValue if value is undefined', () => {
  const value = getInitialValue(
    undefined,
    'initialValue',
    'defaultValue',
    'defaultStateValue',
  )

  expect(value).toBe('initialValue')
})

test('getInitialValue will return the defaultValue if value and initialValue are undefined', () => {
  const value = getInitialValue(
    undefined,
    undefined,
    'defaultValue',
    'defaultStateValue',
  )

  expect(value).toBe('defaultValue')
})

test('getInitialValue will return the defaultStateValue if value, initialValue and defaultValue are undefined', () => {
  const value = getInitialValue(
    undefined,
    undefined,
    undefined,
    'defaultStateValue',
  )

  expect(value).toBe('defaultStateValue')
})

test("getInitialValue will return the controlled value even if it's null", () => {
  const value = getInitialValue(
    null,
    'initialValue',
    'defaultValue',
    'defaultStateValue',
  )

  expect(value).toBe(null)
})

test('getInitialValue will return the initialValue if value is null', () => {
  const value = getInitialValue(
    undefined,
    null,
    'defaultValue',
    'defaultStateValue',
  )

  expect(value).toBe(null)
})

test('getInitialValue will return the defaultValue if value and initialValue are null', () => {
  const value = getInitialValue(undefined, undefined, null, 'defaultStateValue')

  expect(value).toBe(null)
})

test('getInitialValue will return the defaultStateValue if value, initialValue and defaultValue are null', () => {
  const value = getInitialValue(undefined, undefined, undefined, null)

  expect(value).toBe(null)
})
