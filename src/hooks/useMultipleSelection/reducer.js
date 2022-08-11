import {getDefaultValue} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftMultipleSelectionReducer(state, action) {
  const {type, index, props, selectedItem} = action
  const {activeIndex, selectedItems} = state
  let changes

  switch (type) {
    case stateChangeTypes.SelectedItemClick:
      changes = {
        activeIndex: index,
      }

      break
    case stateChangeTypes.SelectedItemKeyDownNavigationPrevious:
      changes = {
        activeIndex: activeIndex - 1 < 0 ? 0 : activeIndex - 1,
      }

      break
    case stateChangeTypes.SelectedItemKeyDownNavigationNext:
      changes = {
        activeIndex:
          activeIndex + 1 >= selectedItems.length ? -1 : activeIndex + 1,
      }

      break
    case stateChangeTypes.SelectedItemKeyDownBackspace:
    case stateChangeTypes.SelectedItemKeyDownDelete: {
      let newActiveIndex = activeIndex

      if (selectedItems.length === 1) {
        newActiveIndex = -1
      } else if (activeIndex === selectedItems.length - 1) {
        newActiveIndex = selectedItems.length - 2
      }

      changes = {
        selectedItems: [
          ...selectedItems.slice(0, activeIndex),
          ...selectedItems.slice(activeIndex + 1),
        ],
        ...{activeIndex: newActiveIndex},
      }

      break
    }
    case stateChangeTypes.DropdownKeyDownNavigationPrevious:
      changes = {
        activeIndex: selectedItems.length - 1,
      }
      break
    case stateChangeTypes.DropdownKeyDownBackspace:
      changes = {
        selectedItems: selectedItems.slice(0, selectedItems.length - 1),
      }
      break
    case stateChangeTypes.FunctionAddSelectedItem:
      changes = {
        selectedItems: [...selectedItems, selectedItem],
      }
      break
    case stateChangeTypes.DropdownClick:
      changes = {
        activeIndex: -1,
      }
      break
    case stateChangeTypes.FunctionRemoveSelectedItem: {
      let newActiveIndex = activeIndex
      const selectedItemIndex = selectedItems.indexOf(selectedItem)

      if (selectedItemIndex >= 0) {
        if (selectedItems.length === 1) {
          newActiveIndex = -1
        } else if (selectedItemIndex === selectedItems.length - 1) {
          newActiveIndex = selectedItems.length - 2
        }

        changes = {
          selectedItems: [
            ...selectedItems.slice(0, selectedItemIndex),
            ...selectedItems.slice(selectedItemIndex + 1),
          ],
          activeIndex: newActiveIndex,
        }
      }
      break
    }
    case stateChangeTypes.FunctionSetSelectedItems: {
      const {selectedItems: newSelectedItems} = action
      changes = {
        selectedItems: newSelectedItems,
      }
      break
    }
    case stateChangeTypes.FunctionSetActiveIndex: {
      const {activeIndex: newActiveIndex} = action
      changes = {
        activeIndex: newActiveIndex,
      }
      break
    }
    case stateChangeTypes.FunctionReset:
      changes = {
        activeIndex: getDefaultValue(props, 'activeIndex'),
        selectedItems: getDefaultValue(props, 'selectedItems'),
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
