import {
  getDefaultValue,
  dropdownDefaultStateValues,
  getDefaultHighlightedIndex,
  getHighlightedIndexOnOpen,
} from '.'

type CommonState<Item> = {
  highlightedIndex: number
  isOpen: boolean
  selectedItem: Item | null
  inputValue: string
}

type CommonProps<Item> = {
  items: Item[]
  isItemDisabled: (item: Item, index: number) => boolean
  itemToKey: (item: Item | null) => unknown
  initialHighlightedIndex?: number
  defaultHighlightedIndex?: number
  defaultIsOpen?: boolean
  defaultSelectedItem?: Item | null
  defaultInputValue?: string
}

type CommonAction<Item> = {
  type: string
  index?: number
  disabled?: boolean
  highlightedIndex?: number
  inputValue?: string
  selectedItem?: Item | null
}

type CommonStateChangeTypes = Record<string, string>

export default function downshiftCommonReducer<Item>(
  state: CommonState<Item>,
  props: CommonProps<Item>,
  action: CommonAction<Item>,
  stateChangeTypes: CommonStateChangeTypes,
): CommonState<Item> {
  const {type} = action
  let changes: Partial<CommonState<Item>>

  switch (type) {
    case stateChangeTypes.ItemMouseMove:
      changes = {
        highlightedIndex: action.disabled ? -1 : action.index,
      }

      break
    case stateChangeTypes.MenuMouseLeave:
      changes = {
        highlightedIndex: -1,
      }

      break
    case stateChangeTypes.ToggleButtonClick:
    case stateChangeTypes.FunctionToggleMenu:
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
    case stateChangeTypes.FunctionOpenMenu:
      changes = {
        isOpen: true,
        highlightedIndex: getHighlightedIndexOnOpen(
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
    case stateChangeTypes.FunctionCloseMenu:
      changes = {
        isOpen: false,
      }

      break
    case stateChangeTypes.FunctionSetHighlightedIndex:
      {
        const highlightedIndex = action.highlightedIndex as number
        changes = {
          highlightedIndex: props.isItemDisabled(
            props.items[highlightedIndex] as Item,
            highlightedIndex,
          )
            ? -1
            : highlightedIndex,
        }
      }

      break
    case stateChangeTypes.FunctionSetInputValue:
      changes = {
        inputValue: action.inputValue,
      }

      break
    case stateChangeTypes.FunctionReset:
      changes = {
        highlightedIndex: getDefaultHighlightedIndex(
          props.items,
          props.isItemDisabled,
          props.defaultHighlightedIndex,
        ),
        isOpen: getDefaultValue(
          props.defaultIsOpen,
          dropdownDefaultStateValues.isOpen,
        ),
        selectedItem: getDefaultValue(
          props.defaultSelectedItem,
          dropdownDefaultStateValues.selectedItem,
        ),
        inputValue: getDefaultValue(
          props.defaultInputValue,
          dropdownDefaultStateValues.inputValue,
        ),
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
/* eslint-enable complexity */
