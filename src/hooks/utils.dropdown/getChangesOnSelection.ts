import { getDefaultValue } from "../utils/getDefaultValue"
import { dropdownDefaultStateValues } from "./dropdownDefaultStateValues"
import { DropdownProps } from "./types"
/**
 * Handles selection on Enter / Alt + ArrowUp. Closes the menu and resets the highlighted index, unless there is a highlighted.
 * In that case, selects the item and resets to defaults for open state and highlighted idex.
 * 
 * @param props The Dropdown props.
 * @param highlightedIndex The index from the state.
 * @param inputValue Also return the input value for state.
 * @returns The changes for the state.
 */
export function getChangesOnSelection(props: DropdownProps, highlightedIndex: number, inputValue = true) {
  const shouldSelect = props.items.length && highlightedIndex >= 0

  return {
    isOpen: false,
    highlightedIndex: -1,
    ...(shouldSelect && {
      selectedItem: props.items[highlightedIndex],
      isOpen: getDefaultValue(props, 'isOpen', dropdownDefaultStateValues),
      highlightedIndex: getDefaultValue(
        props,
        'highlightedIndex',
        dropdownDefaultStateValues,
      ),
      ...(inputValue && {
        inputValue: props.itemToString(props.items[highlightedIndex]),
      }),
    }),
  }
}