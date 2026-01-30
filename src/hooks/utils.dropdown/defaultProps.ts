import {scrollIntoView} from '../../utils-ts'
import {stateReducer} from '../utils-ts'

import {isReactNative} from '../../is.macro.js'

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
