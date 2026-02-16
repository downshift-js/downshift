import * as React from 'react'

type UseScrollIntoViewProps = {
  highlightedIndex: number
  isOpen: boolean
  itemRefs: React.MutableRefObject<Record<number, HTMLElement>>
  getItemNodeFromIndex: (index: number) => HTMLElement | null
  menuElement: HTMLElement | null
  scrollIntoView: (
    element: HTMLElement | null,
    menuElement: HTMLElement | null,
  ) => void
}

// istanbul ignore next
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect

export function useScrollIntoView({
  highlightedIndex,
  isOpen,
  itemRefs,
  getItemNodeFromIndex,
  menuElement,
  scrollIntoView: scrollIntoViewProp,
}: UseScrollIntoViewProps) {
  // used not to scroll on highlight by mouse.
  const shouldScrollRef = React.useRef(true)
  // Scroll on highlighted item if change comes from keyboard.
  useIsomorphicLayoutEffect(() => {
    if (
      highlightedIndex < 0 ||
      !isOpen ||
      !Object.keys(itemRefs.current).length
    ) {
      return
    }

    if (shouldScrollRef.current) {
      scrollIntoViewProp(getItemNodeFromIndex(highlightedIndex), menuElement)
    } else {
      shouldScrollRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex])

  return shouldScrollRef
}
