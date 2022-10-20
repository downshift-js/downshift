import {getHighlightedIndexOnOpen, getDefaultValue} from '../utils'
import {getNextWrappingIndex, getNextNonDisabledIndex} from '../../utils'
import commonReducer from '../reducer'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftUseComboboxReducer(state, action) {
  const {type, props, altKey} = action
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
            1,
            state.highlightedIndex,
            props.items.length,
            action.getItemNodeFromIndex,
            true,
          ),
        }
      } else {
        changes = {
          highlightedIndex:
            altKey && state.selectedItem == null
              ? -1
              : getHighlightedIndexOnOpen(
                  props,
                  state,
                  1,
                  action.getItemNodeFromIndex,
                ),
          isOpen: props.items.length >= 0,
        }
      }
      break
    case stateChangeTypes.InputKeyDownArrowUp:
      if (state.isOpen) {
        if (altKey) {
          changes = {
            isOpen: getDefaultValue(props, 'isOpen'),
            highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
            ...(state.highlightedIndex >= 0 && {
              selectedItem: props.items[state.highlightedIndex],
              inputValue: props.itemToString(
                props.items[state.highlightedIndex],
              ),
            }),
          }
        } else {
          changes = {
            highlightedIndex: getNextWrappingIndex(
              -1,
              state.highlightedIndex,
              props.items.length,
              action.getItemNodeFromIndex,
              true,
            ),
          }
        }
      } else {
        changes = {
          highlightedIndex: getHighlightedIndexOnOpen(
            props,
            state,
            -1,
            action.getItemNodeFromIndex,
          ),
          isOpen: props.items.length >= 0,
        }
      }
      break
    case stateChangeTypes.InputKeyDownEnter:
      changes = {
        isOpen: getDefaultValue(props, 'isOpen'),
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        ...(state.highlightedIndex >= 0 && {
          selectedItem: props.items[state.highlightedIndex],
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
    case stateChangeTypes.InputKeyDownPageUp:
      changes = {
        highlightedIndex: getNextWrappingIndex(
          -10,
          state.highlightedIndex,
          props.items.length,
          action.getItemNodeFromIndex,
          false,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownPageDown:
      changes = {
        highlightedIndex: getNextWrappingIndex(
          10,
          state.highlightedIndex,
          props.items.length,
          action.getItemNodeFromIndex,
          false,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownHome:
      changes = {
        highlightedIndex: getNextNonDisabledIndex(
          1,
          0,
          props.items.length,
          action.getItemNodeFromIndex,
          false,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownEnd:
      changes = {
        highlightedIndex: getNextNonDisabledIndex(
          -1,
          props.items.length - 1,
          props.items.length,
          action.getItemNodeFromIndex,
          false,
        ),
      }
      break
    case stateChangeTypes.InputBlur:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
        ...(state.highlightedIndex >= 0 &&
          action.selectItem && {
            selectedItem: props.items[state.highlightedIndex],
            inputValue: props.itemToString(props.items[state.highlightedIndex]),
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
    case stateChangeTypes.InputFocus:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(props, state, 0),
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
      return commonReducer(state, action, stateChangeTypes)
  }

  return {
    ...state,
    ...changes,
  }
}
/* eslint-enable complexity */
