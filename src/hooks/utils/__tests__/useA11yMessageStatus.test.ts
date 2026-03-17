import {renderHook} from '@testing-library/react'
import {useA11yMessageStatus} from '../useA11yMessageStatus'
import {setStatus, cleanupStatusDiv} from '../../../utils'

// eslint-disable-next-line no-var
var cancelMock: jest.Mock

jest.mock('../../../utils', () => {
  return {
    ...jest.requireActual('../../../utils'),
    debounce: (fn: Function) => {
      const debouncedFn = (...args: unknown[]) => fn(...args)
      debouncedFn.cancel = jest.fn()
      cancelMock = debouncedFn.cancel
      return debouncedFn
    },
    setStatus: jest.fn(),
    cleanupStatusDiv: jest.fn(),
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

test('useA11yMessageStatus returns the correct status message', () => {
  const getA11yStatusMessage = ({name}: {name: string}) => `Hello, ${name}!`
  const props = {name: 'test'}
  const {rerender} = renderHook(
    (currentProps: {name: string}) =>
      useA11yMessageStatus(
        getA11yStatusMessage,
        currentProps,
        [currentProps.name],
        {
          document: window.document,
        },
      ),
    {initialProps: props},
  )

  expect(setStatus).not.toHaveBeenCalled()

  props.name = 'billy'
  rerender({name: 'billy'})

  expect(setStatus).toHaveBeenCalledWith('Hello, billy!', window.document)
})

test('useA11yMessageStatus does not set status message if getA11yStatusMessage is not provided', () => {
  const props = {name: 'test'}
  const {rerender} = renderHook(
    (currentProps: {name: string}) =>
      useA11yMessageStatus(undefined, currentProps, [currentProps.name], {
        document: window.document,
      }),
    {initialProps: props},
  )

  expect(setStatus).not.toHaveBeenCalled()

  props.name = 'billy'
  rerender({name: 'billy'})

  expect(setStatus).not.toHaveBeenCalled()
})

test('useA11yMessageStatus does not set status message if document is not provided', () => {
  const props = {name: 'test'}
  const {rerender} = renderHook(
    (currentProps: {name: string}) =>
      useA11yMessageStatus(
        undefined,
        currentProps,
        [currentProps.name],
        undefined,
      ),
    {initialProps: props},
  )

  expect(setStatus).not.toHaveBeenCalled()

  props.name = 'billy'
  rerender({name: 'billy'})

  expect(setStatus).not.toHaveBeenCalled()
})

test('useA11yMessageStatus cancels debounced status update and cleans up status div on unmount', () => {
  const getA11yStatusMessage = ({name}: {name: string}) => `Hello, ${name}!`
  const props = {name: 'test'}
  const {unmount} = renderHook(
    (currentProps: {name: string}) =>
      useA11yMessageStatus(
        getA11yStatusMessage,
        currentProps,
        [currentProps.name],
        {
          document: window.document,
        },
      ),
    {initialProps: props},
  )

  unmount()

  expect(cancelMock).toHaveBeenCalledTimes(1)
  expect(cleanupStatusDiv).toHaveBeenCalledTimes(1)
  expect(cleanupStatusDiv).toHaveBeenCalledWith(window.document)
})
