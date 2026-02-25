import {getDefaultValue} from '../utils'
import {getNonDisabledIndex, getHighlightedIndex} from '../../utils'
import {
  getHighlightedIndexOnOpen,
  getChangesOnSelection,
  getDefaultHighlightedIndex,
  dropdownDefaultStateValues as defaultStateValues,
} from '../utils.dropdown'
import commonReducer from '../reducer'
import {getItemIndexByCharacterKey} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftSelectReducer(state, props, action) {
  const {type, altKey} = action
  const {
    items,
    initialHighlightedIndex,
    defaultHighlightedIndex,
    isItemDisabled,
    itemToKey,
    itemToString,
    defaultIsOpen,
  } = props
  const {highlightedIndex, selectedItem} = state
  let changes

  switch (type) {
    case stateChangeTypes.ItemClick:
      changes = {
        isOpen: getDefaultValue(defaultIsOpen, defaultStateValues.isOpen),
        highlightedIndex: getDefaultHighlightedIndex({
          defaultHighlightedIndex,
          isItemDisabled,
          items,
        }),
        selectedItem: items[action.index],
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownCharacter:
      {
        const lowercasedKey = action.key
        const inputValue = `${state.inputValue}${lowercasedKey}`
        const prevHighlightedIndex =
          !state.isOpen && state.selectedItem
            ? items.findIndex(
                item => itemToKey(item) === itemToKey(state.selectedItem),
              )
            : highlightedIndex
        const nextHighlightedIndex = getItemIndexByCharacterKey({
          keysSoFar: inputValue,
          highlightedIndex: prevHighlightedIndex,
          items,
          itemToString,
          isItemDisabled,
        })

        changes = {
          inputValue,
          highlightedIndex: nextHighlightedIndex,
          isOpen: true,
        }
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownArrowDown:
      {
        const nextHighlightedIndex = state.isOpen
          ? getHighlightedIndex(
              state.highlightedIndex,
              1,
              items,
              isItemDisabled,
            )
          : altKey && state.selectedItem == null
            ? -1
            : getHighlightedIndexOnOpen({
                items,
                initialHighlightedIndex,
                defaultHighlightedIndex,
                selectedItem,
                itemToKey,
                isItemDisabled,
                highlightedIndex,
                offset: 1,
              })
        changes = {
          highlightedIndex: nextHighlightedIndex,
          isOpen: true,
        }
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownArrowUp:
      if (state.isOpen && altKey) {
        changes = getChangesOnSelection({
          highlightedIndex,
          inputValue: false,
          items,
          itemToString,
          defaultHighlightedIndex,
          defaultIsOpen,
        })
      } else {
        const nextHighlightedIndex = state.isOpen
          ? getHighlightedIndex(
              state.highlightedIndex,
              -1,
              items,
              isItemDisabled,
            )
          : getHighlightedIndexOnOpen({
              items,
              initialHighlightedIndex,
              defaultHighlightedIndex,
              selectedItem,
              itemToKey,
              isItemDisabled,
              highlightedIndex,
              offset: -1,
            })
        changes = {
          highlightedIndex: nextHighlightedIndex,
          isOpen: true,
        }
      }

      break
    // only triggered when menu is open.
    case stateChangeTypes.ToggleButtonKeyDownEnter:
    case stateChangeTypes.ToggleButtonKeyDownSpaceButton:
      changes = getChangesOnSelection({
        highlightedIndex,
        inputValue: false,
        items,
        itemToString,
        defaultHighlightedIndex,
        defaultIsOpen,
      })

      break
    case stateChangeTypes.ToggleButtonKeyDownHome:
      changes = {
        highlightedIndex: getNonDisabledIndex(0, false, items, isItemDisabled),
        isOpen: true,
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownEnd:
      changes = {
        highlightedIndex: getNonDisabledIndex(
          items.length - 1,
          true,
          items,
          isItemDisabled,
        ),
        isOpen: true,
      }

      break
    case stateChangeTypes.ToggleButtonKeyDownPageUp:
      changes = {
        highlightedIndex: getHighlightedIndex(
          state.highlightedIndex,
          -10,
          items,
          isItemDisabled,
        ),
      }
      break
    case stateChangeTypes.ToggleButtonKeyDownPageDown:
      changes = {
        highlightedIndex: getHighlightedIndex(
          state.highlightedIndex,
          10,
          items,
          isItemDisabled,
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
          items?.length && {
            selectedItem: items[state.highlightedIndex],
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
