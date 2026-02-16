import {scrollIntoView} from '../../utils'
import {stateReducer} from '../utils'

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
