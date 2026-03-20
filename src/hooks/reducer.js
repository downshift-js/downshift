import {getHighlightedIndexOnOpen} from './utils.legacy'
import {getDefaultValue} from './utils'
import {
  dropdownDefaultStateValues,
  getDefaultHighlightedIndex,
} from './utils.dropdown'

export default function downshiftCommonReducer(
  state,
  props,
  action,
  stateChangeTypes,
) {
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
        isOpen: !state.isOpen,
        highlightedIndex: state.isOpen
          ? -1
          : getHighlightedIndexOnOpen(props, state, 0),
      }

      break
    case stateChangeTypes.FunctionOpenMenu:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(props, state, 0),
      }

      break
    case stateChangeTypes.FunctionCloseMenu:
      changes = {
        isOpen: false,
      }

      break
    case stateChangeTypes.FunctionSetHighlightedIndex:
      changes = {
        highlightedIndex: props.isItemDisabled(
          props.items[action.highlightedIndex],
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
        highlightedIndex: getDefaultHighlightedIndex(
          props.items,
          props.isItemDisabled,
          props.defaultHighlightedIndex,
        ),
        isOpen: getDefaultValue(
          props.defaultIsOpen,
          dropdownDefaultStateValues.isOpen,
        ),
        selectedItem: getDefaultValue(
          props.defaultSelectedItem,
          dropdownDefaultStateValues.selectedItem,
        ),
        inputValue: getDefaultValue(
          props.defaultInputValue,
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
