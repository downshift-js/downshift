import {DropdownState} from './types'

/**
 * Check if a state is equal for dropdowns, by comparing isOpen, inputValue, highlightedIndex and selected item.
 * Used by useSelect and useCombobox.
 *
 * @param {Object} prevState
 * @param {Object} newState
 * @returns {boolean} Wheather the states are deeply equal.
 */
export function isDropdownStateEqual(
  prevState: DropdownState,
  newState: DropdownState,
): boolean {
  return (
    prevState.isOpen === newState.isOpen &&
    prevState.inputValue === newState.inputValue &&
    prevState.highlightedIndex === newState.highlightedIndex &&
    prevState.selectedItem === newState.selectedItem
  )
}
