import * as stateChangeTypes from './stateChangeTypes'

/* eslint-disable complexity */
export default function downshiftMultipleSelectionReducer(state, action) {
  const {type, index} = action
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
    case stateChangeTypes.ItemRemoveIconClick: {
      let newActiveIndex

      if (items.length === 1) {
        newActiveIndex = -1
      } else if (index === items.length - 1) {
        newActiveIndex = items.length - 2
      }

      changes = {
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        ...{activeIndex: newActiveIndex},
      }
      break
    }
    case stateChangeTypes.ItemKeyDownDelete: {
      let newActiveIndex

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
    case stateChangeTypes.DropdownArrowLeft:
      changes = {
        activeIndex: items.length - 1,
      }
      break
    case stateChangeTypes.FunctionAddItem:
      changes = {
        items: [...items, action.item],
      }
      break
    default:
      break
  }

  return {
    ...state,
    ...changes,
  }
}
