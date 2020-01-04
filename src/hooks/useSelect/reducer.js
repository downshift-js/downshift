import {getHighlightedIndexOnOpen} from '../utils'
import {getNextWrappingIndex, getNextNonDisabledIndex} from '../../utils'
import {getDefaultValue, getItemIndexByCharacterKey} from './utils'
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
    case stateChangeTypes.MenuBlur:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
      }
      break
    case stateChangeTypes.MenuKeyDownArrowDown:
      changes = {
        highlightedIndex: getNextWrappingIndex(
          shiftKey ? 5 : 1,
          state.highlightedIndex,
          props.items.length,
          action.getItemNodeFromIndex,
          props.circularNavigation,
        ),
      }
      break
    case stateChangeTypes.MenuKeyDownArrowUp:
      changes = {
        highlightedIndex: getNextWrappingIndex(
          shiftKey ? -5 : -1,
          state.highlightedIndex,
          props.items.length,
          action.getItemNodeFromIndex,
          props.circularNavigation,
        ),
      }
      break
    case stateChangeTypes.MenuKeyDownHome:
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
    case stateChangeTypes.MenuKeyDownEnd:
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
    case stateChangeTypes.MenuKeyDownEscape:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
      }
      break
    case stateChangeTypes.MenuKeyDownEnter:
    case stateChangeTypes.MenuKeyDownSpaceButton:
      changes = {
        isOpen: getDefaultValue(props, 'isOpen'),
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        ...(state.highlightedIndex >= 0 && {
          selectedItem: props.items[state.highlightedIndex],
        }),
      }
      break
    case stateChangeTypes.MenuKeyDownCharacter:
      {
        const lowercasedKey = action.key
        const keysSoFar = `${state.keysSoFar}${lowercasedKey}`
        const highlightedIndex = getItemIndexByCharacterKey(
          keysSoFar,
          state.highlightedIndex,
          props.items,
          props.itemToString,
          action.getItemNodeFromIndex,
        )
        changes = {
          keysSoFar,
          ...(highlightedIndex >= 0 && {
            highlightedIndex,
          }),
        }
      }
      break
    case stateChangeTypes.MenuMouseLeave:
      changes = {
        highlightedIndex: -1,
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownCharacter:
      {
        const lowercasedKey = action.key
        const keysSoFar = `${state.keysSoFar}${lowercasedKey}`
        const itemIndex = getItemIndexByCharacterKey(
          keysSoFar,
          state.selectedItem ? props.items.indexOf(state.selectedItem) : -1,
          props.items,
          props.itemToString,
          action.getItemNodeFromIndex,
        )
        changes = {
          keysSoFar,
          ...(itemIndex >= 0 && {
            selectedItem: props.items[itemIndex],
          }),
        }
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownArrowDown: {
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(
          props,
          state,
          1,
          action.getItemNodeFromIndex,
        ),
      }
      break
    }
    case stateChangeTypes.ToggleButtonKeyDownArrowUp:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(
          props,
          state,
          -1,
          action.getItemNodeFromIndex,
        ),
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
    case stateChangeTypes.FunctionClearKeysSoFar:
      changes = {
        keysSoFar: '',
      }
      break
    case stateChangeTypes.FunctionReset:
      changes = {
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        isOpen: getDefaultValue(props, 'isOpen'),
        selectedItem: getDefaultValue(props, 'selectedItem'),
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
