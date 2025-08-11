// @ts-expect-error: can't import it otherwise.
import {isReactNative} from '../../is.macro'
import {scrollIntoView} from '../../utils-ts'
import {stateReducer} from '../utils-ts'

export const defaultProps = {
  itemToString(item: unknown) {
    return item ? String(item) : ''
  },
  itemToKey(item: unknown) {
    return item
  },
  stateReducer,
  scrollIntoView,
  environment:
    /* istanbul ignore next (ssr) */
    typeof window === 'undefined' || isReactNative ? undefined : window,
}
