/**
 * Returns the next non-disabled highlightedIndex value.
 *
 * @param start The current highlightedIndex.
 * @param backwards If true, it will search backwards from the start.
 * @param items The items array.
 * @param isItemDisabled Function that tells if an item is disabled or not.
 * @param circular If the search reaches the end, if it can search again starting from the other end.
 * @returns The next non-disabled index.
 */
export function getNonDisabledIndex<Item>(
  start: number,
  backwards: boolean,
  items: Item[],
  isItemDisabled: (item: Item, index: number) => boolean,
  circular = false,
) {
  const count = items.length

  if (backwards) {
    for (let index = start; index >= 0; index--) {
      if (!isItemDisabled(items[index], index)) {
        return index
      }
    }
  } else {
    for (let index = start; index < count; index++) {
      if (!isItemDisabled(items[index], index)) {
        return index
      }
    }
  }

  if (circular) {
    return getNonDisabledIndex(
      backwards ? count - 1 : 0,
      backwards,
      items,
      isItemDisabled,
    )
  }

  return -1
}
