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
