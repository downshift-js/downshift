type DropdownState<Item> = {
  isOpen: boolean
  inputValue: string
  highlightedIndex: number
  selectedItem: Item | null
}

/**
 * Check if a state is equal for dropdowns, by comparing isOpen, inputValue, highlightedIndex and selected item.
 * Used by useSelect and useCombobox.
 *
 * @param prevState The previous dropdown state.
 * @param newState The new dropdown state.
 * @returns Whether the states are deeply equal.
 */
export function isDropdownStateEqual<Item>(
  prevState: DropdownState<Item>,
  newState: DropdownState<Item>,
) {
  return (
    prevState.isOpen === newState.isOpen &&
    prevState.inputValue === newState.inputValue &&
    prevState.highlightedIndex === newState.highlightedIndex &&
    prevState.selectedItem === newState.selectedItem
  )
}
