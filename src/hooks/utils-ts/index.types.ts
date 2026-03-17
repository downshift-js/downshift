export type StateReducer<S extends object, A extends {type: string}> = (
  state: S,
  actionAndChanges: Action<S, A> & {changes: Partial<S>},
) => Partial<S>

export type Props<S extends object, A extends {type: string}> = Partial<S> & {
  stateReducer: StateReducer<S, A>
  onStateChange?: (changes: {type: A['type']} & Partial<S>) => void
}

export type Action<S extends object, A extends {type: string}> = A & {
  props: Props<S, A>
}

export type Reducer<S extends object, A extends {type: string}> = (
  state: S,
  action: Action<S, A>,
) => Partial<S>
