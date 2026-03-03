import commonReducer from '../reducer'
import {getDefaultValue} from '../utils'
import {getNonDisabledIndex, getHighlightedIndex} from '../../utils'
import {
  getHighlightedIndexOnOpen,
  getChangesOnSelection,
  getDefaultHighlightedIndex,
  dropdownDefaultStateValues,
} from '../utils.dropdown'
import * as stateChangeTypes from './stateChangeTypes'
import {
  UseComboboxDispatchAction,
  UseComboboxMergedProps,
  UseComboboxState,
} from './index.types'

/* eslint-disable complexity */
export default function useComboboxReducer<Item>(
  state: UseComboboxState<Item>,
  props: UseComboboxMergedProps<Item>,
  action: UseComboboxDispatchAction<Item>,
) {
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
  const {highlightedIndex, selectedItem, isOpen} = state
  let changes

  switch (type) {
    case stateChangeTypes.ItemClick: {
      changes = {
        isOpen: getDefaultValue(
          defaultIsOpen,
          dropdownDefaultStateValues.isOpen,
        ),
        highlightedIndex: getDefaultHighlightedIndex({
          defaultHighlightedIndex,
          isItemDisabled,
          items,
        }),
        selectedItem: items[action.index as number],
        inputValue: itemToString(items[action.index as number] as Item),
      }

      break
    }
    case stateChangeTypes.InputKeyDownArrowDown:
      if (isOpen) {
        changes = {
          highlightedIndex: getHighlightedIndex(
            highlightedIndex,
            1,
            items,
            isItemDisabled,
            true,
          ),
        }
      } else {
        changes = {
          highlightedIndex:
            altKey && selectedItem == null
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
                }),
          isOpen: items.length >= 0,
        }
      }
      break
    case stateChangeTypes.InputKeyDownArrowUp:
      if (isOpen) {
        if (altKey) {
          changes = getChangesOnSelection({
            highlightedIndex,
            inputValue: true,
            items,
            itemToString,
            defaultHighlightedIndex,
            defaultIsOpen,
          })
        } else {
          changes = {
            highlightedIndex: getHighlightedIndex(
              highlightedIndex,
              -1,
              items,
              isItemDisabled,
              true,
            ),
          }
        }
      } else {
        changes = {
          highlightedIndex: getHighlightedIndexOnOpen({
            items,
            initialHighlightedIndex,
            defaultHighlightedIndex,
            selectedItem,
            itemToKey,
            isItemDisabled,
            highlightedIndex,
            offset: -1,
          }),
          isOpen: items.length >= 0,
        }
      }
      break
    case stateChangeTypes.InputKeyDownEnter:
      changes = getChangesOnSelection({
        highlightedIndex,
        inputValue: true,
        items,
        itemToString,
        defaultHighlightedIndex,
        defaultIsOpen,
      })

      break
    case stateChangeTypes.InputKeyDownEscape:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
        ...(!isOpen && {
          selectedItem: null,
          inputValue: '',
        }),
      }
      break
    case stateChangeTypes.InputKeyDownPageUp:
      changes = {
        highlightedIndex: getHighlightedIndex(
          highlightedIndex,
          -10,
          items,
          isItemDisabled,
          true,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownPageDown:
      changes = {
        highlightedIndex: getHighlightedIndex(
          highlightedIndex,
          10,
          items,
          isItemDisabled,
          true,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownHome:
      changes = {
        highlightedIndex: getNonDisabledIndex(0, false, items, isItemDisabled),
      }
      break
    case stateChangeTypes.InputKeyDownEnd:
      changes = {
        highlightedIndex: getNonDisabledIndex(
          items.length - 1,
          true,
          items,
          isItemDisabled,
        ),
      }
      break
    case stateChangeTypes.InputBlur:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
        ...(highlightedIndex >= 0 &&
          items.length &&
          action.selectItem && {
            selectedItem: items[highlightedIndex],
            inputValue: itemToString(items[highlightedIndex] as Item),
          }),
      }
      break
    case stateChangeTypes.InputChange:
      changes = {
        isOpen: true,
        highlightedIndex: getDefaultHighlightedIndex({
          defaultHighlightedIndex,
          isItemDisabled,
          items,
        }),
        inputValue: action.inputValue,
      }
      break
    case stateChangeTypes.InputClick:
      changes = {
        isOpen: !isOpen,
        highlightedIndex: isOpen
          ? -1
          : getHighlightedIndexOnOpen({
              items,
              initialHighlightedIndex,
              defaultHighlightedIndex,
              selectedItem,
              itemToKey,
              isItemDisabled,
              highlightedIndex,
              offset: 0,
            }),
      }
      break
    case stateChangeTypes.FunctionSelectItem:
      changes = {
        selectedItem: action.selectedItem,
        inputValue: itemToString(action.selectedItem as Item | null),
      }
      break
    case stateChangeTypes.ControlledPropUpdatedSelectedItem:
      changes = {
        inputValue: action.inputValue,
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
