import {getState, type Action, type State, type Props} from '../../utils-ts'
import {useEnhancedReducer} from './useEnhancedReducer'

/**
 * Wraps the useEnhancedReducer and applies the controlled prop values before
 * returning the new state.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
export function useControlledReducer<
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
  const [state, dispatch] = useEnhancedReducer(
    reducer,
    props,
    createInitialState,
    isStateEqual,
  )

  return [getState(state, props), dispatch]
}
