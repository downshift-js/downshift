/// <reference types="react" />

type Callback = () => void

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

interface DownshiftState<Item> {
  highlightedIndex: number | null
  inputValue: string | null
  isOpen: boolean
  selectedItem: Item | null
}

declare enum StateChangeTypes {
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

interface DownshiftProps<Item> {
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

interface Environment {
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  document: Document
  Node: typeof window.Node
}

interface A11yStatusMessageOptions<Item> {
  highlightedIndex: number | null
  inputValue: string
  isOpen: boolean
  itemToString: (item: Item | null) => string
  previousResultCount: number
  resultCount: number
  highlightedItem: Item
  selectedItem: Item | null
}

interface StateChangeOptions<Item> extends Partial<DownshiftState<Item>> {
  type: StateChangeTypes
}

type StateChangeFunction<Item> = (
  state: DownshiftState<Item>,
) => Partial<StateChangeOptions<Item>>

interface GetRootPropsOptions {
  refKey?: string
  ref?: React.RefObject<any>
}

interface GetRootPropsReturnValue {
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-labelledby': string
  'aria-owns': string | undefined
  ref?: React.RefObject<any>
  role: 'combobox'
}

interface GetInputPropsOptions extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean
}

interface GetInputPropsReturnValue {
  'aria-autocomplete': 'list'
  'aria-activedescendant': string | undefined
  'aria-controls': string | undefined
  'aria-labelledby': string | undefined
  autoComplete: 'off'
  id: string
  onChange?: React.ChangeEventHandler
  onChangeText?: React.ChangeEventHandler
  onInput?: React.FormEventHandler
  onKeyDown?: React.KeyboardEventHandler
  onBlur?: React.FocusEventHandler
  value: string
}

interface GetLabelPropsOptions extends React.HTMLProps<HTMLLabelElement> {}

interface GetLabelPropsReturnValue {
  htmlFor: string
  id: string
}

interface GetToggleButtonPropsOptions extends React.HTMLProps<HTMLButtonElement> {
  disabled?: boolean
  onPress?: (event: React.BaseSyntheticEvent) => void
}

interface GetToggleButtonPropsReturnValue {
  'aria-label': 'close menu' | 'open menu'
  'aria-haspopup': true
  'data-toggle': true
  onPress?: (event: React.BaseSyntheticEvent) => void
  onClick?: React.MouseEventHandler
  onKeyDown?: React.KeyboardEventHandler
  onKeyUp?: React.KeyboardEventHandler
  onBlur?: React.FocusEventHandler
  role: 'button'
  type: 'button'
}

interface GetMenuPropsOptions
  extends React.HTMLProps<HTMLElement>, GetPropsWithRefKey {
  ['aria-label']?: string
}

interface GetMenuPropsReturnValue {
  'aria-labelledby': string | undefined
  ref?: React.RefObject<any>
  role: 'listbox'
  id: string
}

interface GetPropsCommonOptions {
  suppressRefError?: boolean
}

interface GetPropsWithRefKey {
  refKey?: string
}

interface GetItemPropsOptions<Item> extends React.HTMLProps<HTMLElement> {
  index?: number
  item: Item
  isSelected?: boolean
  disabled?: boolean
}

interface GetItemPropsReturnValue {
  'aria-selected': boolean
  id: string
  onClick?: React.MouseEventHandler
  onMouseDown?: React.MouseEventHandler
  onMouseMove?: React.MouseEventHandler
  onPress?: React.MouseEventHandler
  role: 'option'
}

interface PropGetters<Item> {
  getRootProps: <Options>(
    options?: GetRootPropsOptions & Options,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<GetRootPropsReturnValue, Options>
  getToggleButtonProps: <Options>(
    options?: GetToggleButtonPropsOptions & Options,
  ) => Overwrite<GetToggleButtonPropsReturnValue, Options>
  getLabelProps: <Options>(
    options?: GetLabelPropsOptions & Options,
  ) => Overwrite<GetLabelPropsReturnValue, Options>
  getMenuProps: <Options>(
    options?: GetMenuPropsOptions & Options,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<GetMenuPropsReturnValue, Options>
  getInputProps: <Options>(
    options?: GetInputPropsOptions & Options,
  ) => Overwrite<GetInputPropsReturnValue, Options>
  getItemProps: <Options>(
    options: GetItemPropsOptions<Item> & Options,
  ) => Omit<Overwrite<GetItemPropsReturnValue, Options>, 'index' | 'item'>
}

interface Actions<Item> {
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

type ControllerStateAndHelpers<Item> = DownshiftState<Item> &
  PropGetters<Item> &
  Actions<Item>

type ChildrenFunction<Item> = (
  options: ControllerStateAndHelpers<Item>,
) => React.ReactNode

declare class Downshift<Item = any> extends React.Component<
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

declare function resetIdCounter(): void

/* useSelect Types */

interface UseSelectState<Item> {
  highlightedIndex: number
  selectedItem: Item | null
  isOpen: boolean
  inputValue: string
}

declare enum UseSelectStateChangeTypes {
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

interface UseSelectProps<Item> {
  items: Item[]
  isItemDisabled?(item: Item, index: number): boolean
  itemToString?: (item: Item | null) => string
  itemToKey?: (item: Item | null) => any
  getA11yStatusMessage?: (options: UseSelectState<Item>) => string
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
  onSelectedItemChange?: (changes: UseSelectSelectedItemChange<Item>) => void
  onIsOpenChange?: (changes: UseSelectIsOpenChange<Item>) => void
  onHighlightedIndexChange?: (
    changes: UseSelectHighlightedIndexChange<Item>,
  ) => void
  onStateChange?: (changes: UseSelectStateChange<Item>) => void
  environment?: Environment
}

interface UseSelectStateChangeOptions<
  Item,
> extends UseSelectDispatchAction<Item> {
  changes: Partial<UseSelectState<Item>>
}

interface UseSelectDispatchAction<Item> {
  type: UseSelectStateChangeTypes
  altKey?: boolean
  key?: string
  index?: number
  highlightedIndex?: number
  selectedItem?: Item | null
  inputValue?: string
}

interface UseSelectStateChange<Item> extends Partial<UseSelectState<Item>> {
  type: UseSelectStateChangeTypes
}

interface UseSelectSelectedItemChange<Item> extends UseSelectStateChange<Item> {
  selectedItem: Item | null
}

interface UseSelectHighlightedIndexChange<
  Item,
> extends UseSelectStateChange<Item> {
  highlightedIndex: number
}

interface UseSelectIsOpenChange<Item> extends UseSelectStateChange<Item> {
  isOpen: boolean
}

interface UseSelectGetMenuPropsOptions
  extends GetPropsWithRefKey, GetMenuPropsOptions {}

interface UseSelectGetMenuReturnValue extends GetMenuPropsReturnValue {
  onMouseLeave: React.MouseEventHandler
}

interface UseSelectGetToggleButtonPropsOptions
  extends GetPropsWithRefKey, React.HTMLProps<HTMLElement> {
  onPress?: (event: React.BaseSyntheticEvent) => void
}

interface UseSelectGetToggleButtonReturnValue extends Pick<
  GetToggleButtonPropsReturnValue,
  'onBlur' | 'onClick' | 'onPress' | 'onKeyDown'
> {
  'aria-activedescendant': string
  'aria-controls': string
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-labelledby': string | undefined
  id: string
  ref?: React.RefObject<any>
  role: 'combobox'
  tabIndex: 0
}

interface UseSelectGetLabelPropsOptions extends GetLabelPropsOptions {}

interface UseSelectGetLabelPropsReturnValue extends GetLabelPropsReturnValue {
  onClick: React.MouseEventHandler
}

interface UseSelectGetItemPropsOptions<Item>
  extends Omit<GetItemPropsOptions<Item>, 'disabled'>, GetPropsWithRefKey {}

interface UseSelectGetItemPropsReturnValue extends GetItemPropsReturnValue {
  'aria-disabled': boolean
  ref?: React.RefObject<any>
}

interface UseSelectPropGetters<Item> {
  getToggleButtonProps: <Options>(
    options?: UseSelectGetToggleButtonPropsOptions & Options,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<UseSelectGetToggleButtonReturnValue, Options>
  getLabelProps: <Options>(
    options?: UseSelectGetLabelPropsOptions & Options,
  ) => Overwrite<UseSelectGetLabelPropsReturnValue, Options>
  getMenuProps: <Options>(
    options?: UseSelectGetMenuPropsOptions & Options,
    otherOptions?: GetPropsCommonOptions,
  ) => Overwrite<UseSelectGetMenuReturnValue, Options>
  getItemProps: <Options>(
    options: UseSelectGetItemPropsOptions<Item> & Options,
  ) => Omit<
    Overwrite<UseSelectGetItemPropsReturnValue, Options>,
    'index' | 'item'
  >
}

interface UseSelectActions<Item> {
  reset: () => void
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  selectItem: (item: Item | null) => void
  setHighlightedIndex: (index: number) => void
}

type UseSelectReturnValue<Item> = UseSelectState<Item> &
  UseSelectPropGetters<Item> &
  UseSelectActions<Item>

interface UseSelectInterface {
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

declare const useSelect: UseSelectInterface

/* useCombobox Types */

interface UseComboboxState<Item> {
  highlightedIndex: number
  selectedItem: Item | null
  isOpen: boolean
  inputValue: string
}

declare enum UseComboboxStateChangeTypes {
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

interface UseComboboxProps<Item> {
  items: Item[]
  isItemDisabled?(item: Item, index: number): boolean
  itemToString?: (item: Item | null) => string
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

interface UseComboboxStateChangeOptions<
  Item,
> extends UseComboboxDispatchAction<Item> {
  changes: Partial<UseComboboxState<Item>>
}

interface UseComboboxDispatchAction<Item> {
  type: UseComboboxStateChangeTypes
  altKey?: boolean
  inputValue?: string
  index?: number
  highlightedIndex?: number
  selectedItem?: Item | null
  selectItem?: boolean
}

interface UseComboboxStateChange<Item> extends Partial<UseComboboxState<Item>> {
  type: UseComboboxStateChangeTypes
}

interface UseComboboxSelectedItemChange<
  Item,
> extends UseComboboxStateChange<Item> {
  selectedItem: Item | null
}

interface UseComboboxHighlightedIndexChange<
  Item,
> extends UseComboboxStateChange<Item> {
  highlightedIndex: number
}

interface UseComboboxIsOpenChange<Item> extends UseComboboxStateChange<Item> {
  isOpen: boolean
}

interface UseComboboxInputValueChange<
  Item,
> extends UseComboboxStateChange<Item> {
  inputValue: string
}

interface UseComboboxGetMenuPropsOptions
  extends GetPropsWithRefKey, GetMenuPropsOptions {}

interface UseComboboxGetMenuPropsReturnValue extends UseSelectGetMenuReturnValue {}

interface UseComboboxGetToggleButtonPropsOptions
  extends GetPropsWithRefKey, GetToggleButtonPropsOptions {}

interface UseComboboxGetToggleButtonPropsReturnValue {
  'aria-controls': string
  'aria-expanded': boolean
  id: string
  onPress?: (event: React.BaseSyntheticEvent) => void
  onClick?: React.MouseEventHandler
  ref?: React.RefObject<any>
  tabIndex: -1
}

interface UseComboboxGetLabelPropsOptions extends GetLabelPropsOptions {}

interface UseComboboxGetLabelPropsReturnValue extends GetLabelPropsReturnValue {}

interface UseComboboxGetItemPropsOptions<Item>
  extends Omit<GetItemPropsOptions<Item>, 'disabled'>, GetPropsWithRefKey {}

interface UseComboboxGetItemPropsReturnValue extends GetItemPropsReturnValue {
  'aria-disabled': boolean
  ref?: React.RefObject<any>
}

interface UseComboboxGetInputPropsOptions
  extends GetInputPropsOptions, GetPropsWithRefKey {}

interface UseComboboxGetInputPropsReturnValue extends GetInputPropsReturnValue {
  'aria-activedescendant': string
  'aria-controls': string
  'aria-expanded': boolean
  role: 'combobox'
  onClick: React.MouseEventHandler
}

interface UseComboboxPropGetters<Item> {
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

interface UseComboboxActions<Item> {
  reset: () => void
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  selectItem: (item: Item | null) => void
  setHighlightedIndex: (index: number) => void
  setInputValue: (inputValue: string) => void
}

type UseComboboxReturnValue<Item> = UseComboboxState<Item> &
  UseComboboxPropGetters<Item> &
  UseComboboxActions<Item>

interface UseComboboxInterface {
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

declare const useCombobox: UseComboboxInterface

// useMultipleSelection types.

interface UseMultipleSelectionState<Item> {
  selectedItems: Item[]
  activeIndex: number
}

declare enum UseMultipleSelectionStateChangeTypes {
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

interface UseMultipleSelectionProps<Item> {
  selectedItems?: Item[]
  initialSelectedItems?: Item[]
  defaultSelectedItems?: Item[]
  itemToKey?: (item: Item | null) => any
  getA11yStatusMessage?: (options: UseMultipleSelectionState<Item>) => string
  stateReducer?: (
    state: UseMultipleSelectionState<Item>,
    actionAndChanges: UseMultipleSelectionStateChangeOptions<Item>,
  ) => Partial<UseMultipleSelectionState<Item>>
  activeIndex?: number
  initialActiveIndex?: number
  defaultActiveIndex?: number
  onActiveIndexChange?: (
    changes: UseMultipleSelectionActiveIndexChange<Item>,
  ) => void
  onSelectedItemsChange?: (
    changes: UseMultipleSelectionSelectedItemsChange<Item>,
  ) => void
  onStateChange?: (changes: UseMultipleSelectionStateChange<Item>) => void
  keyNavigationNext?: string
  keyNavigationPrevious?: string
  environment?: Environment
}

interface UseMultipleSelectionStateChangeOptions<
  Item,
> extends UseMultipleSelectionDispatchAction<Item> {
  changes: Partial<UseMultipleSelectionState<Item>>
}

interface UseMultipleSelectionDispatchAction<Item> {
  type: UseMultipleSelectionStateChangeTypes
  index?: number
  selectedItem?: Item | null
  selectedItems?: Item[]
  activeIndex?: number
}

interface UseMultipleSelectionStateChange<Item> extends Partial<
  UseMultipleSelectionState<Item>
> {
  type: UseMultipleSelectionStateChangeTypes
}

interface UseMultipleSelectionActiveIndexChange<
  Item,
> extends UseMultipleSelectionStateChange<Item> {
  activeIndex: number
}

interface UseMultipleSelectionSelectedItemsChange<
  Item,
> extends UseMultipleSelectionStateChange<Item> {
  selectedItems: Item[]
}

interface A11yRemovalMessage<Item> {
  itemToString: (item: Item) => string
  resultCount: number
  activeSelectedItem: Item
  removedSelectedItem: Item
  activeIndex: number
}

interface UseMultipleSelectionGetSelectedItemPropsOptions<Item>
  extends React.HTMLProps<HTMLElement>, GetPropsWithRefKey {
  index?: number
  selectedItem: Item
}

interface UseMultipleSelectionGetSelectedItemReturnValue {
  ref?: React.RefObject<any>
  tabIndex: 0 | -1
  onClick: React.MouseEventHandler
  onKeyDown: React.KeyboardEventHandler
}

interface UseMultipleSelectionGetDropdownPropsOptions extends React.HTMLProps<HTMLElement> {
  preventKeyAction?: boolean
}

interface UseMultipleSelectionGetDropdownReturnValue {
  ref?: React.RefObject<any>
  onClick?: React.MouseEventHandler
  onKeyDown?: React.KeyboardEventHandler
}

interface UseMultipleSelectionPropGetters<Item> {
  getDropdownProps: <Options>(
    options?: UseMultipleSelectionGetDropdownPropsOptions & Options,
    extraOptions?: GetPropsCommonOptions,
  ) => Omit<
    Overwrite<UseMultipleSelectionGetDropdownReturnValue, Options>,
    'preventKeyAction'
  >
  getSelectedItemProps: <Options>(
    options: UseMultipleSelectionGetSelectedItemPropsOptions<Item> & Options,
  ) => Omit<
    Overwrite<UseMultipleSelectionGetSelectedItemReturnValue, Options>,
    'index' | 'selectedItem'
  >
}

interface UseMultipleSelectionActions<Item> {
  reset: () => void
  addSelectedItem: (item: Item) => void
  removeSelectedItem: (item: Item) => void
  setSelectedItems: (items: Item[]) => void
  setActiveIndex: (index: number) => void
}

type UseMultipleSelectionReturnValue<Item> = UseMultipleSelectionState<Item> &
  UseMultipleSelectionPropGetters<Item> &
  UseMultipleSelectionActions<Item>

interface UseMultipleSelectionInterface {
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

declare const useMultipleSelection: UseMultipleSelectionInterface
