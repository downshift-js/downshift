/* Internal Types */

import {A11yStatusMessageOptions, DropdownState, Environment} from '../../types'

export type GetItemIndexByCharacterKeyOptions<Item> = {
  keysSoFar: string
  highlightedIndex: number
  items: Item[]
  itemToString(item: Item | null): string
  getItemNodeFromIndex(index: number): HTMLElement | undefined
}

type MenuKeyDownArrowDownAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownArrowDown
  shiftKey: boolean
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type MenuKeyDownArrowUpAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownArrowUp
  shiftKey: boolean
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type MenuKeyDownEscapeAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownEscape
}
type MenuKeyDownHomeAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownHome
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type MenuKeyDownEndAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownEnd
  getItemNodeFromIndex: (index: number) => HTMLElement

}
type MenuKeyDownEnterAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownEnter
}
type MenuKeyDownSpaceButtonAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownSpaceButton
}
type MenuKeyDownCharacterAction = {
  type: UseSelectStateChangeTypes.MenuKeyDownCharacter
  key: string
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type MenuBlurAction = {
  type: UseSelectStateChangeTypes.MenuBlur
}
type MenuMouseLeaveAction = {
  type: UseSelectStateChangeTypes.MenuMouseLeave
}
type ItemMouseMoveAction = {
  type: UseSelectStateChangeTypes.ItemMouseMove
}
type ItemClickAction = {
  type: UseSelectStateChangeTypes.ItemClick
}
type ToggleButtonKeyDownCharacterAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownCharacter
  key: string
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type ToggleButtonKeyDownArrowDownAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownArrowDown
  shiftKey: boolean
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type ToggleButtonKeyDownArrowUpAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownArrowUp
  shiftKey: boolean
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type FunctionToggleMenuAction = {
  type: UseSelectStateChangeTypes.FunctionToggleMenu
}
type FunctionOpenMenuAction = {
  type: UseSelectStateChangeTypes.FunctionOpenMenu
}
type FunctionCloseMenuAction = {
  type: UseSelectStateChangeTypes.FunctionCloseMenu
}
type FunctionSetHighlightedIndexAction = {
  type: UseSelectStateChangeTypes.FunctionSetHighlightedIndex
  highlightedIndex: number
}
type FunctionSelectItemAction<Item> = {
  type: UseSelectStateChangeTypes.FunctionSelectItem
  selectedItem: Item
}
type FunctionSetInputValueAction = {
  type: UseSelectStateChangeTypes.FunctionSetInputValue
  inputValue: string
}
type FunctionResetAction = {
  type: UseSelectStateChangeTypes.FunctionReset
}

export type UseSelectDispatchProps<Item> =
  | MenuKeyDownArrowDownAction
  | MenuKeyDownArrowUpAction
  | MenuKeyDownEscapeAction
  | MenuKeyDownHomeAction
  | MenuKeyDownEndAction
  | MenuKeyDownEnterAction
  | MenuKeyDownSpaceButtonAction
  | MenuKeyDownCharacterAction
  | MenuBlurAction
  | MenuMouseLeaveAction
  | ItemMouseMoveAction
  | ItemClickAction
  | ToggleButtonKeyDownCharacterAction
  | ToggleButtonKeyDownArrowDownAction
  | ToggleButtonKeyDownArrowUpAction
  | FunctionToggleMenuAction
  | FunctionOpenMenuAction
  | FunctionCloseMenuAction
  | FunctionSetHighlightedIndexAction
  | FunctionSelectItemAction<Item>
  | FunctionSetInputValueAction
  | FunctionResetAction

  export type UseSelectStateChangeOptions<Item> = UseSelectDispatchProps<
  Item
> & {
  changes: Partial<UseSelectState<Item>>
}

/* External Types */

export type UseSelectState<Item> = DropdownState<Item>

export enum UseSelectStateChangeTypes {
  MenuKeyDownArrowDown = '__menu_keydown_arrow_down__',
  MenuKeyDownArrowUp = '__menu_keydown_arrow_up__',
  MenuKeyDownEscape = '__menu_keydown_escape__',
  MenuKeyDownHome = '__menu_keydown_home__',
  MenuKeyDownEnd = '__menu_keydown_end__',
  MenuKeyDownEnter = '__menu_keydown_enter__',
  MenuKeyDownSpaceButton = '__menu_keydown_space_button__',
  MenuKeyDownCharacter = '__menu_keydown_character__',
  MenuBlur = '__menu_blur__',
  MenuMouseLeave = '__menu_mouse_leave__',
  ItemMouseMove = '__item_mouse_move__',
  ItemClick = '__item_click__',
  ToggleButtonKeyDownCharacter = '__togglebutton_keydown_character__',
  ToggleButtonKeyDownArrowDown = '__togglebutton_keydown_arrow_down__',
  ToggleButtonKeyDownArrowUp = '__togglebutton_keydown_arrow_up__',
  FunctionToggleMenu = '__function_toggle_menu__',
  FunctionOpenMenu = '__function_open_menu__',
  FunctionCloseMenu = '__function_close_menu__',
  FunctionSetHighlightedIndex = '__function_set_highlighted_index__',
  FunctionSelectItem = '__function_select_item__',
  FunctionSetInputValue = '__function_set_input_value__',
  FunctionReset = '__function_reset__',
}

export type UseSelectStateChange<Item> = Partial<UseSelectState<Item>> & {
  type: UseSelectStateChangeTypes
}

export type UseSelectProps<Item> = {
  items: Item[]
  itemToString?: (item: Item | null) => string
  getA11yStatusMessage?: (options: A11yStatusMessageOptions<Item>) => string
  getA11ySelectionMessage?: (options: A11yStatusMessageOptions<Item>) => string
  circularNavigation?: boolean
  highlightedIndex?: number
  initialHighlightedIndex?: number
  defaultHighlightedIndex?: number
  isOpen?: boolean
  initialIsOpen?: boolean
  defaultIsOpen?: boolean
  selectedItem?: Item | null
  initialSelectedItem?: Item | null
  defaultSelectedItem?: Item | null
  id?: string
  labelId?: string
  menuId?: string
  toggleButtonId?: string
  getItemId?: (index: number) => string
  scrollIntoView?: (node: HTMLElement, menuNode: HTMLElement) => void
  stateReducer?: (
    state: UseSelectState<Item>,
    actionAndChanges: UseSelectStateChangeOptions<Item>,
  ) => Partial<UseSelectState<Item>>
  onSelectedItemChange?: (changes: UseSelectStateChange<Item>) => void
  onIsOpenChange?: (changes: UseSelectStateChange<Item>) => void
  onHighlightedIndexChange?: (changes: UseSelectStateChange<Item>) => void
  onStateChange?: (changes: UseSelectStateChange<Item>) => void
  environment?: Environment
}
