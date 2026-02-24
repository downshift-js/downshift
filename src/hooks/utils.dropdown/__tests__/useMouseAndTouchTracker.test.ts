import {renderHook} from '@testing-library/react'
import {useMouseAndTouchTracker} from '../useMouseAndTouchTracker'
import {Environment} from '../../../index.types'

test('renders without error', () => {
  expect(() => {
    renderHook(() => useMouseAndTouchTracker(undefined, jest.fn(), []))
  }).not.toThrow()
})

test('adds and removes listeners to environment', () => {
  const environment = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  } as unknown as Environment
  const elements = [{}, {}] as unknown as Array<{current: HTMLElement}>
  const handleBlur = jest.fn()
  const initialProps = {environment, handleBlur, elements}

  const {unmount, rerender, result} = renderHook(
    props =>
      useMouseAndTouchTracker(
        props.environment,
        props.handleBlur,
        props.elements,
      ),
    {initialProps},
  )

  const addEventListenerMock = jest.mocked(environment.addEventListener)
  const removeEventListenerMock = jest.mocked(environment.removeEventListener)

  expect(addEventListenerMock).toHaveBeenCalledTimes(5)
  expect(removeEventListenerMock).not.toHaveBeenCalled()
  expect(addEventListenerMock.mock.calls).toMatchSnapshot(
    'initial adding events',
  )

  addEventListenerMock.mockReset()
  removeEventListenerMock.mockReset()
  rerender(initialProps)

  expect(removeEventListenerMock).not.toHaveBeenCalled()
  expect(addEventListenerMock).not.toHaveBeenCalled()

  rerender({...initialProps, elements: [...elements]})

  expect(addEventListenerMock).toHaveBeenCalledTimes(5)
  expect(removeEventListenerMock).toHaveBeenCalledTimes(5)
  expect(addEventListenerMock.mock.calls).toMatchSnapshot(
    'element change rerender adding events',
  )
  expect(removeEventListenerMock.mock.calls).toMatchSnapshot(
    'element change rerender remove events',
  )

  addEventListenerMock.mockReset()
  removeEventListenerMock.mockReset()

  unmount()

  expect(addEventListenerMock).not.toHaveBeenCalled()
  expect(removeEventListenerMock).toHaveBeenCalledTimes(5)
  expect(removeEventListenerMock.mock.calls).toMatchSnapshot(
    'unmount remove events',
  )

  expect(result.current).toEqual({
    isMouseDown: false,
    isTouchMove: false,
    isTouchEnd: false,
  })
})
