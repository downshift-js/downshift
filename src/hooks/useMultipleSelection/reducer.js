import {getDefaultValue} from './utils'
import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftMultipleSelectionReducer(state, action) {
  const {type, index, props, item} = action
  const {activeIndex, items} = state
  let changes

  switch (type) {
    case stateChangeTypes.ItemClick:
      changes = {
        activeIndex: index,
      }

      break
    case stateChangeTypes.ItemKeyDownArrowLeft:
      changes = {
        activeIndex: activeIndex - 1 < 0 ? 0 : activeIndex - 1,
      }

      break
    case stateChangeTypes.ItemKeyDownArrowRight:
      changes = {
        activeIndex: activeIndex + 1 >= items.length ? -1 : activeIndex + 1,
      }

      break
    case stateChangeTypes.ItemKeyDownBackspace:
    case stateChangeTypes.ItemKeyDownDelete: {
      let newActiveIndex = activeIndex

      if (items.length === 1) {
        newActiveIndex = -1
      } else if (activeIndex === items.length - 1) {
        newActiveIndex = items.length - 2
      }

      changes = {
        items: [
          ...items.slice(0, activeIndex),
          ...items.slice(activeIndex + 1),
        ],
        ...{activeIndex: newActiveIndex},
      }

      break
    }
    case stateChangeTypes.DropdownKeyDownArrowLeft:
      changes = {
        activeIndex: items.length - 1,
      }
      break
    case stateChangeTypes.DropdownKeyDownBackspace:
      changes = {
        items: items.slice(0, items.length - 1),
      }
      break
    case stateChangeTypes.FunctionAddItem:
      changes = {
        items: [...items, action.item],
      }
      break
    case stateChangeTypes.FunctionRemoveItem: {
      let newActiveIndex = activeIndex
      const itemIndex = items.indexOf(item)

      if (items.length === 1) {
        newActiveIndex = -1
      } else if (itemIndex === items.length - 1) {
        newActiveIndex = items.length - 2
      }

      changes = {
        items: [...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)],
        ...{activeIndex: newActiveIndex},
      }
      break
    }
    case stateChangeTypes.FunctionSetItems: {
      const {items: newItems} = action
      changes = {
        items: newItems,
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
        items: getDefaultValue(props, 'items'),
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
