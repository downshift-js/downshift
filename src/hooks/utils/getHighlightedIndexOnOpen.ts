/* eslint-disable max-params */
/**
 * Returns the highlighted index when the menu is opened.
 * Takes into account the initialHighlightedIndex, defaultHighlightedIndex,
 * selectedItem, and the open direction offset.
 *
 * @param items The list of items.
 * @param initialHighlightedIndex The initial highlighted index prop.
 * @param defaultHighlightedIndex The default highlighted index prop.
 * @param isItemDisabled Callback to determine if an item is disabled.
 * @param itemToKey Callback to get a unique key from an item.
 * @param selectedItem The currently selected item.
 * @param highlightedIndex The current highlighted index from state.
 * @param offset The direction of navigation: positive opens downward, negative opens upward.
 * @returns The new highlighted index.
 */
export function getHighlightedIndexOnOpen<Item>(
  items: Item[],
  initialHighlightedIndex: number | undefined,
  defaultHighlightedIndex: number | undefined,
  isItemDisabled: (item: Item, index: number) => boolean,
  itemToKey: (item: Item | null) => unknown,
  selectedItem: Item | null,
  highlightedIndex: number,
  offset: number,
): number {
  if (items.length === 0) {
    return -1
  }

  // initialHighlightedIndex will give value to highlightedIndex on initial state only.
  if (
    initialHighlightedIndex !== undefined &&
    highlightedIndex === initialHighlightedIndex &&
    (items[initialHighlightedIndex] === undefined ||
      !isItemDisabled(items[initialHighlightedIndex], initialHighlightedIndex))
  ) {
    return initialHighlightedIndex
  }

  if (
    defaultHighlightedIndex !== undefined &&
    (defaultHighlightedIndex === -1 ||
      items[defaultHighlightedIndex] === undefined ||
      !isItemDisabled(items[defaultHighlightedIndex], defaultHighlightedIndex))
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
