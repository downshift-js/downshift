import {UseTagGroupProps, UseTagGroupMergedProps} from '../index.types'

import {isReactNative} from '../../../is.macro.js'

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
    removeElementDescription: 'Press Delete or Backspace to remove tag.',
    ...userProps,
  }
}
