import * as React from 'react'

// istanbul ignore next
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
    ? React.useLayoutEffect
    : React.useEffect

/**
 * Utility hook that scrolls an item from a menu into view.
 * @param scrollIntoView The function that does the scroll.
 * @param highlightedIndex The index of the item that should be scrolled.
 * @param isOpen If the menu is open or not.
 * @param menuElement The menu element.
 * @param itemElements The object containing item elements.
 * @param getItemId The function to get the item id from index.
 * @returns Function that when called prevents the scroll.
 */
export function useScrollIntoView(
  scrollIntoView: (node: HTMLElement, menuNode: HTMLElement) => void,
  highlightedIndex: number,
  isOpen: boolean,
  menuElement: HTMLElement | null,
  itemElements: Record<string, HTMLElement>,
  getItemId: (index: number) => string,
) {
  // used not to scroll on highlight by mouse.
  const shouldScrollRef = React.useRef(true)
  // Scroll on highlighted item if change comes from keyboard.
  useIsomorphicLayoutEffect(() => {
    if (highlightedIndex < 0 || !isOpen || !Object.keys(itemElements).length) {
      return
    }

    if (shouldScrollRef.current) {
      const itemElement = itemElements[getItemId(highlightedIndex)]

      if (itemElement && menuElement) {
        scrollIntoView(itemElement, menuElement)
      }
    } else {
      shouldScrollRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only re-runs when highlightedIndex changes; other params are refs/stable values that don't trigger scrolling
  }, [highlightedIndex])

  return React.useCallback(function preventScroll() {
    shouldScrollRef.current = false
  }, [])
}
