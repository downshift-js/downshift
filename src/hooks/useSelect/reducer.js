import {getNextWrappingIndex, getItemIndexByCharacterKey} from '../utils'
import {
  stateChangeTypes,
  getHighlightedIndexOnOpen,
  getDefaultValue,
} from './utils'

/* eslint-disable complexity */
export default function downshiftSelectReducer(state, action) {
  const {type, props, shiftKey} = action
  let changes

  switch (type) {
    case stateChangeTypes.ItemHover:
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
        ...(state.highlightedIndex >= 0 && {
          selectedItem: props.items[state.highlightedIndex],
        }),
      }
      break
    case stateChangeTypes.MenuKeyDownArrowDown:
      changes = {
        highlightedIndex: getNextWrappingIndex(
          shiftKey ? 5 : 1,
          state.highlightedIndex,
          props.items.length,
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
          props.circularNavigation,
        ),
      }
      break
    case stateChangeTypes.MenuKeyDownHome:
      changes = {
        highlightedIndex: 0,
      }
      break
    case stateChangeTypes.MenuKeyDownEnd:
      changes = {
        highlightedIndex: props.items.length - 1,
      }
      break
    case stateChangeTypes.MenuKeyDownEscape:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
      }
      break
    case stateChangeTypes.MenuKeyDownEnter:
      changes = {
        isOpen: getDefaultValue(props, 'isOpen'),
        highlightedIndex: getDefaultValue(props, 'highlightedIndex'),
        selectedItem: props.items[state.highlightedIndex],
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
        )
        changes = {
          keysSoFar,
          ...(highlightedIndex >= 0 && {
            highlightedIndex,
          }),
        }
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownArrowDown: {
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(props, state, 1),
      }
      break
    }
    case stateChangeTypes.ToggleButtonKeyDownArrowUp:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(props, state, -1),
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
    case stateChangeTypes.FunctionSetSelectedItem:
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

  if (props) {
    if (
      props.onIsOpenChange &&
      changes.isOpen !== undefined &&
      changes.isOpen !== state.isOpen
    ) {
      props.onIsOpenChange(changes)
    }
    if (
      props.onHighlightedIndexChange &&
      changes.highlightedIndex !== undefined &&
      changes.highlightedIndex !== state.highlightedIndex
    ) {
      props.onHighlightedIndexChange(changes)
    }
    if (
      props.onSelectedItemChange &&
      changes.selectedItem !== undefined &&
      changes.selectedItem !== state.selectedItem
    ) {
      props.onSelectedItemChange(changes)
    }
    if (props.onStateChange && changes !== undefined) {
      props.onStateChange(changes)
    }
  }

  return {
    ...state,
    ...changes,
  }
}
/* eslint-enable complexity */
