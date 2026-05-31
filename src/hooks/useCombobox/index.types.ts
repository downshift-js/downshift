import {
  AnyRef,
  Environment,
  GetPropsCommonOptions,
  Overwrite,
} from '../../downshift.types'

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

export type UseComboboxInputKeyDownArrowDownAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownArrowDown
  altKey: boolean
}
export type UseComboboxInputKeyDownArrowUpAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownArrowUp
  altKey: boolean
}
export type UseComboboxInputKeyDownHomeAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownHome
}
export type UseComboboxInputKeyDownEndAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownEnd
}
export type UseComboboxInputKeyDownEscapeAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownEscape
}
export type UseComboboxInputKeyDownEnterAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownEnter
}
export type UseComboboxInputKeyDownPageUpAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownPageUp
}
export type UseComboboxInputKeyDownPageDownAction = {
  type: UseComboboxStateChangeTypes.InputKeyDownPageDown
}
export type UseComboboxInputChangeAction = {
  type: UseComboboxStateChangeTypes.InputChange
  inputValue: string
}
export type UseComboboxInputBlurAction = {
  type: UseComboboxStateChangeTypes.InputBlur
  selectItem?: boolean
}
export type UseComboboxInputClickAction = {
  type: UseComboboxStateChangeTypes.InputClick
}
export type UseComboboxMenuMouseLeaveAction = {
  type: UseComboboxStateChangeTypes.MenuMouseLeave
}
export type UseComboboxItemMouseMoveAction = {
  type: UseComboboxStateChangeTypes.ItemMouseMove
  index: number
  disabled: boolean
}
export type UseComboboxItemClickAction = {
  type: UseComboboxStateChangeTypes.ItemClick
  index: number
}
export type UseComboboxToggleButtonClickAction = {
  type: UseComboboxStateChangeTypes.ToggleButtonClick
}
export type UseComboboxFunctionToggleMenuAction = {
  type: UseComboboxStateChangeTypes.FunctionToggleMenu
}
export type UseComboboxFunctionOpenMenuAction = {
  type: UseComboboxStateChangeTypes.FunctionOpenMenu
}
export type UseComboboxFunctionCloseMenuAction = {
  type: UseComboboxStateChangeTypes.FunctionCloseMenu
}
export type UseComboboxFunctionSetHighlightedIndexAction = {
  type: UseComboboxStateChangeTypes.FunctionSetHighlightedIndex
  highlightedIndex: number
}
export type UseComboboxFunctionSelectItemAction<Item> = {
  type: UseComboboxStateChangeTypes.FunctionSelectItem
  selectedItem: Item | null
}
export type UseComboboxFunctionSetInputValueAction = {
  type: UseComboboxStateChangeTypes.FunctionSetInputValue
  inputValue: string
}
export type UseComboboxFunctionResetAction = {
  type: UseComboboxStateChangeTypes.FunctionReset
}
export type UseComboboxControlledPropUpdatedSelectedItemAction = {
  type: UseComboboxStateChangeTypes.ControlledPropUpdatedSelectedItem
  inputValue: string
}

export type UseComboboxReducerAction<Item> =
  | UseComboboxInputKeyDownArrowDownAction
  | UseComboboxInputKeyDownArrowUpAction
  | UseComboboxInputKeyDownHomeAction
  | UseComboboxInputKeyDownEndAction
  | UseComboboxInputKeyDownEscapeAction
  | UseComboboxInputKeyDownEnterAction
  | UseComboboxInputKeyDownPageUpAction
  | UseComboboxInputKeyDownPageDownAction
  | UseComboboxInputChangeAction
  | UseComboboxInputBlurAction
  | UseComboboxInputClickAction
  | UseComboboxMenuMouseLeaveAction
  | UseComboboxItemMouseMoveAction
  | UseComboboxItemClickAction
  | UseComboboxToggleButtonClickAction
  | UseComboboxFunctionToggleMenuAction
  | UseComboboxFunctionOpenMenuAction
  | UseComboboxFunctionCloseMenuAction
  | UseComboboxFunctionSetHighlightedIndexAction
  | UseComboboxFunctionSelectItemAction<Item>
  | UseComboboxFunctionSetInputValueAction
  | UseComboboxFunctionResetAction
  | UseComboboxControlledPropUpdatedSelectedItemAction

export interface UseComboboxProps<Item> {
  items: Item[]
  isItemDisabled?(item: Item, index: number): boolean
  itemToString?: (item: Item | null) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Breaking Change to move to unknown.
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

export type UseComboboxMergedProps<Item> = Omit<
  UseComboboxProps<Item>,
  | 'itemToString'
  | 'itemToKey'
  | 'stateReducer'
  | 'scrollIntoView'
  | 'isItemDisabled'
> &
  Required<
    Pick<
      UseComboboxProps<Item>,
      | 'itemToString'
      | 'itemToKey'
      | 'stateReducer'
      | 'scrollIntoView'
      | 'isItemDisabled'
    >
  >

export interface UseComboboxStateChangeOptions<
  Item,
> extends UseComboboxDispatchAction<Item> {
  changes: Partial<UseComboboxState<Item>>
  props: UseComboboxMergedProps<Item>
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

export interface UseComboboxGetMenuPropsOptions extends React.HTMLProps<HTMLElement> {
  refKey?: string
  ref?: AnyRef
}

export interface UseComboboxGetMenuPropsReturnValue {
  'aria-label': string | undefined
  'aria-labelledby': string | undefined
  ref?: AnyRef
  role: 'listbox'
  id: string
  onMouseLeave: React.MouseEventHandler
}

export type UseComboboxGetMenuProps = <Options>(
  options?: UseComboboxGetMenuPropsOptions & Options,
  otherOptions?: GetPropsCommonOptions,
) => Overwrite<UseComboboxGetMenuPropsReturnValue, Options>

export interface UseComboboxGetToggleButtonPropsOptions extends React.HTMLProps<HTMLElement> {
  disabled?: boolean
  refKey?: string
  ref?: AnyRef
  onPress?: (event: React.BaseSyntheticEvent) => void
}

export interface UseComboboxGetToggleButtonPropsReturnValue {
  'aria-controls': string
  'aria-expanded': boolean
  id: string
  onPress?: (event: React.BaseSyntheticEvent) => void
  onClick?: React.MouseEventHandler
  ref?: AnyRef
  tabIndex: -1
}

export type UseComboboxGetToggleButtonProps = <Options>(
  options?: UseComboboxGetToggleButtonPropsOptions & Options,
) => Overwrite<UseComboboxGetToggleButtonPropsReturnValue, Options>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseComboboxGetLabelPropsOptions extends React.HTMLProps<HTMLElement> {}

export interface UseComboboxGetLabelPropsReturnValue {
  htmlFor: string
  id: string
}

export type UseComboboxGetLabelProps = <Options>(
  options?: UseComboboxGetLabelPropsOptions & Options,
) => Overwrite<UseComboboxGetLabelPropsReturnValue, Options>

export interface UseComboboxGetItemPropsOptions<
  Item,
> extends React.HTMLProps<HTMLElement> {
  index?: number
  item?: Item
  refKey?: string
  ref?: AnyRef
  onPress?: (event: React.BaseSyntheticEvent) => void
}

export interface UseComboboxGetItemPropsReturnValue {
  'aria-selected': boolean
  'aria-disabled': boolean
  id: string
  onClick?: React.MouseEventHandler
  onMouseDown?: React.MouseEventHandler
  onMouseMove?: React.MouseEventHandler
  onPress?: React.MouseEventHandler
  ref?: AnyRef
  role: 'option'
}

export type UseComboboxGetItemProps<Item> = <Options>(
  options?: UseComboboxGetItemPropsOptions<Item> & Options,
) => Omit<
  Overwrite<UseComboboxGetItemPropsReturnValue, Options>,
  'index' | 'item'
>

export interface UseComboboxGetInputPropsOptions extends React.HTMLProps<HTMLInputElement> {
  refKey?: string
  ref?: React.Ref<HTMLInputElement>
  onChangeText?: (event: React.BaseSyntheticEvent) => void
}

export interface UseComboboxGetInputPropsReturnValue {
  ref?: AnyRef
  'aria-activedescendant': string
  'aria-autocomplete': 'list'
  'aria-controls': string
  'aria-expanded': boolean
  'aria-labelledby': string | undefined
  'aria-label': string | undefined
  autoComplete: 'off'
  disabled: boolean | undefined
  id: string
  role: 'combobox'
  value: string
  onBlur?: React.FocusEventHandler
  onChange?: React.ChangeEventHandler
  onChangeText?: React.ChangeEventHandler
  onClick?: React.MouseEventHandler
  onInput?: React.FormEventHandler
  onKeyDown?: React.KeyboardEventHandler
}

export type UseComboboxGetInputProps = <Options>(
  options?: UseComboboxGetInputPropsOptions & Options,
  otherOptions?: GetPropsCommonOptions,
) => Overwrite<UseComboboxGetInputPropsReturnValue, Options>

export interface UseComboboxPropGetters<Item> {
  getToggleButtonProps: UseComboboxGetToggleButtonProps
  getLabelProps: UseComboboxGetLabelProps
  getMenuProps: UseComboboxGetMenuProps
  getItemProps: UseComboboxGetItemProps<Item>
  getInputProps: UseComboboxGetInputProps
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

export declare const useCombobox: UseComboboxInterface
