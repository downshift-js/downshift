import {UseTagGroupProps} from './index.types'

export type UseElementIdsProps = Pick<
  UseTagGroupProps,
  'id' | 'getItemId' | 'groupId'
>
export type UseElementIdsReturnValue = Required<
  Pick<UseTagGroupProps, 'getItemId' | 'groupId'>
>

// export interface ActionWithProps<P, T> extends Action<T> {
//   props: P
// }

// export interface Action<T> {
//   type: T
// }

// export type StateReducer<S, P, T> = (
//   state: S,
//   actionAndChanges: ActionWithProps<P, T> & {changes: S},
// ) => S

// export interface Props<S extends State, T> {
//   onStateChange?(typeAndChanges: Action<T> & Partial<S>): void
// }

export type State = Record<string, unknown>

export interface Props<S, T> {
  onStateChange?(typeAndChanges: unknown): void
  stateReducer(
    state: S,
    actionAndChanges: Action<T> & {changes: Partial<S>},
  ): Partial<S>
}

export interface Action<T> extends Record<string, unknown> {
  type: T
}
