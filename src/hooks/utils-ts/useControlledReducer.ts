import {getState} from '../../utils-ts'
import {useEnhancedReducer} from './useEnhancedReducer'
import {type Props, type Reducer} from './index.types'

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
  S extends object,
  A extends {type: string},
>(
  reducer: Reducer<S, A>,
  props: Props<S, A>,
  createInitialState: (props: Props<S, A>) => S,
  isStateEqual: (prev: S, next: S) => boolean,
): [S, (action: A) => void] {
  const [state, dispatch] = useEnhancedReducer<S, A>(
    reducer,
    props,
    createInitialState,
    isStateEqual,
  )

  return [getState(state, props), dispatch]
}
