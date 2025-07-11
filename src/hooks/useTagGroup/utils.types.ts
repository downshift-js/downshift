import {UseTagGroupProps} from './index.types'

export type UseElementIdsProps = Pick<
  UseTagGroupProps<unknown>,
  'id' | 'getItemId' | 'groupId'
>
export type UseElementIdsReturnValue = Required<
  Pick<UseTagGroupProps<unknown>, 'getItemId' | 'groupId'>
>

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
