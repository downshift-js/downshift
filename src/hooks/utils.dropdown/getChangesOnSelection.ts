import {getDefaultValue} from '../utils/getDefaultValue'
import {dropdownDefaultStateValues} from './dropdownDefaultStateValues'

type GetChangesOnSelectionProps = {
  items: unknown[]
  itemToString: (item: unknown) => string
  defaultIsOpen?: boolean
  defaultHighlightedIndex?: number
  highlightedIndex: number
  inputValue?: boolean
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
export function getChangesOnSelection(props: GetChangesOnSelectionProps) {
  const {
    highlightedIndex,
    inputValue,
    items,
    itemToString,
    defaultHighlightedIndex,
    defaultIsOpen,
  } = props
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
        inputValue: itemToString(items[highlightedIndex]),
      }),
    }),
  }
}
