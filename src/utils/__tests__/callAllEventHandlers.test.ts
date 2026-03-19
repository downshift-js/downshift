import * as React from 'react'

import {callAllEventHandlers} from '../callAllEventHandlers'

test('calls all event handlers in order', () => {
  const fn1 = jest.fn()
  const fn2 = jest.fn()
  const fn3 = jest.fn()

  const handler = callAllEventHandlers(fn1, fn2, fn3)
  const event = new Event(
    'click',
  ) as unknown as React.SyntheticEvent<HTMLButtonElement>
  handler(event)

  expect(fn1).toHaveBeenCalledWith(event)
  expect(fn2).toHaveBeenCalledWith(event)
  expect(fn3).toHaveBeenCalledWith(event)
})

test('stops calling event handlers if preventDownshiftDefault is set', () => {
  const fn1 = jest.fn(event => {
    event.preventDownshiftDefault = true
  })
  const fn2 = jest.fn()
  const fn3 = jest.fn()

  const handler = callAllEventHandlers(fn1, fn2, fn3)
  const event = new Event(
    'click',
  ) as unknown as React.SyntheticEvent<HTMLButtonElement>
  handler(event)

  expect(fn1).toHaveBeenCalledWith(event)
  expect(fn2).not.toHaveBeenCalled()
  expect(fn3).not.toHaveBeenCalled()
})

test('stops calling event handlers if nativeEvent.preventDownshiftDefault is set', () => {
  const fn1 = jest.fn(event => {
    event.nativeEvent.preventDownshiftDefault = true
  })
  const fn2 = jest.fn()
  const fn3 = jest.fn()

  const handler = callAllEventHandlers(fn1, fn2, fn3)
  const nativeEvent = new Event('click')
  const event = {
    ...nativeEvent,
    nativeEvent,
  } as unknown as React.SyntheticEvent<HTMLButtonElement>
  handler(event)

  expect(fn1).toHaveBeenCalledWith(event)
  expect(fn2).not.toHaveBeenCalled()
  expect(fn3).not.toHaveBeenCalled()
})

test('does not call handlers if they are nullish', () => {
  const fn1 = jest.fn()
  const handler = callAllEventHandlers(
    fn1,
    undefined,
    null as unknown as Function,
  )
  const event = new Event(
    'click',
  ) as unknown as React.SyntheticEvent<HTMLButtonElement>
  handler(event)

  expect(fn1).toHaveBeenCalledWith(event)
})
