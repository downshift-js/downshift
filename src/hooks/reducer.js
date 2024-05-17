import {
  getHighlightedIndexOnOpen,
  getDefaultValue,
  getDefaultHighlightedIndex,
} from './utils'

export default function downshiftCommonReducer(
  state,
  action,
  stateChangeTypes,
) {
  const {type, props} = action
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
        highlightedIndex: getDefaultHighlightedIndex(props),
        isOpen: getDefaultValue(props, 'isOpen'),
        selectedItem: getDefaultValue(props, 'selectedItem'),
        inputValue: getDefaultValue(props, 'inputValue'),
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
