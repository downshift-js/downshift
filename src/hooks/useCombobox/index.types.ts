import {
  GetMenuPropsReturnValue,
  Environment,
  GetInputPropsOptions,
  GetInputPropsReturnValue,
  GetItemPropsOptions,
  GetItemPropsReturnValue,
  GetLabelPropsOptions,
  GetLabelPropsReturnValue,
  GetMenuPropsOptions,
  GetPropsCommonOptions,
  GetPropsWithRefKey,
  GetToggleButtonPropsOptions,
  Overwrite,
} from '../../index.types'
import {DropdownState} from '../utils.dropdown/index.types'

/**
 * State for useCombobox hook.
 * Kept as a separate interface for backwards compatibility.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseComboboxState<Item> extends DropdownState<Item> {}

export enum UseComboboxStateChangeTypes {
  InputKeyDownArrowDown = '__input_keydown_arrow_down__',
  InputKeyDownArrowUp = '__input_keydown_arrow_up__',
  InputKeyDownEscape = '__input_keydown_escape__',
  InputKeyDownHome = '__input_keydown_home__',
  InputKeyDownEnd = '__input_keydown_end__',
  InputKeyDownPageUp = '__input_keydown_page_up__',
  InputKeyDownPageDown = '__input_keydown_page_down__',
  InputKeyDownEnter = '__input_keydown_enter__',
  InputChange = '__input_change__',
  InputBlur = '__input_blur__',
  InputClick = '__input_click__',
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

export interface UseComboboxProps<Item> extends Record<string, unknown> {
  items: Item[]
  isItemDisabled?(item: Item, index: number): boolean
  itemToString?: (item: Item | null) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any --- Backwards compatibility, make it unknown in the future.
  itemToKey?: (item: Item | null) => any
  getA11yStatusMessage?: (options: UseComboboxState<Item>) => string
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
  onSelectedItemChange?: (changes: UseComboboxSelectedItemChange<Item>) => void
  onIsOpenChange?: (changes: UseComboboxIsOpenChange<Item>) => void
  onHighlightedIndexChange?: (
    changes: UseComboboxHighlightedIndexChange<Item>,
  ) => void
  onStateChange?: (changes: UseComboboxStateChange<Item>) => void
  onInputValueChange?: (changes: UseComboboxInputValueChange<Item>) => void
  environment?: Environment
}

export interface UseComboboxMergedProps<Item> extends UseComboboxProps<Item> {
  stateReducer: NonNullable<UseComboboxProps<Item>['stateReducer']>
  isItemDisabled: NonNullable<UseComboboxProps<Item>['isItemDisabled']>
  // TODO: BREAKING CHANGE -> Change the one in UseComboboxProps to also accept undefined for item.
  itemToString: NonNullable<UseComboboxProps<Item>['itemToString']>
  // TODO: BREAKING CHANGE -> Change the one in UseComboboxProps to also accept undefined for item and return unknown.
  itemToKey: NonNullable<UseComboboxProps<Item>['itemToKey']>
  scrollIntoView: NonNullable<UseComboboxProps<Item>['scrollIntoView']>
  environment: NonNullable<UseComboboxProps<Item>['environment']>
}

export interface UseComboboxStateChangeOptions<
  Item,
> extends UseComboboxDispatchAction<Item> {
  changes: Partial<UseComboboxState<Item>>
}

export interface UseComboboxDispatchAction<Item> {
  type: UseComboboxStateChangeTypes
  altKey?: boolean
  inputValue?: string
  index?: number
  highlightedIndex?: number
  selectedItem?: Item | null
  selectItem?: boolean
}

export interface UseComboboxStateChange<Item> extends Partial<
  UseComboboxState<Item>
> {
  type: UseComboboxStateChangeTypes
}

export interface UseComboboxSelectedItemChange<
  Item,
> extends UseComboboxStateChange<Item> {
  selectedItem: Item | null
}

export interface UseComboboxHighlightedIndexChange<
  Item,
> extends UseComboboxStateChange<Item> {
  highlightedIndex: number
}

export interface UseComboboxIsOpenChange<
  Item,
> extends UseComboboxStateChange<Item> {
  isOpen: boolean
}

export interface UseComboboxInputValueChange<
  Item,
> extends UseComboboxStateChange<Item> {
  inputValue: string
}

export interface UseComboboxGetMenuPropsOptions
  extends GetPropsWithRefKey, GetMenuPropsOptions {}

export interface UseComboboxGetMenuPropsReturnValue extends GetMenuPropsReturnValue {
  onMouseLeave: React.MouseEventHandler
}
export interface UseComboboxGetToggleButtonPropsOptions
  extends GetPropsWithRefKey, GetToggleButtonPropsOptions {}

export interface UseComboboxGetToggleButtonPropsReturnValue {
  'aria-controls': string
  'aria-expanded': boolean
  id: string
  onPress?: (event: React.BaseSyntheticEvent) => void
  onClick?: React.MouseEventHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any --- Backwards compatibility, make it unknown in the future.
  ref?: React.RefObject<any>
  tabIndex: -1
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseComboboxGetLabelPropsOptions extends GetLabelPropsOptions {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseComboboxGetLabelPropsReturnValue extends GetLabelPropsReturnValue {}

export interface UseComboboxGetItemPropsOptions<Item>
  extends Omit<GetItemPropsOptions<Item>, 'disabled'>, GetPropsWithRefKey {}

export interface UseComboboxGetItemPropsReturnValue extends GetItemPropsReturnValue {
  'aria-disabled': boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any --- Backwards compatibility, make it unknown in the future.
  ref?: React.RefObject<any>
}

export interface UseComboboxGetInputPropsOptions
  extends GetInputPropsOptions, GetPropsWithRefKey {}

export interface UseComboboxGetInputPropsReturnValue extends GetInputPropsReturnValue {
  'aria-activedescendant': string
  'aria-controls': string
  'aria-expanded': boolean
  role: 'combobox'
  onClick: React.MouseEventHandler
}

export interface UseComboboxPropGetters<Item> {
  getToggleButtonProps: <Options>(
    options?: UseComboboxGetToggleButtonPropsOptions & Options,
  ) => Overwrite<UseComboboxGetToggleButtonPropsReturnValue, Options>
  getLabelProps: <Options>(
    options?: UseComboboxGetLabelPropsOptions & Options,
  ) => Overwrite<UseComboboxGetLabelPropsReturnValue, Options>
  getMenuProps: <Options>(
    options?: UseComboboxGetMenuPropsOptions & Options,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<UseComboboxGetMenuPropsReturnValue, Options>
  getItemProps: <Options>(
    options: UseComboboxGetItemPropsOptions<Item> & Options,
  ) => Omit<
    Overwrite<UseComboboxGetItemPropsReturnValue, Options>,
    'index' | 'item'
  >
  getInputProps: <Options>(
    options?: UseComboboxGetInputPropsOptions & Options,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<UseComboboxGetInputPropsReturnValue, Options>
}

export interface UseComboboxActions<Item> {
  reset: () => void
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  selectItem: (item: Item | null) => void
  setHighlightedIndex: (index: number) => void
  setInputValue: (inputValue: string) => void
}

export type UseComboboxReturnValue<Item> = UseComboboxState<Item> &
  UseComboboxPropGetters<Item> &
  UseComboboxActions<Item>

export interface UseComboboxInterface {
  <Item>(props: UseComboboxProps<Item>): UseComboboxReturnValue<Item>
  stateChangeTypes: {
    InputKeyDownArrowDown: UseComboboxStateChangeTypes.InputKeyDownArrowDown
    InputKeyDownArrowUp: UseComboboxStateChangeTypes.InputKeyDownArrowUp
    InputKeyDownEscape: UseComboboxStateChangeTypes.InputKeyDownEscape
    InputKeyDownHome: UseComboboxStateChangeTypes.InputKeyDownHome
    InputKeyDownEnd: UseComboboxStateChangeTypes.InputKeyDownEnd
    InputKeyDownPageDown: UseComboboxStateChangeTypes.InputKeyDownPageDown
    InputKeyDownPageUp: UseComboboxStateChangeTypes.InputKeyDownPageUp
    InputKeyDownEnter: UseComboboxStateChangeTypes.InputKeyDownEnter
    InputChange: UseComboboxStateChangeTypes.InputChange
    InputBlur: UseComboboxStateChangeTypes.InputBlur
    InputClick: UseComboboxStateChangeTypes.InputClick
    MenuMouseLeave: UseComboboxStateChangeTypes.MenuMouseLeave
    ItemMouseMove: UseComboboxStateChangeTypes.ItemMouseMove
    ItemClick: UseComboboxStateChangeTypes.ItemClick
    ToggleButtonClick: UseComboboxStateChangeTypes.ToggleButtonClick
    FunctionToggleMenu: UseComboboxStateChangeTypes.FunctionToggleMenu
    FunctionOpenMenu: UseComboboxStateChangeTypes.FunctionOpenMenu
    FunctionCloseMenu: UseComboboxStateChangeTypes.FunctionCloseMenu
    FunctionSetHighlightedIndex: UseComboboxStateChangeTypes.FunctionSetHighlightedIndex
    FunctionSelectItem: UseComboboxStateChangeTypes.FunctionSelectItem
    FunctionSetInputValue: UseComboboxStateChangeTypes.FunctionSetInputValue
    FunctionReset: UseComboboxStateChangeTypes.FunctionReset
    ControlledPropUpdatedSelectedItem: UseComboboxStateChangeTypes.ControlledPropUpdatedSelectedItem
  }
}
