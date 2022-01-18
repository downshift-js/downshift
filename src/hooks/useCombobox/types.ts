import {A11yStatusMessageOptions, DropdownState, Environment} from '../../types'

/* Internal Types */

export interface GetInputPropsOptions
  extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean
}

type InputKeyDownArrowDownAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownArrowDown
  shiftKey: boolean
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type InputKeyDownArrowUpAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownArrowUp
  shiftKey: boolean
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type InputKeyDownEscapeAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownEscape
}
type InputKeyDownHomeAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownHome
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type InputKeyDownEndAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownEnd
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type InputKeyDownEnterAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownEnter
  getItemNodeFromIndex: (index: number) => HTMLElement
}
type InputChangeAction = {
  type: UseComboboxStateChangeTypes.InputChange
  inputValue: string
}
type InputBlurAction = {
  type: UseComboboxStateChangeTypes.InputBlur
  selectItem: boolean
}
type MenuMouseLeaveAction = {
  type: UseComboboxStateChangeTypes.MenuMouseLeave
}
type ItemMouseMoveAction = {
  type: UseComboboxStateChangeTypes.ItemMouseMove
  index: number
}
type ItemClickAction = {
  type: UseComboboxStateChangeTypes.ItemClick
  index: number
}
type ToggleButtonClickAction = {
  type: UseComboboxStateChangeTypes.ToggleButtonClick
}
type FunctionToggleMenuAction = {
  type: UseComboboxStateChangeTypes.FunctionToggleMenu
}
type FunctionOpenMenuAction = {
  type: UseComboboxStateChangeTypes.FunctionOpenMenu
}
type FunctionCloseMenuAction = {
  type: UseComboboxStateChangeTypes.FunctionCloseMenu
}
type FunctionSetHighlightedIndexAction = {
  type: UseComboboxStateChangeTypes.FunctionSetHighlightedIndex
  highlightedIndex: number
}
type FunctionSelectItemAction<Item> = {
  type: UseComboboxStateChangeTypes.FunctionSelectItem
  selectedItem: Item
}
type FunctionSetInputValueAction = {
  type: UseComboboxStateChangeTypes.FunctionSetInputValue
  inputValue: string
}
type FunctionResetAction = {
  type: UseComboboxStateChangeTypes.FunctionReset
}
type ControlledPropUpdatedSelectedItemAction = {
  type: UseComboboxStateChangeTypes.ControlledPropUpdatedSelectedItem
}

export type UseComboboxDispatchProps<Item> =
  | InputKeyDownArrowDownAction
  | InputKeyDownArrowUpAction
  | InputKeyDownEscapeAction
  | InputKeyDownHomeAction
  | InputKeyDownEndAction
  | InputKeyDownEnterAction
  | InputChangeAction
  | InputBlurAction
  | MenuMouseLeaveAction
  | ItemMouseMoveAction
  | ItemClickAction
  | ToggleButtonClickAction
  | FunctionToggleMenuAction
  | FunctionOpenMenuAction
  | FunctionCloseMenuAction
  | FunctionSetHighlightedIndexAction
  | FunctionSelectItemAction<Item>
  | FunctionSetInputValueAction
  | FunctionResetAction
  | ControlledPropUpdatedSelectedItemAction

export type UseComboboxStateChangeOptions<Item> = UseComboboxDispatchProps<
  Item
> & {
  changes: Partial<UseComboboxState<Item>>
}

/* External Types */

export type UseComboboxState<Item> = DropdownState<Item>

export enum UseComboboxStateChangeTypes {
  InputKeyDownArrowDown = '__input_keydown_arrow_down__',
  InputKeyDownArrowUp = '__input_keydown_arrow_up__',
  InputKeyDownEscape = '__input_keydown_escape__',
  InputKeyDownHome = '__input_keydown_home__',
  InputKeyDownEnd = '__input_keydown_end__',
  InputKeyDownEnter = '__input_keydown_enter__',
  InputChange = '__input_change__',
  InputBlur = '__input_blur__',
  MenuMouseLeave = '__menu_mouse_leave__',
  ItemMouseMove = '__item_mouse_move__',
  ItemClick = '__item_click__',
  ToggleButtonClick = '__togglebutton_click__',
  FunctionToggleMenu = '__function_toggle_menu__',
  FunctionOpenMenu = '__function_open_menu__',
  FunctionCloseMenu = '__function_close_menu__',
  FunctionSetHighlightedIndex = '__function_set_highlighted_index__',
  FunctionSelectItem = '__function_select_item__',
  FunctionSetInputValue = '__function_set_input_value__',
  FunctionReset = '__function_reset__',
  ControlledPropUpdatedSelectedItem = '__controlled_prop_updated_selected_item__',
}

export type UseComboboxStateChange<Item> = Partial<UseComboboxState<Item>> & {
  type: UseComboboxStateChangeTypes
}

export type UseComboboxProps<Item> = {
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
  inputValue?: string
  initialInputValue?: string
  defaultInputValue?: string
  id?: string
  labelId?: string
  menuId?: string
  toggleButtonId?: string
  inputId?: string
  getItemId?: (index: number) => string
  scrollIntoView?: (node: HTMLElement, menuNode: HTMLElement) => void
  stateReducer?: (
    state: UseComboboxState<Item>,
    actionAndChanges: UseComboboxStateChangeOptions<Item>,
  ) => Partial<UseComboboxState<Item>>
  onSelectedItemChange?: (changes: UseComboboxStateChange<Item>) => void
  onIsOpenChange?: (changes: UseComboboxStateChange<Item>) => void
  onHighlightedIndexChange?: (changes: UseComboboxStateChange<Item>) => void
  onStateChange?: (changes: UseComboboxStateChange<Item>) => void
  onInputValueChange?: (changes: UseComboboxStateChange<Item>) => void
  environment?: Environment
}
