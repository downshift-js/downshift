import {getInitialValue} from '../getInitialValue'

test('getInitialValue will not return undefined as initial value', () => {
  const defaultStateValues = {bogusValue: 'hello', initialBogusValue: undefined}
  const props = {initialBogusValue: undefined}
  const value = getInitialValue(props, 'bogusValue', defaultStateValues)

  expect(value).toEqual(defaultStateValues.bogusValue)
})

test('getInitialValue will not return undefined as value', () => {
  const defaultStateValues = {bogusValue: 'hello'}
  const props = {bogusValue: undefined}
  const value = getInitialValue(props, 'bogusValue', defaultStateValues)

  expect(value).toEqual(defaultStateValues.bogusValue)
})

test('getInitialValue will return the value if it is defined', () => {
  const defaultStateValues = {bogusValue: 'hello'}
  const props = {bogusValue: 'hi'}
  const value = getInitialValue(props, 'bogusValue', defaultStateValues)

  expect(value).toEqual(props.bogusValue)
})

test('getInitialValue will return the initial value if it is defined', () => {
  const defaultStateValues = {bogusValue: 'hello'}
  const props = {initialBogusValue: 'hi', bogusValue: undefined}
  const value = getInitialValue(props, 'bogusValue', defaultStateValues)

  expect(value).toEqual(props.initialBogusValue)
})