import * as React from 'react'
import {
  Environment,
  GetPropsCommonOptions,
  Overwrite,
} from '../../downshift.types'

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

export type UseSelectToggleButtonClickAction = {
  type: UseSelectStateChangeTypes.ToggleButtonClick
}
export type UseSelectToggleButtonKeyDownArrowDownAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownArrowDown
  altKey: boolean
}
export type UseSelectToggleButtonKeyDownArrowUpAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownArrowUp
  altKey: boolean
}
export type UseSelectToggleButtonKeyDownCharacterAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownCharacter
  key: string
}
export type UseSelectToggleButtonKeyDownEscapeAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownEscape
}
export type UseSelectToggleButtonKeyDownHomeAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownHome
}
export type UseSelectToggleButtonKeyDownEndAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownEnd
}
export type UseSelectToggleButtonKeyDownEnterAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownEnter
}
export type UseSelectToggleButtonKeyDownSpaceButtonAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownSpaceButton
}
export type UseSelectToggleButtonKeyDownPageUpAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownPageUp
}
export type UseSelectToggleButtonKeyDownPageDownAction = {
  type: UseSelectStateChangeTypes.ToggleButtonKeyDownPageDown
}
export type UseSelectToggleButtonBlurAction = {
  type: UseSelectStateChangeTypes.ToggleButtonBlur
}
export type UseSelectMenuMouseLeaveAction = {
  type: UseSelectStateChangeTypes.MenuMouseLeave
}
export type UseSelectItemMouseMoveAction = {
  type: UseSelectStateChangeTypes.ItemMouseMove
  index: number
  disabled: boolean
}
export type UseSelectItemClickAction = {
  type: UseSelectStateChangeTypes.ItemClick
  index: number
}
export type UseSelectFunctionToggleMenuAction = {
  type: UseSelectStateChangeTypes.FunctionToggleMenu
}
export type UseSelectFunctionOpenMenuAction = {
  type: UseSelectStateChangeTypes.FunctionOpenMenu
}
export type UseSelectFunctionCloseMenuAction = {
  type: UseSelectStateChangeTypes.FunctionCloseMenu
}
export type UseSelectFunctionSetHighlightedIndexAction = {
  type: UseSelectStateChangeTypes.FunctionSetHighlightedIndex
  highlightedIndex: number
}
export type UseSelectFunctionSelectItemAction<Item> = {
  type: UseSelectStateChangeTypes.FunctionSelectItem
  selectedItem: Item | null
}
export type UseSelectFunctionSetInputValueAction = {
  type: UseSelectStateChangeTypes.FunctionSetInputValue
  inputValue: string
}
export type UseSelectFunctionResetAction = {
  type: UseSelectStateChangeTypes.FunctionReset
}

export type UseSelectReducerAction<Item> =
  | UseSelectToggleButtonClickAction
  | UseSelectToggleButtonKeyDownArrowDownAction
  | UseSelectToggleButtonKeyDownArrowUpAction
  | UseSelectToggleButtonKeyDownCharacterAction
  | UseSelectToggleButtonKeyDownEscapeAction
  | UseSelectToggleButtonKeyDownHomeAction
  | UseSelectToggleButtonKeyDownEndAction
  | UseSelectToggleButtonKeyDownEnterAction
  | UseSelectToggleButtonKeyDownSpaceButtonAction
  | UseSelectToggleButtonKeyDownPageUpAction
  | UseSelectToggleButtonKeyDownPageDownAction
  | UseSelectToggleButtonBlurAction
  | UseSelectMenuMouseLeaveAction
  | UseSelectItemMouseMoveAction
  | UseSelectItemClickAction
  | UseSelectFunctionToggleMenuAction
  | UseSelectFunctionOpenMenuAction
  | UseSelectFunctionCloseMenuAction
  | UseSelectFunctionSetHighlightedIndexAction
  | UseSelectFunctionSelectItemAction<Item>
  | UseSelectFunctionSetInputValueAction
  | UseSelectFunctionResetAction

export interface UseSelectProps<Item> {
  items: Item[]
  isItemDisabled?(item: Item, index: number): boolean
  itemToString?: (item: Item | null) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Breaking Change to move to unknown.
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

export type UseSelectMergedProps<Item> = Omit<
  UseSelectProps<Item>,
  | 'itemToString'
  | 'itemToKey'
  | 'stateReducer'
  | 'scrollIntoView'
  | 'isItemDisabled'
> &
  Required<
    Pick<
      UseSelectProps<Item>,
      | 'itemToString'
      | 'itemToKey'
      | 'stateReducer'
      | 'scrollIntoView'
      | 'isItemDisabled'
    >
  >

export interface UseSelectStateChangeOptions<
  Item,
> extends UseSelectDispatchAction<Item> {
  changes: Partial<UseSelectState<Item>>
  props: UseSelectMergedProps<Item>
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

export interface UseSelectStateChange<Item> extends Partial<
  UseSelectState<Item>
> {
  type: UseSelectStateChangeTypes
}

export interface UseSelectSelectedItemChange<
  Item,
> extends UseSelectStateChange<Item> {
  selectedItem: Item | null
}

export interface UseSelectHighlightedIndexChange<
  Item,
> extends UseSelectStateChange<Item> {
  highlightedIndex: number
}

export interface UseSelectIsOpenChange<
  Item,
> extends UseSelectStateChange<Item> {
  isOpen: boolean
}

export interface UseSelectGetMenuPropsOptions extends React.HTMLProps<HTMLElement> {
  refKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
}

export interface UseSelectGetMenuPropsReturnValue {
  'aria-labelledby': string | undefined
  id: string
  onMouseLeave: React.MouseEventHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  role: 'listbox'
}

export type UseSelectGetMenuProps = <Options>(
  options?: UseSelectGetMenuPropsOptions & Options,
  otherOptions?: GetPropsCommonOptions,
) => Overwrite<UseSelectGetMenuPropsReturnValue, Options>

export interface UseSelectGetToggleButtonPropsOptions extends React.HTMLProps<HTMLElement> {
  refKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  onPress?: (event: React.BaseSyntheticEvent) => void
}

export interface UseSelectGetToggleButtonPropsReturnValue {
  'aria-activedescendant': string
  'aria-controls': string
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-labelledby': string | undefined
  id: string
  onBlur?: React.FocusEventHandler
  onClick?: React.MouseEventHandler
  onKeyDown?: React.KeyboardEventHandler
  onPress?: (event: React.BaseSyntheticEvent) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  role: 'combobox'
  tabIndex: 0
}

export type UseSelectGetToggleButtonProps = <Options>(
  options?: UseSelectGetToggleButtonPropsOptions & Options,
  otherOptions?: GetPropsCommonOptions,
) => Overwrite<UseSelectGetToggleButtonPropsReturnValue, Options>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseSelectGetLabelPropsOptions extends React.HTMLProps<HTMLLabelElement> {}

export interface UseSelectGetLabelPropsReturnValue {
  htmlFor: string
  id: string
  onClick: React.MouseEventHandler
}

export type UseSelectGetLabelProps = <Options>(
  options?: UseSelectGetLabelPropsOptions & Options,
) => Overwrite<UseSelectGetLabelPropsReturnValue, Options>

export interface UseSelectGetItemPropsOptions<
  Item,
> extends React.HTMLProps<HTMLElement> {
  item?: Item
  index?: number
  refKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  onPress?: (event: React.BaseSyntheticEvent) => void
}

export interface UseSelectGetItemPropsReturnValue {
  'aria-disabled': boolean
  'aria-selected': boolean
  id: string
  onClick?: React.MouseEventHandler
  onMouseDown?: React.MouseEventHandler
  onMouseMove?: React.MouseEventHandler
  onPress?: React.MouseEventHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  role: 'option'
}

export type UseSelectGetItemProps<Item> = <Options>(
  options: UseSelectGetItemPropsOptions<Item> & Options,
) => Omit<
  Overwrite<UseSelectGetItemPropsReturnValue, Options>,
  'index' | 'item'
>

export interface UseSelectPropGetters<Item> {
  getToggleButtonProps: UseSelectGetToggleButtonProps
  getLabelProps: UseSelectGetLabelProps
  getMenuProps: UseSelectGetMenuProps
  getItemProps: UseSelectGetItemProps<Item>
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

export declare const useSelect: UseSelectInterface
