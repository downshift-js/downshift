import * as React from 'react'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect

export function useLatestRef<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value)

  useIsomorphicLayoutEffect(() => {
    ref.current = value
  }, [value])

  return ref
}
