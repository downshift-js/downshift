import {getNextWrappingIndex, getNextNonDisabledIndex} from '../../utils'
import {getHighlightedIndexOnOpen, getDefaultValue} from '../utils'
import {getItemIndexByCharacterKey} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftSelectReducer(state, action) {
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
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownCharacter:
      {
        const lowercasedKey = action.key
        const inputValue = `${state.inputValue}${lowercasedKey}`
        const itemIndex = getItemIndexByCharacterKey(
          inputValue,
          state.isOpen
            ? state.highlightedIndex
            : state.selectedItem
            ? props.items.indexOf(state.selectedItem)
            : -1,
          props.items,
          props.itemToString,
          action.getItemNodeFromIndex,
        )
        changes = {
          inputValue,
          ...(itemIndex >= 0 && {
            ...(state.isOpen
              ? {highlightedIndex: itemIndex}
              : {selectedItem: props.items[itemIndex]}),
          }),
        }
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownArrowDown:
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
    case stateChangeTypes.ToggleButtonKeyDownArrowUp:
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
    case stateChangeTypes.ToggleButtonKeyDownEnter:
    case stateChangeTypes.ToggleButtonKeyDownSpaceButton:
      if (state.isOpen) {
        changes = {
          isOpen: getDefaultValue(props, 'isOpen'),
          highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
          ...(state.highlightedIndex >= 0 && {
            selectedItem: props.items[state.highlightedIndex],
          }),
        }
      } else {
        changes = {
          isOpen: true,
          highlightedIndex: state.isOpen
            ? -1
            : getHighlightedIndexOnOpen(props, state, 0),
        }
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownHome:
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
    case stateChangeTypes.ToggleButtonKeyDownEnd:
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
    case stateChangeTypes.ToggleButtonKeyDownEscape:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
      }
      break
    case stateChangeTypes.ToggleButtonBlur:
      if (state.isOpen) {
        changes = {
          isOpen: false,
          highlightedIndex: -1,
        }
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
