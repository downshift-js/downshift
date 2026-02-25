import {getInitialValue} from '../utils/getInitialValue'
import {dropdownDefaultStateValues} from './dropdownDefaultStateValues'
import {DropdownState} from './types'

export type GetInitialDropdownStateProps = {
  isOpen?: boolean
  highlightedIndex?: number
  selectedItem?: unknown
  inputValue?: string
  defaultIsOpen?: boolean
  defaultHighlightedIndex?: number
  defaultInputValue?: string
  defaultSelectedItem?: unknown
  initialIsOpen?: boolean
  initialHighlightedIndex?: number
  initialInputValue?: string
  initialSelectedItem?: unknown
  items: unknown[]
  itemToKey: (item: unknown) => string
  isItemDisabled: (item: unknown, index: number) => boolean
}

export function getInitialDropdownState(
  props: GetInitialDropdownStateProps,
): DropdownState {
  const {
    isOpen: isOpenProp,
    highlightedIndex: highlightedIndexProp,
    selectedItem: selectedItemProp,
    inputValue: inputValueProp,
    defaultIsOpen,
    defaultHighlightedIndex,
    defaultInputValue,
    defaultSelectedItem,
    initialIsOpen,
    initialHighlightedIndex,
    initialInputValue,
    initialSelectedItem,
    items,
    itemToKey,
    isItemDisabled,
  } = props

  const selectedItem = getInitialValue(
    selectedItemProp,
    initialSelectedItem,
    defaultSelectedItem,
    dropdownDefaultStateValues.selectedItem,
  )
  const isOpen = getInitialValue(
    isOpenProp,
    initialIsOpen,
    defaultIsOpen,
    dropdownDefaultStateValues.isOpen,
  )
  const highlightedIndex = getInitialHighlightedIndex({
    highlightedIndexProp,
    initialHighlightedIndex,
    defaultHighlightedIndex,
    isItemDisabled,
    items,
  })
  const inputValue = getInitialValue(
    inputValueProp,
    initialInputValue,
    defaultInputValue,
    dropdownDefaultStateValues.inputValue,
  )
  return {
    highlightedIndex:
      highlightedIndex < 0 && selectedItem && isOpen
        ? items.findIndex(item => itemToKey(item) === itemToKey(selectedItem))
        : highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
}

type getInitialHighlightedIndexProps = {
  highlightedIndexProp?: number
  defaultHighlightedIndex?: number
  initialHighlightedIndex?: number
  isItemDisabled: (item: unknown, index: number) => boolean
  items: unknown[]
}

/**
 * Returns the new highlightedIndex based on the initialHighlightedIndex prop, if not disabled.
 *
 * @param props Props from useCombobox or useSelect.
 * @returns The highlighted index.
 */
function getInitialHighlightedIndex(
  props: getInitialHighlightedIndexProps,
): number {
  const highlightedIndex = getInitialValue(
    props.highlightedIndexProp,
    props.defaultHighlightedIndex,
    props.initialHighlightedIndex,
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
