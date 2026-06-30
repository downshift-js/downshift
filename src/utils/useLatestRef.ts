import * as React from 'react'

import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect'

export function useLatestRef<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value)

  useIsomorphicLayoutEffect(() => {
    ref.current = value
  }, [value])

  return ref
}
