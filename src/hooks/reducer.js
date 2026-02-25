import {
  getHighlightedIndexOnOpen,
  getDefaultHighlightedIndex,
  dropdownDefaultStateValues,
} from './utils.dropdown'
import {getDefaultValue} from './utils'

export default function downshiftCommonReducer(
  state,
  props,
  action,
  stateChangeTypes,
) {
  const {
    items,
    initialHighlightedIndex,
    defaultHighlightedIndex,
    isItemDisabled,
    itemToKey,
    defaultIsOpen,
    defaultSelectedItem,
    defaultInputValue,
  } = props
  const {highlightedIndex, selectedItem, isOpen} = state
  const {type} = action
  let changes

  switch (type) {
    case stateChangeTypes.ItemMouseMove:
      changes = {
        highlightedIndex: action.disabled ? -1 : action.index,
      }

      break
    case stateChangeTypes.MenuMouseLeave:
      changes = {
        highlightedIndex: -1,
      }

      break
    case stateChangeTypes.ToggleButtonClick:
    case stateChangeTypes.FunctionToggleMenu:
      changes = {
        isOpen: !isOpen,
        highlightedIndex: isOpen
          ? -1
          : getHighlightedIndexOnOpen({
              items,
              initialHighlightedIndex,
              defaultHighlightedIndex,
              selectedItem,
              itemToKey,
              isItemDisabled,
              highlightedIndex,
              offset: 0,
            }),
      }

      break
    case stateChangeTypes.FunctionOpenMenu:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen({
          items,
          initialHighlightedIndex,
          defaultHighlightedIndex,
          selectedItem,
          itemToKey,
          isItemDisabled,
          highlightedIndex,
          offset: 0,
        }),
      }

      break
    case stateChangeTypes.FunctionCloseMenu:
      changes = {
        isOpen: false,
      }

      break
    case stateChangeTypes.FunctionSetHighlightedIndex:
      changes = {
        highlightedIndex: isItemDisabled(
          items[action.highlightedIndex],
          action.highlightedIndex,
        )
          ? -1
          : action.highlightedIndex,
      }

      break
    case stateChangeTypes.FunctionSetInputValue:
      changes = {
        inputValue: action.inputValue,
      }

      break
    case stateChangeTypes.FunctionReset:
      changes = {
        highlightedIndex: getDefaultHighlightedIndex({
          defaultHighlightedIndex,
          isItemDisabled,
          items,
        }),
        isOpen: getDefaultValue(
          defaultIsOpen,
          dropdownDefaultStateValues.isOpen,
        ),
        selectedItem: getDefaultValue(
          defaultSelectedItem,
          dropdownDefaultStateValues.selectedItem,
        ),
        inputValue: getDefaultValue(
          defaultInputValue,
          dropdownDefaultStateValues.inputValue,
        ),
      }

      break
    default:
      throw new Error('Reducer called without proper action type.')
  }

  return {
    ...state,
    ...changes,
  }
}
/* eslint-enable complexity */
