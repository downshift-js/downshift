import {getDefaultValue} from '../getDefaultValue'

test('getDefaultValue will not return undefined as value', () => {
  const defaultStateValues = {bogusValue: 'hello'}
  const props = {defaultBogusValue: undefined, bogusValue: undefined}

  const value = getDefaultValue(props, 'bogusValue', defaultStateValues)

  expect(value).toEqual(defaultStateValues.bogusValue)
})

test('getDefaultValue will return the default value if it is defined', () => {
  const defaultStateValues = {bogusValue: 'hello'}
  const props = {defaultBogusValue: 'hi', bogusValue: undefined}

  const value = getDefaultValue(props, 'bogusValue', defaultStateValues)

  expect(value).toEqual(props.defaultBogusValue)
})

