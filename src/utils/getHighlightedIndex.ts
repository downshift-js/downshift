import {getNonDisabledIndex} from './getNonDisabledIndex'

/**
 * Returns the next non-disabled highlightedIndex value.
 *
 * @param start The current highlightedIndex.
 * @param offset The offset from the current highlightedIndex to start searching.
 * @param items The items array.
 * @param isItemDisabled Function that tells if an item is disabled or not.
 * @param circular If the search reaches the end, if it can search again starting from the other end.
 * @returns The next highlightedIndex.
 */
export function getHighlightedIndex<Item>(
  start: number,
  offset: number,
  items: Item[],
  isItemDisabled: (item: Item, index: number) => boolean,
  circular = false,
) {
  const count = items.length
  if (count === 0) {
    return -1
  }

  const itemsLastIndex = count - 1

  if (typeof start !== 'number' || start < 0 || start > itemsLastIndex) {
    start = offset > 0 ? -1 : itemsLastIndex + 1
  }

  let current = start + offset

  if (current < 0) {
    current = circular ? itemsLastIndex : 0
  } else if (current > itemsLastIndex) {
    current = circular ? 0 : itemsLastIndex
  }

  const highlightedIndex = getNonDisabledIndex(
    current,
    offset < 0,
    items,
    isItemDisabled,
    circular,
  )

  if (highlightedIndex === -1) {
    return start >= count ? -1 : start
  }

  return highlightedIndex
}
