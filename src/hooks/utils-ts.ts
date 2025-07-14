import * as React from 'react'

/**
 * Returns both the item and index when both or either is passed.
 *
 * @param itemProp The item which could be undefined.
 * @param indexProp The index which could be undefined.
 * @param items The array of items to get the item based on index.
 * @param errorMessage The error to be thrown if index and item could not be returned for any reason.
 * @returns An array with item and index.
 */
export function getItemAndIndex<Item>(
  itemProp: Item | undefined,
  indexProp: number | undefined,
  items: Item[],
  errorMessage: string,
): [Item, number] {
  if (itemProp !== undefined && indexProp !== undefined) {
    return [itemProp, indexProp]
  }

  if (itemProp !== undefined) {
    const index = items.indexOf(itemProp)

    if (index < 0) {
      throw new Error(errorMessage)
    }

    return [itemProp, items.indexOf(itemProp)]
  }

  if (indexProp !== undefined) {
    const item = items[indexProp]

    if (item === undefined) {
      throw new Error(errorMessage)
    }
    return [item, indexProp]
  }

  throw new Error(errorMessage)
}

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