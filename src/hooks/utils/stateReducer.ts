type State = Record<string, unknown>

export type Action<T> = {
  type: string
  changes: Partial<T>
}

/**
 * Default state reducer that returns the changes.
 *
 */
export function stateReducer<T>(_s: State, a: Action<T>) {
  return a.changes
}
