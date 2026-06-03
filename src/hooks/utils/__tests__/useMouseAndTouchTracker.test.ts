import {renderHook} from '@testing-library/react'
import {useMouseAndTouchTracker} from '../useMouseAndTouchTracker'
import {Environment} from '../../../downshift.types'
import {targetWithinDownshift} from '../../../utils'

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  targetWithinDownshift: jest.fn(),
}))

interface MockedEnvironment extends Environment {
  events: Record<string, Function[]>
  dispatchEvent: (event: string, ...args: unknown[]) => void
}

function getInitialProps() {
  return {
    environment: {
      removeEventListener: jest.fn(function removeListener(
        this: MockedEnvironment,
        event: string,
        handler: Function,
      ) {
        const handlers = this.events[event]

        if (!handlers?.length) {
          return
        }

        this.events[event] = handlers.filter(
          savedHandler => savedHandler === handler,
        )
      }),
      addEventListener: jest.fn(function addListener(
        this: MockedEnvironment,
        event: string,
        handler: Function,
      ) {
        if (!this.events[event]?.length) {
          this.events[event] = []
        }

        this.events[event].push(handler)
      }),
      events: {} as Record<string, Function[]>,
      dispatchEvent(event: string, ...args: unknown[]) {
        const handlers = this.events[event]
        if (!handlers?.length) {
          return
        }
        for (const handler of handlers) {
          handler(...args)
        }
      },
      document: {} as unknown as Document,
      Node,
    } as MockedEnvironment,
    handleBlur: jest.fn(),
    downshiftRefs: [],
  }
}

describe('useMouseAndTouchTracker', () => {
  let initialProps: ReturnType<typeof getInitialProps>
  beforeEach(() => {
    initialProps = getInitialProps()
    jest.clearAllMocks()
  })

  test('renders without error', () => {
    expect(() => {
      renderHook(() => useMouseAndTouchTracker(undefined, jest.fn(), []))
    }).not.toThrow()
  })

  test('adds listeners to the environment', () => {
    renderHook(
      props =>
        useMouseAndTouchTracker(
          props.environment,
          props.handleBlur,
          props.downshiftRefs,
        ),
      {initialProps},
    )

    expect(initialProps.environment.addEventListener).toHaveBeenCalledTimes(5)
    expect(initialProps.environment.addEventListener).toHaveBeenNthCalledWith(
      1,
      'mousedown',
      expect.any(Function),
    )
    expect(initialProps.environment.addEventListener).toHaveBeenNthCalledWith(
      2,
      'mouseup',
      expect.any(Function),
    )
    expect(initialProps.environment.addEventListener).toHaveBeenNthCalledWith(
      3,
      'touchstart',
      expect.any(Function),
    )
    expect(initialProps.environment.addEventListener).toHaveBeenNthCalledWith(
      4,
      'touchmove',
      expect.any(Function),
    )
    expect(initialProps.environment.addEventListener).toHaveBeenNthCalledWith(
      5,
      'touchend',
      expect.any(Function),
    )
    expect(initialProps.environment.removeEventListener).not.toHaveBeenCalled()
  })

  test('cleans up listeners from the environment on unmount', () => {
    const {unmount} = renderHook(
      props =>
        useMouseAndTouchTracker(
          props.environment,
          props.handleBlur,
          props.downshiftRefs,
        ),
      {initialProps},
    )

    unmount()
    expect(initialProps.environment.removeEventListener).toHaveBeenCalledTimes(
      5,
    )
    expect(
      initialProps.environment.removeEventListener,
    ).toHaveBeenNthCalledWith(1, 'mousedown', expect.any(Function))
    expect(
      initialProps.environment.removeEventListener,
    ).toHaveBeenNthCalledWith(2, 'mouseup', expect.any(Function))
    expect(
      initialProps.environment.removeEventListener,
    ).toHaveBeenNthCalledWith(3, 'touchstart', expect.any(Function))
    expect(
      initialProps.environment.removeEventListener,
    ).toHaveBeenNthCalledWith(4, 'touchmove', expect.any(Function))
    expect(
      initialProps.environment.removeEventListener,
    ).toHaveBeenNthCalledWith(5, 'touchend', expect.any(Function))
  })

  test('returns tracking information about mouse and touch', () => {
    const {result} = renderHook(
      props =>
        useMouseAndTouchTracker(
          props.environment,
          props.handleBlur,
          props.downshiftRefs,
        ).current,
      {initialProps},
    )

    expect(result.current).toEqual({
      isMouseDown: false,
      isTouchEnd: false,
      isTouchMove: false,
    })

    initialProps.environment.dispatchEvent('mousedown')
    expect(result.current).toEqual({
      isMouseDown: true,
      isTouchEnd: false,
      isTouchMove: false,
    })

    jest.mocked(targetWithinDownshift).mockReturnValue(false)
    initialProps.environment.dispatchEvent('mouseup', {} as EventTarget)
    expect(result.current).toEqual({
      isMouseDown: false,
      isTouchEnd: false,
      isTouchMove: false,
    })

    initialProps.environment.dispatchEvent('touchstart')
    expect(result.current).toEqual({
      isMouseDown: false,
      isTouchEnd: false,
      isTouchMove: false,
    })

    initialProps.environment.dispatchEvent('touchmove')
    expect(result.current).toEqual({
      isMouseDown: false,
      isTouchEnd: false,
      isTouchMove: true,
    })

    jest.mocked(targetWithinDownshift).mockReturnValue(false)
    initialProps.environment.dispatchEvent('touchend', {} as EventTarget)
    expect(result.current).toEqual({
      isMouseDown: false,
      isTouchEnd: true,
      isTouchMove: true,
    })
  })

  test('calls handleBlur if mouse up or touch end happens outside of downshift elements', () => {
    renderHook(
      props =>
        useMouseAndTouchTracker(
          props.environment,
          props.handleBlur,
          props.downshiftRefs,
        ),
      {initialProps},
    )

    jest.mocked(targetWithinDownshift).mockReturnValue(false)
    initialProps.environment.dispatchEvent('mouseup', {} as EventTarget)
    expect(initialProps.handleBlur).toHaveBeenCalledTimes(1)

    jest.mocked(targetWithinDownshift).mockReturnValue(false)
    initialProps.environment.dispatchEvent('touchend', {} as EventTarget)
    expect(initialProps.handleBlur).toHaveBeenCalledTimes(2)
  })

  test('does not call handleBlur if mouse up or touch end happens inside of downshift elements', () => {
    renderHook(
      props =>
        useMouseAndTouchTracker(
          props.environment,
          props.handleBlur,
          props.downshiftRefs,
        ),
      {initialProps},
    )

    jest.mocked(targetWithinDownshift).mockReturnValue(true)
    initialProps.environment.dispatchEvent('mouseup', {} as EventTarget)
    expect(initialProps.handleBlur).not.toHaveBeenCalled()

    jest.mocked(targetWithinDownshift).mockReturnValue(true)
    initialProps.environment.dispatchEvent('touchend', {} as EventTarget)
    expect(initialProps.handleBlur).not.toHaveBeenCalled()
  })

  test('not passing environment does not add listeners', () => {
    expect(() =>
      renderHook(
        props =>
          useMouseAndTouchTracker(
            props.environment,
            props.handleBlur,
            props.downshiftRefs,
          ),
        {
          initialProps: {
            ...initialProps,
            environment: undefined,
          },
        },
      ),
    ).not.toThrow()
  })
})
