import React from 'react'

export type Callback = () => void

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

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

export interface StateChangeOptions<Item> extends Partial<
  DownshiftState<Item>
> {
  type: StateChangeTypes
}

export type StateChangeFunction<Item> = (
  state: DownshiftState<Item>,
) => Partial<StateChangeOptions<Item>>

export interface GetRootPropsOptions {
  refKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any --- Backwards compatibility, make it unknown in the future.
  ref?: React.RefObject<any>
}

export interface GetRootPropsReturnValue {
  'aria-expanded': boolean
  'aria-haspopup': 'listbox'
  'aria-labelledby': string
  'aria-owns': string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any --- Backwards compatibility, make it unknown in the future.
  ref?: React.RefObject<any>
  role: 'combobox'
}

export interface GetInputPropsOptions extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean
}

export interface GetInputPropsReturnValue {
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetLabelPropsOptions extends React.HTMLProps<HTMLLabelElement> {}

export interface GetLabelPropsReturnValue {
  htmlFor: string
  id: string
}

export interface GetToggleButtonPropsOptions extends React.HTMLProps<HTMLButtonElement> {
  disabled?: boolean
  onPress?: (event: React.BaseSyntheticEvent) => void
}

export interface GetToggleButtonPropsReturnValue {
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

export interface GetMenuPropsOptions
  extends React.HTMLProps<HTMLElement>, GetPropsWithRefKey {
  ['aria-label']?: string
}

export interface GetMenuPropsReturnValue {
  'aria-labelledby': string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any --- Backwards compatibility, make it unknown in the future.
  ref?: React.RefObject<any>
  role: 'listbox'
  id: string
}

export interface GetPropsCommonOptions {
  suppressRefError?: boolean
}

export interface GetPropsWithRefKey {
  refKey?: string
}

export interface GetItemPropsOptions<
  Item,
> extends React.HTMLProps<HTMLElement> {
  index?: number
  item: Item
  isSelected?: boolean
  disabled?: boolean
}

export interface GetItemPropsReturnValue {
  'aria-selected': boolean
  id: string
  onClick?: React.MouseEventHandler
  onMouseDown?: React.MouseEventHandler
  onMouseMove?: React.MouseEventHandler
  onPress?: React.MouseEventHandler
  role: 'option'
}

export interface PropGetters<Item> {
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
  itemToString: (item: Item | null) => string
}

export type ControllerStateAndHelpers<Item> = DownshiftState<Item> &
  PropGetters<Item> &
  Actions<Item>

export type ChildrenFunction<Item> = (
  options: ControllerStateAndHelpers<Item>,
) => React.ReactNode

  // eslint-disable-next-line @typescript-eslint/no-explicit-any --- Backwards compatibility, make it unknown in the future.
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

export interface Environment {
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  document: Document
  Node: typeof window.Node
}
