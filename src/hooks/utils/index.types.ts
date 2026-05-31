type StateReducerProp<S extends object, A extends {type: string}> = (
  state: S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actionAndChanges: (A & {props: any}) & {changes: Partial<S>},
) => Partial<S>

export type Props<S extends object, A extends {type: string}> = Partial<S> & {
  stateReducer: StateReducerProp<S, A>
  onStateChange?: (changes: {type: A['type']} & Partial<S>) => void
}

export type Action<
  S extends object,
  A extends {type: string},
  P extends Props<S, A>,
> = A & {
  props: P
}

export type Reducer<S extends object, A extends {type: string}> = (
  state: S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: A & {props: any},
) => Partial<S>
