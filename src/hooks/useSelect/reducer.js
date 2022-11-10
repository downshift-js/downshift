import {getNextWrappingIndex, getNextNonDisabledIndex} from '../../utils'
import {getHighlightedIndexOnOpen, getDefaultValue} from '../utils'
import commonReducer from '../reducer'
import {getItemIndexByCharacterKey} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftSelectReducer(state, action) {
  const {type, props, altKey} = action
  let changes

  switch (type) {
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
        const prevHighlightedIndex =
          !state.isOpen && state.selectedItem
            ? props.items.indexOf(state.selectedItem)
            : state.highlightedIndex
        const highlightedIndex = getItemIndexByCharacterKey({
          keysSoFar: inputValue,
          highlightedIndex: prevHighlightedIndex,
          items: props.items,
          itemToString: props.itemToString,
          getItemNodeFromIndex: action.getItemNodeFromIndex,
        })

        changes = {
          inputValue,
          highlightedIndex,
          isOpen: true,
        }
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownArrowDown:
      {
        const highlightedIndex = state.isOpen
          ? getNextWrappingIndex(
              1,
              state.highlightedIndex,
              props.items.length,
              action.getItemNodeFromIndex,
              false,
            )
          : altKey && state.selectedItem == null
          ? -1
          : getHighlightedIndexOnOpen(props, state, 1)
        changes = {
          highlightedIndex,
          isOpen: true,
        }
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownArrowUp:
      if (state.isOpen && altKey) {
        changes = {
          isOpen: getDefaultValue(props, 'isOpen'),
          highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
          ...(state.highlightedIndex >= 0 && {
            selectedItem: props.items[state.highlightedIndex],
          }),
        }
      } else {
        const highlightedIndex = state.isOpen
          ? getNextWrappingIndex(
              -1,
              state.highlightedIndex,
              props.items.length,
              action.getItemNodeFromIndex,
              false,
            )
          : getHighlightedIndexOnOpen(props, state, -1)
        changes = {
          highlightedIndex,
          isOpen: true,
        }
      }

      break
    // only triggered when menu is open.
    case stateChangeTypes.ToggleButtonKeyDownEnter:
    case stateChangeTypes.ToggleButtonKeyDownSpaceButton:
      changes = {
        isOpen: getDefaultValue(props, 'isOpen'),
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        ...(state.highlightedIndex >= 0 && {
          selectedItem: props.items[state.highlightedIndex],
        }),
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
        isOpen: true,
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
        isOpen: true,
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownPageUp:
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
    case stateChangeTypes.ToggleButtonKeyDownPageDown:
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
    case stateChangeTypes.ToggleButtonKeyDownEscape:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
      }

      break
    case stateChangeTypes.ToggleButtonBlur:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
        ...(state.highlightedIndex >= 0 && {
          selectedItem: props.items[state.highlightedIndex],
        }),
      }

      break
    case stateChangeTypes.FunctionSelectItem:
      changes = {
        selectedItem: action.selectedItem,
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
