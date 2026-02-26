export interface Action<T> extends Record<string, unknown> {
  type: T
}

export type State = Record<string, unknown>

export interface Props<S extends State, T> {
  onStateChange?(typeAndChanges: unknown): void
  stateReducer(
    state: S,
    actionAndChanges: Action<T> & {changes: Partial<S>},
  ): Partial<S>
}
