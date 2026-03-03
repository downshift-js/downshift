import {getDefaultValue} from '../utils'
import {dropdownDefaultStateValues} from '../utils.dropdown'

type GetDefaultHighlightedIndexProps<Item> = {
  defaultHighlightedIndex?: number
  isItemDisabled: (item: Item, index: number) => boolean
  items: Item[]
}

/**
 * Returns the new highlightedIndex based on the defaultHighlightedIndex prop, if it's not disabled.
 *
 * @param props Props from useCombobox or useSelect.
 * @returns The highlighted index.
 */
export function getDefaultHighlightedIndex<Item>(
  props: GetDefaultHighlightedIndexProps<Item>,
) {
  const highlightedIndex = getDefaultValue(
    props.defaultHighlightedIndex,
    dropdownDefaultStateValues.highlightedIndex,
  )
  if (
    props.items[highlightedIndex] &&
    props.isItemDisabled(props.items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}
