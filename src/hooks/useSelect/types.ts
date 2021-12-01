/* Internal Types */

import {A11yStatusMessageOptions, DropdownState, Environment} from '../../types'

export interface GetItemIndexByCharacterKeyOptions<Item> {
  keysSoFar: string
  highlightedIndex: number
  items: Item[]
  itemToString(item: Item | null): string
  getItemNodeFromIndex(index: number): HTMLElement | undefined
}

/* External Types */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseSelectState<Item> extends DropdownState<Item> {}

export interface UseSelectProps<Item> {
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

export interface UseSelectStateChangeOptions<Item>
  extends UseSelectDispatchAction<Item> {
  changes: Partial<UseSelectState<Item>>
}

export interface UseSelectDispatchAction<Item> {
  type: UseSelectStateChangeTypes
  getItemNodeFromIndex?: (index: number) => HTMLElement
  shiftKey?: boolean
  key?: string
  index?: number
  highlightedIndex?: number
  selectedItem?: Item | null
  inputValue?: string
  props: UseSelectProps<Item>
}

export interface UseSelectStateChange<Item>
  extends Partial<UseSelectState<Item>> {
  type: UseSelectStateChangeTypes
}

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
