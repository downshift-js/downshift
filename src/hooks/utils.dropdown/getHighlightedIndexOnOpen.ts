enum Direction {
  Up = -1,
  Down = 1,
  None = 0
}

type GetHighlightedIndexOnOpenProps<Item> = {
  items: Item[]
  initialHighlightedIndex?: number
  defaultHighlightedIndex?: number
  isItemDisabled: (item: Item, index: number) => boolean
  itemToKey: (item: Item | null) => string
  selectedItem: Item | null
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
export function getHighlightedIndexOnOpen<Item>(
  props: GetHighlightedIndexOnOpenProps<Item>,
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

  // initialHighlightedIndex will give value to highlightedIndex on initial state only.
  if (
    initialHighlightedIndex !== undefined &&
    highlightedIndex === initialHighlightedIndex &&
    items[initialHighlightedIndex] &&
    !isItemDisabled(items[initialHighlightedIndex], initialHighlightedIndex)
  ) {
    return initialHighlightedIndex
  }

  if (
    defaultHighlightedIndex !== undefined &&
    items[defaultHighlightedIndex] &&
    !isItemDisabled(items[defaultHighlightedIndex], defaultHighlightedIndex)
  ) {
    return defaultHighlightedIndex
  }

  if (selectedItem) {
    return items.findIndex(item => itemToKey(selectedItem) === itemToKey(item))
  }

  if (
    offset < 0 &&
    items[items.length - 1] &&
    !isItemDisabled(items[items.length - 1] as Item, items.length - 1)
  ) {
    return items.length - 1
  }

  if (offset > 0 && items[0] && !isItemDisabled(items[0], 0)) {
    return 0
  }

  return -1
}
