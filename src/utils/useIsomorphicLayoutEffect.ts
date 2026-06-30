import * as React from 'react'
import {isReactNative} from '../is.macro'

// istanbul ignore next
const canUseDOM =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'

// React Native supports layout effects even though it does not have a DOM.
// istanbul ignore next
export const useIsomorphicLayoutEffect =
  canUseDOM || isReactNative ? React.useLayoutEffect : React.useEffect
