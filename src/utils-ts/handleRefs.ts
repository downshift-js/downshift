import * as React from 'react'

export function handleRefs(
  ...refs: (
    | React.MutableRefObject<HTMLElement>
    | React.RefCallback<HTMLElement>
    | undefined
  )[]
) {
  return (node: HTMLElement) => {
    refs.forEach(ref => {
      console.log(ref, typeof ref)
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    })
  }
}
