import {getHighlightedIndexOnOpen, getDefaultValue} from '../utils'
import {getNextWrappingIndex, getNextNonDisabledIndex} from '../../utils'
import commonReducer from '../reducer'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftUseComboboxReducer(state, action) {
  const {type, props, shiftKey} = action
  let changes

  switch (type) {
    case stateChangeTypes.ItemClick:
      changes = {
        isOpen: getDefaultValue(props, 'isOpen'),
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        selectedItem: props.items[action.index],
        inputValue: props.itemToString(props.items[action.index]),
      }
      break
    case stateChangeTypes.InputKeyDownArrowDown:
      if (state.isOpen) {
        changes = {
          highlightedIndex: getNextWrappingIndex(
            shiftKey ? 5 : 1,
            state.highlightedIndex,
            props.items.length,
            action.getItemNodeFromIndex,
            props.circularNavigation,
          ),
        }
      } else {
        changes = {
          highlightedIndex: getHighlightedIndexOnOpen(
            props,
            state,
            1,
            action.getItemNodeFromIndex,
          ),
          isOpen: true,
        }
      }
      break
    case stateChangeTypes.InputKeyDownArrowUp:
      if (state.isOpen) {
        changes = {
          highlightedIndex: getNextWrappingIndex(
            shiftKey ? -5 : -1,
            state.highlightedIndex,
            props.items.length,
            action.getItemNodeFromIndex,
            props.circularNavigation,
          ),
        }
      } else {
        changes = {
          highlightedIndex: getHighlightedIndexOnOpen(
            props,
            state,
            -1,
            action.getItemNodeFromIndex,
          ),
          isOpen: true,
        }
      }
      break
    case stateChangeTypes.InputKeyDownEnter:
      changes = {
        ...(state.isOpen &&
          state.highlightedIndex >= 0 && {
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
        highlightedIndex: -1,
        ...(!state.isOpen && {
          selectedItem: null,
          inputValue: '',
        }),
      }
      break
    case stateChangeTypes.InputKeyDownHome:
      changes = {
        ...(state.isOpen && {
          highlightedIndex: getNextNonDisabledIndex(
            1,
            0,
            props.items.length,
            action.getItemNodeFromIndex,
            false,
          ),
        }),
      }
      break
    case stateChangeTypes.InputKeyDownEnd:
      changes = {
        ...(state.isOpen && {
          highlightedIndex: getNextNonDisabledIndex(
            -1,
            props.items.length - 1,
            props.items.length,
            action.getItemNodeFromIndex,
            false,
          ),
        }),
      }
      break
    case stateChangeTypes.InputBlur:
      if (state.isOpen) {
        changes = {
          isOpen: false,
          highlightedIndex: -1,
          ...(state.highlightedIndex >= 0 &&
            action.selectItem && {
              selectedItem: props.items[state.highlightedIndex],
              inputValue: props.itemToString(
                props.items[state.highlightedIndex],
              ),
            }),
        }
      }
      break
    case stateChangeTypes.InputChange:
      changes = {
        isOpen: true,
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        inputValue: action.inputValue,
      }
      break
    case stateChangeTypes.FunctionSelectItem:
      changes = {
        selectedItem: action.selectedItem,
        inputValue: props.itemToString(action.selectedItem),
      }
      break
    case stateChangeTypes.ControlledPropUpdatedSelectedItem:
      changes = {
        inputValue: action.inputValue,
      }
      break
    default:
      return commonReducer(state, action)
  }

  return {
    ...state,
    ...changes,
  }
}
/* eslint-enable complexity */
