import {composeEventHandlers} from '../utils'

test('prevent default handlers when defaultPrevented is true', () => {
  const customHandler = jest.fn(e => {
    e.defaultPrevented = true
  })
  const defaultHandler = jest.fn()

  const composedHandler = composeEventHandlers(customHandler, defaultHandler)

  composedHandler({})
  expect(customHandler).toHaveBeenCalledTimes(1)
  expect(defaultHandler).toHaveBeenCalledTimes(0)
})

test('prevent default handlers when defaultDownshiftPrevented is true', () => {
  const customHandler = jest.fn(e => {
    e.preventDownshiftDefault = true
  })
  const defaultHandler = jest.fn()

  const composedHandler = composeEventHandlers(customHandler, defaultHandler)

  composedHandler({})
  expect(customHandler).toHaveBeenCalledTimes(1)
  expect(defaultHandler).toHaveBeenCalledTimes(0)
})

test('call default handler when defaultDownshiftPrevented and defaultPrevented are false', () => {
  const customHandler = jest.fn()
  const defaultHandler = jest.fn()

  const composedHandler = composeEventHandlers(customHandler, defaultHandler)

  composedHandler({})
  expect(customHandler).toHaveBeenCalledTimes(1)
  expect(defaultHandler).toHaveBeenCalledTimes(1)
})
