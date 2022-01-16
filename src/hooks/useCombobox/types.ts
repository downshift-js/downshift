import {A11yStatusMessageOptions, DropdownState, Environment} from '../../types'

export interface GetInputPropsOptions
  extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean
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

export interface UseComboboxDispatchAction<Item> {
  type: UseComboboxStateChangeTypes
  shiftKey?: boolean
  getItemNodeFromIndex?: (index: number) => HTMLElement
  inputValue?: string
  index?: number
  highlightedIndex?: number
  selectedItem?: Item | null
  selectItem?: boolean
}

export interface UseComboboxStateChange<Item>
  extends Partial<UseComboboxState<Item>> {
  type: UseComboboxStateChangeTypes
}

export interface UseComboboxStateChangeOptions<Item>
  extends UseComboboxDispatchAction<Item> {
  changes: Partial<UseComboboxState<Item>>
}

export interface UseComboboxProps<Item> {
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
