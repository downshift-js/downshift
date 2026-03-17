import {getState} from '../getState'

test('returns state if no props are passed', () => {
  const state = {a: 'b'}

  expect(getState(state, undefined)).toEqual(state)
})

test('merges state with props', () => {
  const state = {a: 'b', c: 'd'}
  const props = {b: 'e', c: 'f'}

  expect(getState(state, props)).toEqual({a: 'b', c: 'f'})
})
