/* eslint-disable jest/no-conditional-in-test */
import * as React from 'react'
import {renderHook} from '@testing-library/react'
import {useEnhancedReducer} from '../useEnhancedReducer'
import {callOnChangeProps} from '../callOnChangeProps'

jest.mock('../callOnChangeProps', () => {
  const originalModule = jest.requireActual<
    typeof import('../callOnChangeProps')
  >('../callOnChangeProps')

  return {
    callOnChangeProps: jest
      .fn()
      .mockImplementation(originalModule.callOnChangeProps),
  }
})

type ReducerProps = {
  stateReducer: (
    state: {count: number},
    actionAndChanges: {changes: Partial<{count: number}>},
  ) => Partial<{count: number}>
  onStateChange?: (changes: {type: string} & Partial<{count: number}>) => void
  onCountChange?: (changes: {type: string} & Partial<{count: number}>) => void
  count?: number
}

type ReducerState = {count: number}
type ReducerAction = {type: string; add?: number}

const defaultProps: ReducerProps = {
  stateReducer: jest
    .fn()
    .mockImplementation(
      (
        _state: ReducerState,
        actionAndChanges: {changes: Partial<ReducerState>},
      ) => actionAndChanges.changes,
    ),
}

function renderReducer(propsOverrides: Partial<ReducerProps> = {}) {
  const reducer = (state: ReducerState, action: ReducerAction) => {
    switch (action.type) {
      case 'increment':
        return {count: state.count + 1}
      case 'add':
        return {count: state.count + (action.add ?? 0)}
      default:
        return state
    }
  }

  const props = {
    ...defaultProps,
    ...propsOverrides,
  }

  const createInitialState = jest.fn(() => ({count: 0}))
  const isStateEqual = (prev: {count: number}, next: {count: number}) =>
    prev.count === next.count

  const utils = renderHook(
    (currentProps: ReducerProps) =>
      useEnhancedReducer(
        reducer,
        currentProps,
        createInitialState,
        isStateEqual,
      ),
    {initialProps: props},
  )

  const rerender = (newProps: Partial<ReducerProps> = {}) => {
    const mergedProps = {...props, ...newProps}
    utils.rerender(mergedProps)
  }

  return {...utils, rerender, createInitialState}
}

describe('useEnhancedReducer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should update state after dispatch', () => {
    const {result} = renderReducer()
    const [state, dispatch] = result.current

    expect(state.count).toBe(0)
    React.act(() => {
      dispatch({type: 'increment'})
    })
    const [newState] = result.current
    expect(newState.count).toBe(1)
  })

  test('should call onStateChange and onCountChange when state changes', () => {
    const onStateChange = jest.fn()
    const onCountChange = jest.fn()
    const {result} = renderReducer({onStateChange, onCountChange})
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    expect(callOnChangeProps).toHaveBeenCalledTimes(1)
    expect(callOnChangeProps).toHaveBeenCalledWith(
      expect.objectContaining({type: 'increment'}),
      expect.objectContaining({
        stateReducer: defaultProps.stateReducer,
        onStateChange,
        onCountChange,
      }),
      {count: 0},
      {count: 1},
    )
    expect(onStateChange).toHaveBeenCalledTimes(1)
    expect(onStateChange).toHaveBeenCalledWith({type: 'increment', count: 1})
    expect(onCountChange).toHaveBeenCalledTimes(1)
    expect(onCountChange).toHaveBeenCalledWith({type: 'increment', count: 1})
  })

  test('should not call onStateChange and onCountChange when state does not change', () => {
    const onStateChange = jest.fn()
    const onCountChange = jest.fn()
    const {result} = renderReducer({onStateChange, onCountChange})
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'add', add: 0})
    })

    expect(callOnChangeProps).not.toHaveBeenCalled()
    expect(onStateChange).not.toHaveBeenCalled()
  })

  test('should allow custom stateReducer to override changes', () => {
    const customStateReducer = (
      _state: {count: number},
      actionAndChanges: {changes: Partial<{count: number}>},
    ) => ({count: (actionAndChanges.changes.count ?? 0) + 10})

    const {result} = renderReducer({stateReducer: customStateReducer})
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })
    const [newState] = result.current
    expect(newState.count).toBe(11)
  })

  test('should use latest props in dispatch', () => {
    const onStateChange = jest.fn()
    const {result, rerender} = renderReducer()
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    rerender({
      ...defaultProps,
      onStateChange,
    })

    React.act(() => {
      dispatch({type: 'increment'})
    })

    expect(result.current[0].count).toBe(2)
    expect(onStateChange).toHaveBeenCalledTimes(1)
  })

  test('should use latest props when dispatch happens in layout effect after rerender', () => {
    type LayoutDispatchProps = ReducerProps & {dispatchInLayout?: boolean}
    const stateReducer = jest.fn(
      (
        _state: ReducerState,
        actionAndChanges: {changes: Partial<ReducerState>},
      ) => actionAndChanges.changes,
    )
    const reducer = (state: ReducerState) => ({count: state.count + 1})
    const createInitialState = jest.fn(() => ({count: 0}))
    const initialProps: LayoutDispatchProps = {...defaultProps, stateReducer}

    const {result, rerender} = renderHook(
      (currentProps: LayoutDispatchProps) => {
        const [state, dispatch] = useEnhancedReducer<
          ReducerState,
          ReducerAction,
          LayoutDispatchProps
        >(
          reducer,
          currentProps,
          createInitialState,
          (prev, next) => prev.count === next.count,
        )

        React.useLayoutEffect(() => {
          if (currentProps.dispatchInLayout) {
            dispatch({type: 'increment'})
          }
        }, [currentProps.dispatchInLayout, dispatch])

        return state
      },
      {initialProps},
    )

    rerender({...defaultProps, stateReducer, count: 5, dispatchInLayout: true})

    expect(stateReducer).toHaveBeenLastCalledWith(
      expect.objectContaining({count: 5}),
      expect.objectContaining({changes: {count: 6}}),
    )
    expect(result.current.count).toBe(6)
  })

  test('should add the props to action when dispatching', () => {
    const {result} = renderReducer()
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    expect(defaultProps.stateReducer).toHaveBeenCalledTimes(1)
    expect(defaultProps.stateReducer).toHaveBeenCalledWith(
      expect.objectContaining({count: 0}),
      expect.objectContaining({
        changes: {count: 1},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        props: expect.objectContaining<Partial<ReducerProps>>(defaultProps),
      }),
    )
  })

  test('reducer is called with controlled state', () => {
    const {result} = renderReducer({count: 5})
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    expect(defaultProps.stateReducer).toHaveBeenCalledTimes(1)
    expect(defaultProps.stateReducer).toHaveBeenCalledWith(
      expect.objectContaining({count: 5}),
      expect.objectContaining({
        changes: {count: 6},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        props: expect.objectContaining<Partial<ReducerProps>>({
          ...defaultProps,
          count: 5,
        }),
      }),
    )
  })

  test('reducer is called with updated controlled state after rerender', () => {
    // Regression: getState(state, action.props) must use props at dispatch time,
    // not stale props from a previous render. If action.props was captured before
    // the rerender that introduced count: 5, getState would start from 0, not 5.
    const {result, rerender} = renderReducer()
    const [, dispatch] = result.current

    rerender({count: 5})

    React.act(() => {
      dispatch({type: 'add', add: 2})
    })

    expect(defaultProps.stateReducer).toHaveBeenCalledWith(
      expect.objectContaining({count: 5}),
      expect.objectContaining({
        changes: {count: 7},
      }),
    )
    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (defaultProps.stateReducer as jest.Mock).mock.calls[0][1].props.count,
    ).toBe(5)
    expect(result.current[0].count).toBe(7)
  })

  test('callOnChangeProps receives controlled prevState from previous action props', () => {
    // prevState in the effect is computed as getState(prevStateRef.current, action.props),
    // so it should reflect any controlled value that was active at dispatch time.
    const onStateChange = jest.fn()
    const {result, rerender} = renderReducer({onStateChange})
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    // now introduce a controlled count: 10 and dispatch again
    rerender({onStateChange, count: 10})

    React.act(() => {
      dispatch({type: 'increment'})
    })

    // second call: prevState should reflect the controlled count:10 from before the dispatch,
    // not the raw prevStateRef value of 1
    expect(callOnChangeProps).toHaveBeenCalledTimes(2)
    expect(callOnChangeProps).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({type: 'increment'}),
      expect.anything(),
      {count: 10},
      {count: 11},
    )
  })

  test('callOnChangeProps is not called on mount without any dispatch', () => {
    renderReducer()

    expect(callOnChangeProps).not.toHaveBeenCalled()
  })

  test('stateReducer can partially override changes', () => {
    // stateReducer returns {} which means no state change — keeps original state
    const vetoReducer = (state: ReducerState) => state
    const {result} = renderReducer({stateReducer: vetoReducer})
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    expect(result.current[0].count).toBe(0)
  })

  test('callOnChangeProps is not called when stateReducer cancels changes', () => {
    const onStateChange = jest.fn()
    const vetoReducer = (state: ReducerState) => state
    const {result} = renderReducer({stateReducer: vetoReducer, onStateChange})
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    expect(callOnChangeProps).not.toHaveBeenCalled()
    expect(onStateChange).not.toHaveBeenCalled()
  })

  test('callOnChangeProps receives prevState equal to state after previous dispatch', () => {
    const {result} = renderReducer()
    const [, dispatch] = result.current

    React.act(() => {
      dispatch({type: 'increment'})
    })

    React.act(() => {
      dispatch({type: 'increment'})
    })

    expect(callOnChangeProps).toHaveBeenCalledTimes(2)
    expect(callOnChangeProps).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({type: 'increment'}),
      expect.anything(),
      {count: 1},
      {count: 2},
    )
  })

  test('createInitialState is called with the correct initial props', () => {
    const initialProps = {...defaultProps, count: 3}
    const {createInitialState} = renderReducer(initialProps)

    expect(createInitialState).toHaveBeenCalledTimes(1)
    expect(createInitialState).toHaveBeenCalledWith(
      expect.objectContaining(initialProps),
    )
  })
})
