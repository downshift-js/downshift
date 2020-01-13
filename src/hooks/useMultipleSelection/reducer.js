import * as stateChangeTypes from './stateChangeTypes'

export default function downshiftMultipleSelectionReducer(state, action) {
  const {type, index} = action
  const {activeIndex} = state
  const {items} = action.props
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
    case stateChangeTypes.ItemRemoveIconClick:
    case stateChangeTypes.ItemKeyDownDelete:
      changes = {
        activeIndex: items.length === 1 ? -1 : activeIndex - 1,
      }
      break
    case stateChangeTypes.DropdownArrowLeft:
      changes = {
        activeIndex: items.length - 1,
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
