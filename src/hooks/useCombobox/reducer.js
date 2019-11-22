import {getNextWrappingIndex, getHighlightedIndexOnOpen} from '../utils'
import {getDefaultValue} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftUseComboboxReducer(state, action) {
  const {type, props, shiftKey} = action
  let changes

  switch (type) {
    case stateChangeTypes.ItemMouseMove:
      changes = {
        highlightedIndex: action.index,
      }
      break
    case stateChangeTypes.ItemClick:
      changes = {
        isOpen: getDefaultValue(props, 'isOpen'),
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        selectedItem: props.items[action.index],
        inputValue: props.itemToString(props.items[action.index]),
      }
      break
    case stateChangeTypes.InputKeyDownArrowDown:
      changes = {
        highlightedIndex: getNextWrappingIndex(
          shiftKey ? 5 : 1,
          state.highlightedIndex,
          props.items.length,
          props.circularNavigation,
        ),
        ...(!state.isOpen && {isOpen: true}),
      }
      break
    case stateChangeTypes.InputKeyDownArrowUp:
      changes = {
        highlightedIndex: getNextWrappingIndex(
          shiftKey ? -5 : -1,
          state.highlightedIndex,
          props.items.length,
          props.circularNavigation,
        ),
        ...(!state.isOpen && {isOpen: true}),
      }
      break
    case stateChangeTypes.InputKeyDownEnter:
      changes = {
        ...(state.highlightedIndex >= 0 && {
          selectedItem: props.items[state.highlightedIndex],
          isOpen: getDefaultValue(props, 'isOpen'),
          highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
          inputValue: props.itemToString(props.items[state.highlightedIndex]),
        }),
      }
      break
    case stateChangeTypes.InputKeyDownEscape:
      changes = {
        isOpen: false,
        selectedItem: null,
        highlightedIndex: -1,
        inputValue: '',
      }
      break
    case stateChangeTypes.InputKeyDownHome:
      changes = {
        highlightedIndex: 0,
      }
      break
    case stateChangeTypes.InputKeyDownEnd:
      changes = {
        highlightedIndex: props.items.length - 1,
      }
      break
    case stateChangeTypes.InputBlur:
      changes = {
        isOpen: false,
        ...(state.highlightedIndex >= 0 && {
          selectedItem: props.items[state.highlightedIndex],
          inputValue: props.itemToString(props.items[state.highlightedIndex]),
          highlightedIndex: -1,
        }),
      }
      break
    case stateChangeTypes.InputChange:
      changes = {
        isOpen: true,
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        inputValue: action.inputValue,
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
        highlightedIndex: action.highlightedIndex,
      }
      break
    case stateChangeTypes.FunctionSelectItem:
      changes = {
        selectedItem: action.selectedItem,
      }
      break
    case stateChangeTypes.FunctionSetInputValue:
      changes = {
        inputValue: action.inputValue,
      }
      break
    case stateChangeTypes.FunctionReset:
      changes = {
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
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
