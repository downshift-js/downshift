import {getChildrenFn} from '../utils'

test('gets the given function', () => {
  const fn = () => {}
  expect(getChildrenFn(fn)).toBe(fn)
})

test('gets the given function in an array', () => {
  const fn = () => {}
  expect(getChildrenFn([fn])).toBe(fn)
})

test('returns a noop function if it is given nothing', () => {
  expect(typeof getChildrenFn()).toBe('function')
})

test('returns a noop function if it is not given a function', () => {
  expect(typeof getChildrenFn('blah')).toBe('function')
})
