import * as React from 'react'

/**
 * Tracks if it's the first render.
 */
export function useIsInitialMount(): boolean {
  const isInitialMountRef = React.useRef(true)

  React.useEffect(() => {
    isInitialMountRef.current = false

    return () => {
      isInitialMountRef.current = true
    }
  }, [])

  return isInitialMountRef.current
}
