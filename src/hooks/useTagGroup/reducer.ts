import {UseTagGroupReducerAction, UseTagGroupState} from './index.types'
import * as stateChangeTypes from './stateChangeTypes'

export function useTagGroupReducer(
  state: UseTagGroupState,
  action: UseTagGroupReducerAction,
): UseTagGroupState {
  const {type} = action

  let changes

  switch (type) {
    case stateChangeTypes.TagClick:
      changes = {
        activeIndex: action.index,
      }
      break
    case stateChangeTypes.TagGroupKeyDownArrowLeft:
      changes = {
        activeIndex:
          state.activeIndex === 0
            ? state.items.length - 1
            : state.activeIndex - 1,
      }
      break
    case stateChangeTypes.TagGroupKeyDownArrowRight:
      changes = {
        activeIndex:
          state.activeIndex === state.items.length - 1
            ? 0
            : state.activeIndex + 1,
      }
      break
    default:
      throw new Error('Invalid useTagGroup reducer action.')
  }

  return {...state, ...changes}
}
