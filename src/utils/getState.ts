export interface Action<T> extends Record<string, unknown> {
  type: T
}

export type State = Record<string, unknown>

export interface Props<S, T> {
  onStateChange?(typeAndChanges: unknown): void
  stateReducer(
    state: S,
    actionAndChanges: Action<T> & {changes: Partial<S>},
  ): Partial<S>
}

/**
 * This will perform a shallow merge of the given state object
 * with the state coming from props
 * (for the controlled component scenario)
 * This is used in state updater functions so they're referencing
 * the right state regardless of where it comes from.
 *
 * @param state The state of the component/hook.
 * @param props The props that may contain controlled values.
 * @returns The merged controlled state.
 */
export function getState<
  S extends State,
  P extends Partial<S> & Props<S, T>,
  T,
>(state: S, props?: P): S {
  if (!props) {
    return state
  }

  const keys = Object.keys(state) as (keyof S)[]

  return keys.reduce(
    (newState, key) => {
      if (props[key] !== undefined) {
        newState[key] = (props as Partial<S>)[key] as S[typeof key]
      }
      return newState
    },
    {...state},
  )
}
