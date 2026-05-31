import {getHighlightedIndex, getNonDisabledIndex} from '../../utils'
import {
  getDefaultValue,
  dropdownDefaultStateValues,
  getDefaultHighlightedIndex,
  getChangesOnSelection,
  getHighlightedIndexOnOpen,
} from '../utils'
import commonReducer from '../utils/reducer'

import {getItemIndexByCharacterKey} from './utils'
import * as stateChangeTypes from './stateChangeTypes'
import {
  UseSelectMergedProps,
  UseSelectReducerAction,
  UseSelectState,
} from './index.types'

/* eslint-disable complexity */
export default function downshiftSelectReducer<Item>(
  state: UseSelectState<Item>,
  action: UseSelectReducerAction<Item> & {
    props: UseSelectMergedProps<Item>
  },
): UseSelectState<Item> {
  const {type, props} = action
  let changes: Partial<UseSelectState<Item>>

  switch (type) {
    case stateChangeTypes.ItemClick:
      changes = {
        isOpen: getDefaultValue(
          props.defaultIsOpen,
          dropdownDefaultStateValues.isOpen,
        ),
        highlightedIndex: getDefaultHighlightedIndex(
          props.items,
          props.isItemDisabled,
          props.defaultHighlightedIndex,
        ),
        selectedItem: props.items[action.index],
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownCharacter:
      {
        const lowercasedKey = action.key
        const inputValue = `${state.inputValue}${lowercasedKey}`
        const prevHighlightedIndex =
          !state.isOpen && state.selectedItem
            ? props.items.findIndex(
                item =>
                  props.itemToKey(item) === props.itemToKey(state.selectedItem),
              )
            : state.highlightedIndex
        const highlightedIndex = getItemIndexByCharacterKey({
          keysSoFar: inputValue,
          highlightedIndex: prevHighlightedIndex,
          items: props.items,
          itemToString: props.itemToString,
          isItemDisabled: props.isItemDisabled,
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
        const altKey = action.altKey
        const highlightedIndex = state.isOpen
          ? getHighlightedIndex(
              state.highlightedIndex,
              1,
              props.items,
              props.isItemDisabled,
            )
          : altKey && state.selectedItem == null
            ? -1
            : getHighlightedIndexOnOpen(
                props.items,
                props.initialHighlightedIndex,
                props.defaultHighlightedIndex,
                props.isItemDisabled,
                props.itemToKey,
                state.selectedItem,
                state.highlightedIndex,
                1,
              )
        changes = {
          highlightedIndex,
          isOpen: true,
        }
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownArrowUp:
      {
        const altKey = action.altKey
        if (state.isOpen && altKey) {
          changes = getChangesOnSelection(
            props.items,
            props.itemToString,
            props.defaultIsOpen,
            props.defaultHighlightedIndex,
            state.highlightedIndex,
            false,
          )
        } else {
          const highlightedIndex = state.isOpen
            ? getHighlightedIndex(
                state.highlightedIndex,
                -1,
                props.items,
                props.isItemDisabled,
              )
            : getHighlightedIndexOnOpen(
                props.items,
                props.initialHighlightedIndex,
                props.defaultHighlightedIndex,
                props.isItemDisabled,
                props.itemToKey,
                state.selectedItem,
                state.highlightedIndex,
                -1,
              )
          changes = {
            highlightedIndex,
            isOpen: true,
          }
        }
      }

      break
    // only triggered when menu is open.
    case stateChangeTypes.ToggleButtonKeyDownEnter:
    case stateChangeTypes.ToggleButtonKeyDownSpaceButton:
      changes = getChangesOnSelection(
        props.items,
        props.itemToString,
        props.defaultIsOpen,
        props.defaultHighlightedIndex,
        state.highlightedIndex,
        false,
      )

      break
    case stateChangeTypes.ToggleButtonKeyDownHome:
      changes = {
        highlightedIndex: getNonDisabledIndex(
          0,
          false,
          props.items,
          props.isItemDisabled,
        ),
        isOpen: true,
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownEnd:
      changes = {
        highlightedIndex: getNonDisabledIndex(
          props.items.length - 1,
          true,
          props.items,
          props.isItemDisabled,
        ),
        isOpen: true,
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownPageUp:
      changes = {
        highlightedIndex: getHighlightedIndex(
          state.highlightedIndex,
          -10,
          props.items,
          props.isItemDisabled,
        ),
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownPageDown:
      changes = {
        highlightedIndex: getHighlightedIndex(
          state.highlightedIndex,
          10,
          props.items,
          props.isItemDisabled,
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
        ...(state.highlightedIndex >= 0 &&
          props.items.length && {
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
      return commonReducer(state, props, action, stateChangeTypes)
  }

  return {
    ...state,
    ...changes,
  }
}
/* eslint-enable complexity */
