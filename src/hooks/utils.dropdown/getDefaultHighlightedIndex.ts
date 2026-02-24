import {getDefaultValue} from '../utils'
import {dropdownDefaultStateValues} from '../utils.dropdown'
import {DropdownProps} from './types'

/**
 * Returns the new highlightedIndex based on the defaultHighlightedIndex prop, if it's not disabled.
 *
 * @param {DropdownProps} props Props from useCombobox or useSelect.
 * @returns {number} The highlighted index.
 */
export function getDefaultHighlightedIndex(props: DropdownProps) {
  const highlightedIndex = getDefaultValue(
    props,
    'highlightedIndex',
    dropdownDefaultStateValues,
  )
  if (
    highlightedIndex > -1 &&
    props.isItemDisabled(props.items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}
