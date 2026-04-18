import {getState} from '../../utils'
import {useEnhancedReducer} from './useEnhancedReducer'
import {type Props, type Reducer} from './index.types'

/**
 * Wraps the useEnhancedReducer and applies the controlled prop values before
 * returning the new state.
 * @param reducer Reducer function from downshift.
 * @param props The hook props, also passed to createInitialState.
 * @param createInitialState Function that returns the initial state.
 * @param isStateEqual Function that checks if a previous state is equal to the next.
 * @returns An array with the state and an action dispatcher.
 */
export function useControlledReducer<
  S extends object,
  A extends {type: string},
  P extends Props<S, A>,
>(
  reducer: Reducer<S, A>,
  props: P,
  createInitialState: (props: P) => S,
  isStateEqual: (prev: S, next: S) => boolean,
): [S, (action: A) => void] {
  const [state, dispatch] = useEnhancedReducer<S, A, P>(
    reducer,
    props,
    createInitialState,
    isStateEqual,
  )

  return [getState(state, props), dispatch]
}
