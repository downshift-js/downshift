import {getInitialValue} from '../utils/getInitialValue'
import {dropdownDefaultStateValues} from './dropdownDefaultStateValues'
import {DropdownProps, DropdownState} from './types'

export function getInitialDropdownState(
  props: DropdownProps,
): DropdownState {
  const selectedItem = getInitialValue<DropdownState, DropdownProps>(
    props,
    'selectedItem',
    dropdownDefaultStateValues,
  )
  const isOpen = getInitialValue(props, 'isOpen', dropdownDefaultStateValues)
  const highlightedIndex = getInitialHighlightedIndex(props)
  const inputValue = getInitialValue(
    props,
    'inputValue',
    dropdownDefaultStateValues,
  )
  return {
    highlightedIndex:
      highlightedIndex < 0 && selectedItem && isOpen
        ? props.items.findIndex(
            item => props.itemToKey(item) === props.itemToKey(selectedItem),
          )
        : highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
}

/**
 * Returns the new highlightedIndex based on the initialHighlightedIndex prop, if not disabled.
 *
 * @param props Props from useCombobox or useSelect.
 * @returns The highlighted index.
 */
function getInitialHighlightedIndex(props: DropdownProps): number {
  const highlightedIndex = getInitialValue(
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
