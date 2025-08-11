import * as React from 'react'

import {
  type Action,
  type Props,
  type State,
  getState,
  useLatestRef,
} from '../../utils-ts'
import {callOnChangeProps} from '.'

/**
 * Computes the controlled state using a the previous state, props,
 * two reducers, one from downshift and an optional one from the user.
 * Also calls the onChange handlers for state values that have changed.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
export function useEnhancedReducer<
  S extends State,
  P extends Partial<S> & Props<S, T>,
  T,
  A extends Action<T>,
>(
  reducer: (state: S, props: P, action: A) => S,
  props: P,
  createInitialState: (props: P) => S,
  isStateEqual: (prevState: S, newState: S) => boolean,
): [S, (action: A) => void] {
  const prevStateRef = React.useRef<S | null>(null)
  const actionRef = React.useRef<A>()
  const propsRef = useLatestRef(props)

  const enhancedReducer = React.useCallback(
    (state: S, action: A): S => {
      actionRef.current = action
      state = getState(state, propsRef.current)

      const changes = reducer(state, propsRef.current, action)
      const newState = propsRef.current.stateReducer(state, {
        ...action,
        changes,
      })

      return {...state, ...newState}
    },
    [propsRef, reducer],
  )
  const [state, dispatch] = React.useReducer(
    enhancedReducer,
    props,
    createInitialState,
  )

  const action = actionRef.current

  React.useEffect(() => {
    const prevState = getState(
      prevStateRef.current ?? ({} as S),
      propsRef.current,
    )
    const shouldCallOnChangeProps =
      action && prevStateRef.current && !isStateEqual(prevState, state)

    if (shouldCallOnChangeProps) {
      callOnChangeProps(action, propsRef.current, prevState, state)
    }

    prevStateRef.current = state
  }, [state, action, isStateEqual, propsRef])

  return [state, dispatch]
}
