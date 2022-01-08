import * as stateChangeTypes from './stateChangeTypes'
import {
  UseMultipleSelectionState,
  UseMultipleSelectionReducerAction,
} from './types'

/* eslint-disable complexity */
export default function downshiftMultipleSelectionReducer<Item>(
  state: UseMultipleSelectionState<Item>,
  action: UseMultipleSelectionReducerAction<Item>,
): UseMultipleSelectionState<Item> {
  const {selectedItems, activeIndex} = state

  switch (action.type) {
    case stateChangeTypes.SelectedItemClick:
      return {
        selectedItems,
        activeIndex: action.index,
      }
    case stateChangeTypes.SelectedItemKeyDownNavigationPrevious:
      return {
        activeIndex: activeIndex - 1 < 0 ? 0 : activeIndex - 1,
        selectedItems,
      }
    case stateChangeTypes.SelectedItemKeyDownNavigationNext:
      return {
        activeIndex:
          activeIndex + 1 >= selectedItems.length ? -1 : activeIndex + 1,
        selectedItems,
      }
    case stateChangeTypes.SelectedItemKeyDownBackspace:
    case stateChangeTypes.SelectedItemKeyDownDelete: {
      let newActiveIndex = activeIndex

      if (selectedItems.length === 1) {
        newActiveIndex = -1
      } else if (state.activeIndex === selectedItems.length - 1) {
        newActiveIndex = selectedItems.length - 2
      }

      return {
        selectedItems: [
          ...selectedItems.slice(0, activeIndex),
          ...selectedItems.slice(activeIndex + 1),
        ],
        activeIndex: newActiveIndex,
      }
    }
    case stateChangeTypes.DropdownKeyDownNavigationPrevious:
      return {
        activeIndex: selectedItems.length - 1,
        selectedItems,
      }
    case stateChangeTypes.DropdownKeyDownBackspace:
      return {
        selectedItems: selectedItems.slice(0, selectedItems.length - 1),
        activeIndex,
      }
    case stateChangeTypes.FunctionAddSelectedItem:
      return {
        activeIndex,
        selectedItems: [...selectedItems, action.selectedItem],
      }
    case stateChangeTypes.DropdownClick:
      return {
        selectedItems,
        activeIndex: -1,
      }
    case stateChangeTypes.FunctionRemoveSelectedItem: {
      let newActiveIndex = activeIndex
      const selectedItemIndex = selectedItems.indexOf(action.selectedItem)

      if (selectedItems.length === 1) {
        newActiveIndex = -1
      } else if (selectedItemIndex === selectedItems.length - 1) {
        newActiveIndex = selectedItems.length - 2
      }

      return {
        selectedItems: [
          ...selectedItems.slice(0, selectedItemIndex),
          ...selectedItems.slice(selectedItemIndex + 1),
        ],
        activeIndex: newActiveIndex,
      }
    }
    case stateChangeTypes.FunctionSetSelectedItems: {
      return {
        selectedItems: action.selectedItems,
        activeIndex,
      }
    }
    case stateChangeTypes.FunctionSetActiveIndex: {
      return {
        activeIndex: action.activeIndex,
        selectedItems,
      }
    }
    case stateChangeTypes.FunctionReset: {
      const {props} = action

      return {
        activeIndex: props.activeIndex ?? props.defaultActiveIndex ?? -1,
        selectedItems: props.selectedItems ?? props.defaultSelectedItems ?? [],
      }
    }
    default:
      throw new Error('Reducer called without proper action type.')
  }
}
