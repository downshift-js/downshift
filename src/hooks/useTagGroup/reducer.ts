import {UseTagGroupReducerAction, UseTagGroupState} from './index.types'
import * as stateChangeTypes from './stateChangeTypes'

export function useTagGroupReducer<Item>(
  state: UseTagGroupState<Item>,
  action: UseTagGroupReducerAction<Item>,
): UseTagGroupState<Item> {
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
    case stateChangeTypes.TagGroupKeyDownBackspace:
    case stateChangeTypes.TagGroupKeyDownDelete: {
      const newItems = [
        ...state.items.slice(0, state.activeIndex),
        ...state.items.slice(state.activeIndex + 1),
      ]
      const newActiveIndex =
        newItems.length === 0
          ? -1
          : newItems.length === state.activeIndex
          ? state.activeIndex - 1
          : state.activeIndex
      changes = {
        items: [
          ...state.items.slice(0, state.activeIndex),
          ...state.items.slice(state.activeIndex + 1),
        ],
        activeIndex: newActiveIndex,
      }
      break
    }
    case stateChangeTypes.TagRemoveClick:
      {
        const newItems = [
          ...state.items.slice(0, action.index),
          ...state.items.slice(action.index + 1),
        ]
        const newActiveIndex =
          newItems.length === 0
            ? -1
            : newItems.length === action.index
            ? action.index - 1
            : action.index
        changes = {
          items: newItems,
          activeIndex: newActiveIndex,
        }
      }
      break
    case stateChangeTypes.FunctionAddItem: {
      let newItems: Item[] = []
      let newActiveIndex = state.activeIndex

      if (action.index === undefined) {
        newItems = [...state.items, action.item]
      } else {
        newItems = [
          ...state.items.slice(0, action.index),
          action.item,
          ...state.items.slice(action.index),
        ]

        if (action.index >= state.activeIndex) {
          newActiveIndex = state.activeIndex - 1
        }
      }

      changes = {
        items: newItems,
        activeIndex: newActiveIndex,
      }
      break
    }
    default:
      throw new Error('Invalid useTagGroup reducer action.')
  }

  return {...state, ...changes}
}
