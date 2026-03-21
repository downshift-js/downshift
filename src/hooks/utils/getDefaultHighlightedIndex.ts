import {getDefaultValue} from '../utils'
import {dropdownDefaultStateValues} from '.'

/**
 * Returns the new highlightedIndex based on the defaultHighlightedIndex prop, if it's not disabled.
 *
 * @param props Props passed to the hook.
 * @returns The highlighted index.
 */
export function getDefaultHighlightedIndex<Item>(
  items: Item[],
  isItemDisabled: (item: Item, index: number) => boolean,
  defaultHighlightedIndex?: number,
) {
  const highlightedIndex = getDefaultValue(
    defaultHighlightedIndex,
    dropdownDefaultStateValues.highlightedIndex,
  )
  if (
    items[highlightedIndex] &&
    isItemDisabled(items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}
