import * as React from 'react'

import {getState} from '../../utils'
import {callOnChangeProps} from './callOnChangeProps'
import {type Action, type Props, type Reducer} from './index.types'

/**
 * Computes the controlled state using a the previous state, props,
 * two reducers, one from downshift and an optional one from the user.
 * Also calls the onChange handlers for state values that have changed.
 *
 * @param reducer Reducer function from downshift.
 * @param props The hook props, also passed to createInitialState.
 * @param createInitialState Function that returns the initial state.
 * @param isStateEqual Function that checks if a previous state is equal to the next.
 * @returns An array with the state and an action dispatcher.
 */
export function useEnhancedReducer<
  S extends object,
  A extends {type: string},
  P extends Props<S, A>,
>(
  reducer: Reducer<S, A>,
  props: P,
  createInitialState: (props: P) => S,
  isStateEqual: (prev: S, next: S) => boolean,
): [S, (action: A) => void] {
  const prevStateRef = React.useRef<S>({} as S)
  const enhancedReducer = React.useCallback(
    (
      {state}: {state: S},
      action: Action<S, A, P>,
    ): {state: S; lastAction?: Action<S, A, P>} => {
      state = getState(state, action.props)

      const changes = reducer(state, action)
      const newState = action.props.stateReducer(state, {...action, changes})

      return {state: {...state, ...newState}, lastAction: action}
    },
    [reducer],
  )
  const [{state, lastAction}, dispatch] = React.useReducer(
    enhancedReducer,
    props,
    p => ({
      state: createInitialState(p),
      lastAction: undefined,
    }),
  )
  const propsRef = React.useRef(props)
  React.useEffect(() => {
    propsRef.current = props
  }, [props])
  const dispatchWithProps = React.useCallback(
    (action: A) => dispatch({...action, props: propsRef.current}),
    [propsRef],
  )

  React.useEffect(() => {
    if (!lastAction) {
      return
    }
    const prevState = getState(prevStateRef.current, lastAction.props)
    const shouldCallOnChangeProps = !isStateEqual(prevState, state)

    if (shouldCallOnChangeProps) {
      callOnChangeProps(lastAction, lastAction.props, prevState, state)
    }

    prevStateRef.current = state
  }, [state, lastAction, isStateEqual])

  return [state, dispatchWithProps]
}
