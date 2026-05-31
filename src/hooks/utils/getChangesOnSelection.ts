import {getDefaultValue} from './getDefaultValue'
import {dropdownDefaultStateValues} from './dropdownDefaultStateValues'

type Changes<Item> = {
  isOpen: boolean
  highlightedIndex: number
  selectedItem?: Item
  inputValue?: string
}

/**
 * Handles selection on Enter / Alt + ArrowUp. Closes the menu and resets the highlighted index, unless there is a highlighted.
 * In that case, selects the item and resets to defaults for open state and highlighted idex.
 *
 * @param props The Dropdown props.
 * @param highlightedIndex The index from the state.
 * @param inputValue Also return the input value for state.
 * @returns The changes for the state.
 */
export function getChangesOnSelection<Item>(
  items: Item[],
  itemToString: (item: Item | null) => string,
  defaultIsOpen: boolean | undefined,
  defaultHighlightedIndex: number | undefined,
  highlightedIndex: number,
  inputValue?: boolean,
): Changes<Item> {
  const shouldSelect = items.length && highlightedIndex >= 0

  return {
    isOpen: false,
    highlightedIndex: -1,
    ...(shouldSelect && {
      selectedItem: items[highlightedIndex],
      isOpen: getDefaultValue(defaultIsOpen, dropdownDefaultStateValues.isOpen),
      highlightedIndex: getDefaultValue(
        defaultHighlightedIndex,
        dropdownDefaultStateValues.highlightedIndex,
      ),
      ...(inputValue && {
        inputValue: itemToString(items[highlightedIndex] as Item),
      }),
    }),
  }
}
