import {UseTagGroupProps, UseTagGroupMergedProps} from '../index.types'

// eslint-disable-next-line
const {isReactNative} = require('../../../is.macro.js')

export function getMergedProps<Item>(
  userProps: UseTagGroupProps<Item>,
): UseTagGroupMergedProps<Item> {
  return {
    stateReducer(_s, {changes}) {
      return changes
    },
    environment:
      /* istanbul ignore next (ssr) */
      typeof window === 'undefined' || isReactNative ? undefined : window,
    removeElementDescription: 'Press Delete to remove tag.',
    ...userProps,
  }
}
