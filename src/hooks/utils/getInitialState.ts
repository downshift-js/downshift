import {getInitialValue} from './getInitialValue'
import {dropdownDefaultStateValues} from './dropdownDefaultStateValues'

export type GetInitialStateProps<T> = {
  items: T[]
  isItemDisabled: (item: T, index: number) => boolean
  selectedItem?: T
  initialSelectedItem?: T
  defaultSelectedItem?: T
  isOpen?: boolean
  initialIsOpen?: boolean
  defaultIsOpen?: boolean
  highlightedIndex?: number
  initialHighlightedIndex?: number
  defaultHighlightedIndex?: number
  inputValue?: string
  initialInputValue?: string
  defaultInputValue?: string
  itemToKey: (item: T) => string
}

export function getInitialState<T>(props: GetInitialStateProps<T>) {
  const selectedItem = getInitialValue(
    props.selectedItem,
    props.initialSelectedItem,
    props.defaultSelectedItem,
    dropdownDefaultStateValues.selectedItem,
  )
  const isOpen = getInitialValue(
    props.isOpen,
    props.initialIsOpen,
    props.defaultIsOpen,
    dropdownDefaultStateValues.isOpen,
  )
  const highlightedIndex = getInitialHighlightedIndex(props)
  const inputValue = getInitialValue(
    props.inputValue,
    props.initialInputValue,
    props.defaultInputValue,
    dropdownDefaultStateValues.inputValue,
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
 * @param props Props from useCombobox or useSelect.
 * @returns The highlighted index.
 */
function getInitialHighlightedIndex<T>(props: GetInitialStateProps<T>) {
  const highlightedIndex = getInitialValue(
    props.highlightedIndex,
    props.initialHighlightedIndex,
    props.defaultHighlightedIndex,
    dropdownDefaultStateValues.highlightedIndex,
  )

  if (
    highlightedIndex > -1 &&
    props.items[highlightedIndex] &&
    props.isItemDisabled(props.items[highlightedIndex], highlightedIndex)
  ) {
    return -1
  }

  return highlightedIndex
}
