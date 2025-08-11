import {Action, State} from '../../utils-ts'

/**
 * Default state reducer that returns the changes.
 *
 */
export function stateReducer<T>(_s: State, a: Action<T>) {
  return a.changes
}
