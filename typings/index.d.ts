import * as React from 'react'
import * as ReactNative from 'react-native'

type Callback = () => void

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

export interface DownshiftState<Item> {
  highlightedIndex: number | null
  inputValue: string | null
  isOpen: boolean
  selectedItem: Item | null
}

export enum StateChangeTypes {
  unknown = '__autocomplete_unknown__',
  mouseUp = '__autocomplete_mouseup__',
  itemMouseEnter = '__autocomplete_item_mouseenter__',
  keyDownArrowUp = '__autocomplete_keydown_arrow_up__',
  keyDownArrowDown = '__autocomplete_keydown_arrow_down__',
  keyDownEscape = '__autocomplete_keydown_escape__',
  keyDownEnter = '__autocomplete_keydown_enter__',
  clickItem = '__autocomplete_click_item__',
  blurInput = '__autocomplete_blur_input__',
  changeInput = '__autocomplete_change_input__',
  keyDownSpaceButton = '__autocomplete_keydown_space_button__',
  clickButton = '__autocomplete_click_button__',
  blurButton = '__autocomplete_blur_button__',
  controlledPropUpdatedSelectedItem = '__autocomplete_controlled_prop_updated_selected_item__',
  touchEnd = '__autocomplete_touchend__',
}

export interface DownshiftProps<Item> {
  initialSelectedItem?: Item
  initialInputValue?: string
  initialHighlightedIndex?: number | null
  initialIsOpen?: boolean
  defaultHighlightedIndex?: number | null
  defaultIsOpen?: boolean
  itemToString?: (item: Item | null) => string
  selectedItemChanged?: (prevItem: Item, item: Item) => boolean
  getA11yStatusMessage?: (options: A11yStatusMessageOptions<Item>) => string
  onChange?: (
    selectedItem: Item | null,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
  onSelect?: (
    selectedItem: Item | null,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
  onStateChange?: (
    options: StateChangeOptions<Item>,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
  onInputValueChange?: (
    inputValue: string,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
  stateReducer?: (
    state: DownshiftState<Item>,
    changes: StateChangeOptions<Item>,
  ) => Partial<StateChangeOptions<Item>>
  itemCount?: number
  highlightedIndex?: number | null
  inputValue?: string | null
  isOpen?: boolean
  selectedItem?: Item | null
  children?: ChildrenFunction<Item>
  id?: string
  inputId?: string
  labelId?: string
  menuId?: string
  getItemId?: (index?: number) => string
  environment?: Environment
  onOuterClick?: (stateAndHelpers: ControllerStateAndHelpers<Item>) => void
  scrollIntoView?: (node: HTMLElement, menuNode: HTMLElement) => void
  onUserAction?: (
    options: StateChangeOptions<Item>,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
  suppressRefError?: boolean
}

export interface Environment {
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  document: Document
  Node: typeof window.Node
}

export interface A11yStatusMessageOptions<Item> {
  highlightedIndex: number | null
  inputValue: string
  isOpen: boolean
  itemToString: (item: Item | null) => string
  previousResultCount: number
  resultCount: number
  highlightedItem: Item
  selectedItem: Item | null
}

export interface StateChangeOptions<Item>
  extends Partial<DownshiftState<Item>> {
  type: StateChangeTypes
}

type StateChangeFunction<Item> = (
  state: DownshiftState<Item>,
) => Partial<StateChangeOptions<Item>>

export interface GetRootPropsOptions {
  refKey?: string
  ref?: React.RefObject
}

export interface GetRootPropsReturnValue {
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-labelledby': string
  'aria-owns': string | undefined
  ref?: React.RefObject
  role: 'combobox'
}

export interface GetInputPropsOptions
  extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean
}

export interface GetInputPropsReturnValue {
  'aria-autocomplete': 'list'
  'aria-activedescendant': string | undefined
  'aria-controls': string | undefined
  'aria-labelledby': string | undefined
  autoComplete: 'off'
  value: string
  id: string
  onChange?: React.ChangeEventHandler
  onChangeText?: React.ChangeEventHandler
  onInput?: React.FormEventHandler
  onKeyDown?: React.KeyboardEventHandler
  onBlur?: React.FocusEventHandler
}

export interface GetLabelPropsOptions
  extends React.HTMLProps<HTMLLabelElement> {}

export interface GetLabelPropsReturnValue {
  htmlFor: string
  id: string
}

export interface GetToggleButtonPropsOptions
  extends React.HTMLProps<HTMLButtonElement> {
  disabled?: boolean
}

interface GetToggleButtonPropsReturnValue {
  type: 'button'
  role: 'button'
  'aria-label': 'close menu' | 'open menu'
  'aria-haspopup': true
  'data-toggle': true
  onPress?: (event: ReactNative.GestureResponderEvent) => void
  onClick?: React.MouseEventHandler
  onKeyDown?: React.KeyboardEventHandler
  onKeyUp?: React.KeyboardEventHandler
  onBlur?: React.FocusEventHandler
}
export interface GetMenuPropsOptions
  extends React.HTMLProps<HTMLElement>,
    GetPropsWithRefKey {
  ['aria-label']?: string
}

export interface GetMenuPropsReturnValue {
  ref?: React.RefObject
  role: 'listbox'
  'aria-labelledby': string | undefined
  id: string
}

export interface GetPropsCommonOptions {
  suppressRefError?: boolean
}

export interface GetPropsWithRefKey {
  refKey?: string
}

export interface GetItemPropsOptions<Item>
  extends React.HTMLProps<HTMLElement> {
  index?: number
  item: Item
  isSelected?: boolean
  disabled?: boolean
}

export interface GetItemPropsReturnValue {
  'aria-selected': boolean
  id: string
  role: 'option'
  onClick?: React.MouseEventHandler
  onMouseDown?: React.MouseEventHandler
  onMouseMove?: React.MouseEventHandler
  onPress?: React.MouseEventHandler
}

export interface PropGetters<Item> {
  getRootProps: <Options>(
    options?: Overwrite<GetRootPropsOptions, Options>,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<GetRootPropsReturnValue, Options>
  getToggleButtonProps: <Options>(
    options?: Overwrite<GetToggleButtonPropsOptions, Options>,
  ) => Overwrite<GetToggleButtonPropsReturnValue, Options>
  getLabelProps: <Options>(
    options?: Overwrite<GetLabelPropsOptions, Options>,
  ) => Overwrite<GetLabelPropsReturnValue, Options>
  getMenuProps: <Options>(
    options?: Overwrite<GetMenuPropsOptions, Options>,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<GetMenuPropsReturnValue, Options>
  getInputProps: <Options>(
    options?: Overwrite<GetInputPropsOptions, Options>,
  ) => Overwrite<GetInputPropsReturnValue, Options>
  getItemProps: <Options>(
    options: Overwrite<GetItemPropsOptions<Item>, Options>,
  ) => Overwrite<GetItemPropsReturnValue<Item>, Options>
}

export interface Actions<Item> {
  reset: (
    otherStateToSet?: Partial<StateChangeOptions<Item>>,
    cb?: Callback,
  ) => void
  openMenu: (cb?: Callback) => void
  closeMenu: (cb?: Callback) => void
  toggleMenu: (
    otherStateToSet?: Partial<StateChangeOptions<Item>>,
    cb?: Callback,
  ) => void
  selectItem: (
    item: Item | null,
    otherStateToSet?: Partial<StateChangeOptions<Item>>,
    cb?: Callback,
  ) => void
  selectItemAtIndex: (
    index: number,
    otherStateToSet?: Partial<StateChangeOptions<Item>>,
    cb?: Callback,
  ) => void
  selectHighlightedItem: (
    otherStateToSet?: Partial<StateChangeOptions<Item>>,
    cb?: Callback,
  ) => void
  setHighlightedIndex: (
    index: number,
    otherStateToSet?: Partial<StateChangeOptions<Item>>,
    cb?: Callback,
  ) => void
  clearSelection: (cb?: Callback) => void
  clearItems: () => void
  setItemCount: (count: number) => void
  unsetItemCount: () => void
  setState: (
    stateToSet: Partial<StateChangeOptions<Item>> | StateChangeFunction<Item>,
    cb?: Callback,
  ) => void
  // props
  itemToString: (item: Item | null) => string
}

export type ControllerStateAndHelpers<Item> = DownshiftState<Item> &
  PropGetters<Item> &
  Actions<Item>

export type ChildrenFunction<Item> = (
  options: ControllerStateAndHelpers<Item>,
) => React.ReactNode

export default class Downshift<Item = any> extends React.Component<
  DownshiftProps<Item>
> {
  static stateChangeTypes: {
    unknown: StateChangeTypes.unknown
    mouseUp: StateChangeTypes.mouseUp
    itemMouseEnter: StateChangeTypes.itemMouseEnter
    keyDownArrowUp: StateChangeTypes.keyDownArrowUp
    keyDownArrowDown: StateChangeTypes.keyDownArrowDown
    keyDownEscape: StateChangeTypes.keyDownEscape
    keyDownEnter: StateChangeTypes.keyDownEnter
    clickItem: StateChangeTypes.clickItem
    blurInput: StateChangeTypes.blurInput
    changeInput: StateChangeTypes.changeInput
    keyDownSpaceButton: StateChangeTypes.keyDownSpaceButton
    clickButton: StateChangeTypes.clickButton
    blurButton: StateChangeTypes.blurButton
    controlledPropUpdatedSelectedItem: StateChangeTypes.controlledPropUpdatedSelectedItem
    touchEnd: StateChangeTypes.touchEnd
  }
}

export function resetIdCounter(): void

/* useSelect Types */

export interface UseSelectState<Item> {
  highlightedIndex: number
  selectedItem: Item | null
  isOpen: boolean
  inputValue: string
}

export enum UseSelectStateChangeTypes {
  ToggleButtonClick = '__togglebutton_click__',
  ToggleButtonKeyDownArrowDown = '__togglebutton_keydown_arrow_down__',
  ToggleButtonKeyDownArrowUp = '__togglebutton_keydown_arrow_up__',
  ToggleButtonKeyDownCharacter = '__togglebutton_keydown_character__',
  ToggleButtonKeyDownEscape = '__togglebutton_keydown_escape__',
  ToggleButtonKeyDownHome = '__togglebutton_keydown_home__',
  ToggleButtonKeyDownEnd = '__togglebutton_keydown_end__',
  ToggleButtonKeyDownEnter = '__togglebutton_keydown_enter__',
  ToggleButtonKeyDownSpaceButton = '__togglebutton_keydown_space_button__',
  ToggleButtonKeyDownPageUp = '__togglebutton_keydown_page_up__',
  ToggleButtonKeyDownPageDown = '__togglebutton_keydown_page_down__',
  ToggleButtonBlur = '__togglebutton_blur__',
  MenuMouseLeave = '__menu_mouse_leave__',
  ItemMouseMove = '__item_mouse_move__',
  ItemClick = '__item_click__',
  FunctionToggleMenu = '__function_toggle_menu__',
  FunctionOpenMenu = '__function_open_menu__',
  FunctionCloseMenu = '__function_close_menu__',
  FunctionSetHighlightedIndex = '__function_set_highlighted_index__',
  FunctionSelectItem = '__function_select_item__',
  FunctionSetInputValue = '__function_set_input_value__',
  FunctionReset = '__function_reset__',
}

export interface UseSelectProps<Item> {
  items: Item[]
  isItemDisabled?(item: Item, index: number): boolean
  itemToString?: (item: Item | null) => string
  getA11yStatusMessage?: (options: A11yStatusMessageOptions<Item>) => string
  getA11ySelectionMessage?: (options: A11yStatusMessageOptions<Item>) => string
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
  altKey?: boolean
  key?: string
  index?: number
  highlightedIndex?: number
  selectedItem?: Item | null
  inputValue?: string
}

export interface UseSelectStateChange<Item>
  extends Partial<UseSelectState<Item>> {
  type: UseSelectStateChangeTypes
}

export interface UseSelectGetMenuPropsOptions
  extends GetPropsWithRefKey,
    GetMenuPropsOptions {}

export interface UseSelectGetMenuReturnValue extends GetMenuPropsReturnValue {
  onMouseLeave: React.MouseEventHandler
}

export interface UseSelectGetToggleButtonPropsOptions
  extends GetPropsWithRefKey,
    React.HTMLProps<HTMLElement> {}

export interface UseSelectGetToggleButtonReturnValue
  extends Pick<
    GetToggleButtonPropsReturnValue,
    'onBlur' | 'onClick' | 'onPress' | 'onKeyDown'
  > {
  ref?: React.RefObject
  'aria-activedescendant': string
  'aria-controls': string
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-labelledby': string | undefined
  id: string
  role: 'combobox'
  tabIndex: 0
}

export interface UseSelectGetLabelPropsOptions extends GetLabelPropsOptions {}
export interface UseSelectGetLabelPropsReturnValue
  extends GetLabelPropsReturnValue {}

export interface UseSelectGetItemPropsOptions<Item>
  extends Omit<GetItemPropsOptions<Item>, 'disabled'>,
    GetPropsWithRefKey {}

export interface UseSelectGetItemPropsReturnValue
  extends Exclude<GetItemPropsReturnValue, 'onMouseDown'> {
  'aria-disabled': boolean
  ref?: React.RefObject
}

export interface UseSelectPropGetters<Item> {
  getToggleButtonProps: <Options>(
    options?: Overwrite<UseSelectGetToggleButtonPropsOptions, Options>,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<UseSelectGetToggleButtonReturnValue, Options>
  getLabelProps: <Options>(
    options?: Overwrite<UseSelectGetLabelPropsOptions, Options>,
  ) => Overwrite<UseSelectGetLabelPropsReturnValue, Options>
  getMenuProps: <Options>(
    options?: Overwrite<UseSelectGetMenuPropsOptions, Options>,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<UseSelectGetMenuReturnValue, Options>
  getItemProps: <Options>(
    options: Overwrite<UseSelectGetItemPropsOptions<Item>, Overwrite>,
  ) => Overwrite<UseSelectGetItemPropsReturnValue, Options>
}

export interface UseSelectActions<Item> {
  reset: () => void
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  selectItem: (item: Item | null) => void
  setHighlightedIndex: (index: number) => void
}

export type UseSelectReturnValue<Item> = UseSelectState<Item> &
  UseSelectPropGetters<Item> &
  UseSelectActions<Item>

export interface UseSelectInterface {
  <Item>(props: UseSelectProps<Item>): UseSelectReturnValue<Item>
  stateChangeTypes: {
    ToggleButtonClick: UseSelectStateChangeTypes.ToggleButtonClick
    ToggleButtonKeyDownArrowDown: UseSelectStateChangeTypes.ToggleButtonKeyDownArrowDown
    ToggleButtonKeyDownArrowUp: UseSelectStateChangeTypes.ToggleButtonKeyDownArrowUp
    ToggleButtonKeyDownCharacter: UseSelectStateChangeTypes.ToggleButtonKeyDownCharacter
    ToggleButtonKeyDownEscape: UseSelectStateChangeTypes.ToggleButtonKeyDownEscape
    ToggleButtonKeyDownHome: UseSelectStateChangeTypes.ToggleButtonKeyDownHome
    ToggleButtonKeyDownEnd: UseSelectStateChangeTypes.ToggleButtonKeyDownEnd
    ToggleButtonKeyDownEnter: UseSelectStateChangeTypes.ToggleButtonKeyDownEnter
    ToggleButtonKeyDownSpaceButton: UseSelectStateChangeTypes.ToggleButtonKeyDownSpaceButton
    ToggleButtonKeyDownPageUp: UseSelectStateChangeTypes.ToggleButtonKeyDownPageUp
    ToggleButtonKeyDownPageDown: UseSelectStateChangeTypes.ToggleButtonKeyDownPageDown
    ToggleButtonBlur: UseSelectStateChangeTypes.ToggleButtonBlur
    MenuMouseLeave: UseSelectStateChangeTypes.MenuMouseLeave
    ItemMouseMove: UseSelectStateChangeTypes.ItemMouseMove
    ItemClick: UseSelectStateChangeTypes.ItemClick
    FunctionToggleMenu: UseSelectStateChangeTypes.FunctionToggleMenu
    FunctionOpenMenu: UseSelectStateChangeTypes.FunctionOpenMenu
    FunctionCloseMenu: UseSelectStateChangeTypes.FunctionCloseMenu
    FunctionSetHighlightedIndex: UseSelectStateChangeTypes.FunctionSetHighlightedIndex
    FunctionSelectItem: UseSelectStateChangeTypes.FunctionSelectItem
    FunctionSetInputValue: UseSelectStateChangeTypes.FunctionSetInputValue
    FunctionReset: UseSelectStateChangeTypes.FunctionReset
  }
}

export const useSelect: UseSelectInterface

/* useCombobox Types */

export interface UseComboboxState<Item> {
  highlightedIndex: number
  selectedItem: Item | null
  isOpen: boolean
  inputValue: string
}

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

export interface UseComboboxProps<Item> {
  items: Item[]
  isItemDisabled?(item: Item, index: number): boolean
  itemToString?: (item: Item | null) => string
  selectedItemChanged?: (prevItem: Item, item: Item) => boolean
  getA11yStatusMessage?: (options: A11yStatusMessageOptions<Item>) => string
  getA11ySelectionMessage?: (options: A11yStatusMessageOptions<Item>) => string
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

export interface UseComboboxStateChangeOptions<Item>
  extends UseComboboxDispatchAction<Item> {
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

export interface UseComboboxStateChange<Item>
  extends Partial<UseComboboxState<Item>> {
  type: UseComboboxStateChangeTypes
}

export interface UseComboboxGetMenuPropsOptions
  extends GetPropsWithRefKey,
    GetMenuPropsOptions {}

export interface UseComboboxGetMenuPropsReturnValue
  extends UseSelectGetMenuReturnValue {}

export interface UseComboboxGetToggleButtonPropsOptions
  extends GetPropsWithRefKey,
    GetToggleButtonPropsOptions {}

export interface UseComboboxGetToggleButtonPropsReturnValue {
  ref?: React.RefObject
  'aria-controls': string
  'aria-expanded': boolean
  id: string
  tabIndex: -1
  onPress?: (event: ReactNative.GestureResponderEvent) => void
  onClick?: React.MouseEventHandler
}

export interface UseComboboxGetLabelPropsOptions extends GetLabelPropsOptions {}

export interface UseComboboxGetLabelPropsReturnValue
  extends GetLabelPropsReturnValue {}

export interface UseComboboxGetItemPropsOptions<Item>
  extends Omit<GetItemPropsOptions<Item>, 'disabled'>,
    GetPropsWithRefKey {}

export interface UseComboboxGetItemPropsReturnValue
  extends GetItemPropsReturnValue {
  'aria-disabled': boolean
  ref?: React.RefObject
}

export interface UseComboboxGetInputPropsOptions
  extends GetInputPropsOptions,
    GetPropsWithRefKey {}

export interface UseComboboxGetInputPropsReturnValue
  extends GetInputPropsReturnValue {
  'aria-activedescendant': string
  'aria-controls': string
  'aria-expanded': boolean
  role: 'combobox'
  onClick: React.MouseEventHandler
}
export interface UseComboboxPropGetters<Item> {
  getToggleButtonProps: <Options>(
    options?: Overwrite<UseComboboxGetToggleButtonPropsOptions, Options>,
  ) => Overwrite<UseComboboxGetToggleButtonPropsReturnValue, Options>
  getLabelProps: <Options>(
    options?: Overwrite<UseComboboxGetLabelPropsOptions, Options>,
  ) => Overwrite<UseComboboxGetLabelPropsReturnValue, Options>
  getMenuProps: <Options>(
    options?: Overwrite<UseComboboxGetMenuPropsOptions, Options>,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<UseComboboxGetMenuPropsReturnValue, Options>
  getItemProps: <Options>(
    options: Overwrite<UseComboboxGetItemPropsOptions<Item>, Options>,
  ) => Overwrite<UseComboboxGetItemPropsReturnValue, Options>
  getInputProps: <Options>(
    options?: Overwrite<UseComboboxGetInputPropsOptions, Options>,
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

export const useCombobox: UseComboboxInterface

// useMultipleSelection types.

export interface UseMultipleSelectionState<Item> {
  selectedItems: Item[]
  activeIndex: number
}

export enum UseMultipleSelectionStateChangeTypes {
  SelectedItemClick = '__selected_item_click__',
  SelectedItemKeyDownDelete = '__selected_item_keydown_delete__',
  SelectedItemKeyDownBackspace = '__selected_item_keydown_backspace__',
  SelectedItemKeyDownNavigationNext = '__selected_item_keydown_navigation_next__',
  SelectedItemKeyDownNavigationPrevious = '__selected_item_keydown_navigation_previous__',
  DropdownKeyDownNavigationPrevious = '__dropdown_keydown_navigation_previous__',
  DropdownKeyDownBackspace = '__dropdown_keydown_backspace__',
  DropdownClick = '__dropdown_click__',
  FunctionAddSelectedItem = '__function_add_selected_item__',
  FunctionRemoveSelectedItem = '__function_remove_selected_item__',
  FunctionSetSelectedItems = '__function_set_selected_items__',
  FunctionSetActiveIndex = '__function_set_active_index__',
  FunctionReset = '__function_reset__',
}

export interface UseMultipleSelectionProps<Item> {
  selectedItems?: Item[]
  initialSelectedItems?: Item[]
  defaultSelectedItems?: Item[]
  itemToString?: (item: Item) => string
  getA11yRemovalMessage?: (options: A11yRemovalMessage<Item>) => string
  stateReducer?: (
    state: UseMultipleSelectionState<Item>,
    actionAndChanges: UseMultipleSelectionStateChangeOptions<Item>,
  ) => Partial<UseMultipleSelectionState<Item>>
  activeIndex?: number
  initialActiveIndex?: number
  defaultActiveIndex?: number
  onActiveIndexChange?: (changes: UseMultipleSelectionStateChange<Item>) => void
  onSelectedItemsChange?: (
    changes: UseMultipleSelectionStateChange<Item>,
  ) => void
  onStateChange?: (changes: UseMultipleSelectionStateChange<Item>) => void
  keyNavigationNext?: string
  keyNavigationPrevious?: string
  environment?: Environment
}

export interface UseMultipleSelectionStateChangeOptions<Item>
  extends UseMultipleSelectionDispatchAction<Item> {
  changes: Partial<UseMultipleSelectionState<Item>>
}

export interface UseMultipleSelectionDispatchAction<Item> {
  type: UseMultipleSelectionStateChangeTypes
  index?: number
  selectedItem?: Item | null
  selectedItems?: Item[]
  activeIndex?: number
}

export interface UseMultipleSelectionStateChange<Item>
  extends Partial<UseMultipleSelectionState<Item>> {
  type: UseMultipleSelectionStateChangeTypes
}

export interface A11yRemovalMessage<Item> {
  itemToString: (item: Item) => string
  resultCount: number
  activeSelectedItem: Item
  removedSelectedItem: Item
  activeIndex: number
}

export interface UseMultipleSelectionGetSelectedItemPropsOptions<Item>
  extends React.HTMLProps<HTMLElement>,
    GetPropsWithRefKey {
  index?: number
  selectedItem: Item
}

export interface UseMultipleSelectionComboboxGetDropdownProps
  extends GetInputPropsOptions,
    GetPropsWithRefKey {
  preventKeyAction?: boolean
}

export interface UseMultipleSelectionSelectGetDropdownProps
  extends GetToggleButtonPropsOptions,
    GetPropsWithRefKey {
  preventKeyAction?: boolean
}

export type UseMultipleSelectionGetDropdownProps =
  | UseMultipleSelectionSelectGetDropdownProps
  | UseMultipleSelectionComboboxGetDropdownProps

export interface UseMultipleSelectionPropGetters<Item> {
  getDropdownProps: (
    options?: UseMultipleSelectionGetDropdownProps,
    extraOptions?: GetPropsCommonOptions,
  ) => any
  getSelectedItemProps: (
    options: UseMultipleSelectionGetSelectedItemPropsOptions<Item>,
  ) => any
}

export interface UseMultipleSelectionActions<Item> {
  reset: () => void
  addSelectedItem: (item: Item) => void
  removeSelectedItem: (item: Item) => void
  setSelectedItems: (items: Item[]) => void
  setActiveIndex: (index: number) => void
}

export type UseMultipleSelectionReturnValue<Item> =
  UseMultipleSelectionState<Item> &
    UseMultipleSelectionPropGetters<Item> &
    UseMultipleSelectionActions<Item>

export interface UseMultipleSelectionInterface {
  <Item>(
    props?: UseMultipleSelectionProps<Item>,
  ): UseMultipleSelectionReturnValue<Item>
  stateChangeTypes: {
    SelectedItemClick: UseMultipleSelectionStateChangeTypes.SelectedItemClick
    SelectedItemKeyDownDelete: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownDelete
    SelectedItemKeyDownBackspace: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownBackspace
    SelectedItemKeyDownNavigationNext: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownNavigationNext
    SelectedItemKeyDownNavigationPrevious: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownNavigationPrevious
    DropdownKeyDownNavigationPrevious: UseMultipleSelectionStateChangeTypes.DropdownKeyDownNavigationPrevious
    DropdownKeyDownBackspace: UseMultipleSelectionStateChangeTypes.DropdownKeyDownBackspace
    DropdownClick: UseMultipleSelectionStateChangeTypes.DropdownClick
    FunctionAddSelectedItem: UseMultipleSelectionStateChangeTypes.FunctionAddSelectedItem
    FunctionRemoveSelectedItem: UseMultipleSelectionStateChangeTypes.FunctionRemoveSelectedItem
    FunctionSetSelectedItems: UseMultipleSelectionStateChangeTypes.FunctionSetSelectedItems
    FunctionSetActiveIndex: UseMultipleSelectionStateChangeTypes.FunctionSetActiveIndex
    FunctionReset: UseMultipleSelectionStateChangeTypes.FunctionReset
  }
}

export const useMultipleSelection: UseMultipleSelectionInterface
