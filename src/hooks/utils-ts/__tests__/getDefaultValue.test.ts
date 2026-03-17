import {getDefaultValue} from '../getDefaultValue'

test('getDefaultValue returns defaultStateValue when defaultProp is undefined', () => {
  const defaultStateValue = 'defaultState'
  const result = getDefaultValue(undefined, defaultStateValue)
  expect(result).toBe(defaultStateValue)
})

test('getDefaultValue returns defaultProp when it is defined', () => {
  const defaultProp = 'defaultProp'
  const defaultStateValue = 'defaultState'
  const result = getDefaultValue(defaultProp, defaultStateValue)
  expect(result).toBe(defaultProp)
})

test('getDefaultValue returns defaultProp even when is null', () => {
  const defaultStateValue = 'defaultState'
  const result = getDefaultValue(null, defaultStateValue)
  expect(result).toBe(null)
})

test('getDefaultValue returns defaultStateValue even when null', () => {
  const result = getDefaultValue(undefined, null)
  expect(result).toBe(null)
})
