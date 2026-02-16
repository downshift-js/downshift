enum Direction {
  Up = -1,
  Down = 1,
}

type GetHighlightedIndexOnOpenProps = {
  items: unknown[]
  initialHighlightedIndex?: number
  defaultHighlightedIndex?: number
  isItemDisabled: (item: unknown, index: number) => boolean
  itemToKey: (item: unknown) => string
  selectedItem: unknown
  highlightedIndex: number
  offset: Direction
}

/**
 * Gets the highlighted index to use when the menu is open. It checks for the following in order:
 * 1. If the initialHighlightedIndex is defined and valid, it will be used.
 * 2. If the defaultHighlightedIndex is defined and valid, it will be used.
 * 3. If there is a selectedItem, it will try to find its index in the items array and use it if it's not disabled.
 * 4. If the offset is Direction.Up, it will try to highlight the last item if it's not disabled.
 * 5. If the offset is Direction.Down, it will try to highlight the first item if it's not disabled.
 * 6. If none of the above conditions are met, it will return -1 (no highlighted item).
 *
 * @param props The properties for determining the highlighted index.
 * @returns The index of the highlighted item, or -1 if none.
 */
export function getHighlightedIndexOnOpen(
  props: GetHighlightedIndexOnOpenProps,
) {
  const {
    items,
    initialHighlightedIndex,
    defaultHighlightedIndex,
    isItemDisabled,
    itemToKey,
    selectedItem,
    highlightedIndex,
    offset,
  } = props

  if (items.length === 0) {
    return -1
  }

  // Start with the first item as the default highlighted index.
  let highlightedIndexOnOpen = 0

  // initialHighlightedIndex will give value to highlightedIndex on initial state only.
  if (
    initialHighlightedIndex !== undefined &&
    highlightedIndex === initialHighlightedIndex
  ) {
    highlightedIndexOnOpen = initialHighlightedIndex
  } else if (defaultHighlightedIndex !== undefined) {
    highlightedIndexOnOpen = defaultHighlightedIndex
  } else if (selectedItem) {
    const selectedIndex = items.findIndex(
      item => itemToKey(selectedItem) === itemToKey(item),
    )

    if (selectedIndex >= 0) {
      highlightedIndexOnOpen = selectedIndex
    }
  } else if (offset === Direction.Up) {
    highlightedIndexOnOpen = items.length - 1
  }

  return isItemDisabled(items[highlightedIndexOnOpen], highlightedIndexOnOpen)
    ? -1
    : highlightedIndexOnOpen
}
