import * as React from 'react'

export function handleRefs<T extends HTMLElement>(
  ...refs: (React.Ref<T> | undefined)[]
) {
  return (node: T) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    })
  }
}
