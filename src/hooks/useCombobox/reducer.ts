import {getHighlightedIndex, getNonDisabledIndex} from '../../utils'
import {
  getDefaultValue,
  dropdownDefaultStateValues,
  getDefaultHighlightedIndex,
  getChangesOnSelection,
  getHighlightedIndexOnOpen,
} from '../utils'
import commonReducer from '../reducer'
import * as stateChangeTypes from './stateChangeTypes'
import {
  UseComboboxMergedProps,
  UseComboboxReducerAction,
  UseComboboxState,
} from './index.types'

/* eslint-disable complexity */
export default function downshiftUseComboboxReducer<Item>(
  state: UseComboboxState<Item>,
  action: UseComboboxReducerAction<Item> & {
    props: UseComboboxMergedProps<Item>
  },
): UseComboboxState<Item> {
  const {type, props} = action
  let changes: Partial<UseComboboxState<Item>>

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
        inputValue: props.itemToString(props.items[action.index] as Item),
      }

      break
    case stateChangeTypes.InputKeyDownArrowDown:
      if (state.isOpen) {
        changes = {
          highlightedIndex: getHighlightedIndex(
            state.highlightedIndex,
            1,
            props.items,
            props.isItemDisabled,
            true,
          ),
        }
      } else {
        changes = {
          highlightedIndex:
            action.altKey && state.selectedItem == null
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
                ),
          isOpen: props.items.length >= 0,
        }
      }
      break
    case stateChangeTypes.InputKeyDownArrowUp:
      if (state.isOpen) {
        if (action.altKey) {
          changes = getChangesOnSelection(
            props.items,
            props.itemToString,
            props.defaultIsOpen,
            props.defaultHighlightedIndex,
            state.highlightedIndex,
            true,
          )
        } else {
          changes = {
            highlightedIndex: getHighlightedIndex(
              state.highlightedIndex,
              -1,
              props.items,
              props.isItemDisabled,
              true,
            ),
          }
        }
      } else {
        changes = {
          highlightedIndex: getHighlightedIndexOnOpen(
            props.items,
            props.initialHighlightedIndex,
            props.defaultHighlightedIndex,
            props.isItemDisabled,
            props.itemToKey,
            state.selectedItem,
            state.highlightedIndex,
            -1,
          ),
          isOpen: props.items.length >= 0,
        }
      }
      break
    case stateChangeTypes.InputKeyDownEnter:
      changes = getChangesOnSelection(
        props.items,
        props.itemToString,
        props.defaultIsOpen,
        props.defaultHighlightedIndex,
        state.highlightedIndex,
        true,
      )

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
        highlightedIndex: getHighlightedIndex(
          state.highlightedIndex,
          -10,
          props.items,
          props.isItemDisabled,
          true,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownPageDown:
      changes = {
        highlightedIndex: getHighlightedIndex(
          state.highlightedIndex,
          10,
          props.items,
          props.isItemDisabled,
          true,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownHome:
      changes = {
        highlightedIndex: getNonDisabledIndex(
          0,
          false,
          props.items,
          props.isItemDisabled,
        ),
      }
      break
    case stateChangeTypes.InputKeyDownEnd:
      changes = {
        highlightedIndex: getNonDisabledIndex(
          props.items.length - 1,
          true,
          props.items,
          props.isItemDisabled,
        ),
      }
      break
    case stateChangeTypes.InputBlur:
      changes = {
        isOpen: false,
        highlightedIndex: -1,
        ...(state.highlightedIndex >= 0 &&
          props.items.length &&
          action.selectItem && {
            selectedItem: props.items[state.highlightedIndex],
            inputValue: props.itemToString(
              props.items[state.highlightedIndex] as Item,
            ),
          }),
      }
      break
    case stateChangeTypes.InputChange:
      changes = {
        isOpen: true,
        highlightedIndex: getDefaultHighlightedIndex(
          props.items,
          props.isItemDisabled,
          props.defaultHighlightedIndex,
        ),
        inputValue: action.inputValue,
      }
      break
    case stateChangeTypes.InputClick:
      changes = {
        isOpen: !state.isOpen,
        highlightedIndex: state.isOpen
          ? -1
          : getHighlightedIndexOnOpen(
              props.items,
              props.initialHighlightedIndex,
              props.defaultHighlightedIndex,
              props.isItemDisabled,
              props.itemToKey,
              state.selectedItem,
              state.highlightedIndex,
              0,
            ),
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
      return commonReducer(state, props, action, stateChangeTypes)
  }

  return {
    ...state,
    ...changes,
  }
}
/* eslint-enable complexity */
