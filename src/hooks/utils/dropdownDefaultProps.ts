import {scrollIntoView} from '../../utils'
import {isReactNative} from '../../is.macro.js'
import {Environment} from '../index.types'

export const dropdownDefaultProps = {
  itemToString(item: unknown) {
    return item ? String(item) : ''
  },
  itemToKey(item: unknown) {
    return item
  },
  stateReducer: <S, A>(
    _state: S,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    actionAndChanges: (A & {props: any}) & {changes: Partial<S>},
  ): Partial<S> => actionAndChanges.changes,
  scrollIntoView,
  environment:
    /* istanbul ignore next (ssr) */
    (typeof window === 'undefined' || isReactNative
      ? undefined
      : window) as Environment,
}
