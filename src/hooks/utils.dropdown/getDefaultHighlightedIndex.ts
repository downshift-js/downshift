import {getDefaultValue} from '../utils'
import {dropdownDefaultStateValues} from '../utils.dropdown'

type GetDefaultHighlightedIndexProps = {
  defaultHighlightedIndex?: number
  isItemDisabled: (item: unknown, index: number) => boolean
  items: unknown[]
}

/**
 * Returns the new highlightedIndex based on the defaultHighlightedIndex prop, if it's not disabled.
 *
 * @param props Props from useCombobox or useSelect.
 * @returns The highlighted index.
 */
export function getDefaultHighlightedIndex(
  props: GetDefaultHighlightedIndexProps,
) {
  const highlightedIndex = getDefaultValue(
    props.defaultHighlightedIndex,
    dropdownDefaultStateValues.highlightedIndex,
  )
  if (
    highlightedIndex > -1 &&
    props.isItemDisabled(props.items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}
