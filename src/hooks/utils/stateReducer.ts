import {Action, State} from '../../utils'

/**
 * Default state reducer that returns the changes.
 *
 */
export function stateReducer<T>(_s: State, a: Action<T>) {
  return a.changes
}
