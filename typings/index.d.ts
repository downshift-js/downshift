import * as React from 'react'

type Callback = () => void

export interface DownshiftState<Item> {
  highlightedIndex: number | null
  inputValue: string | null
  isOpen: boolean
  selectedItem: Item
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
}

export interface DownshiftProps<Item> {
  defaultSelectedItem?: Item
  defaultHighlightedIndex?: number | null
  defaultInputValue?: string
  defaultIsOpen?: boolean
  itemToString?: (item: Item) => string
  selectedItemChanged?: (prevItem: Item, item: Item) => boolean
  getA11yStatusMessage?: (options: A11yStatusMessageOptions<Item>) => string
  onChange?: (
    selectedItem: Item,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
  onSelect?: (
    selectedItem: Item,
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
  ) => StateChangeOptions<Item>
  itemCount?: number
  highlightedIndex?: number
  inputValue?: string
  isOpen?: boolean
  selectedItem?: Item
  render?: ChildrenFunction<Item>
  children?: ChildrenFunction<Item>
  id?: string
  environment?: Environment
  onOuterClick?: () => void
  onUserAction?: (
    options: StateChangeOptions<Item>,
    stateAndHelpers: ControllerStateAndHelpers<Item>,
  ) => void
}

export interface Environment {
  addEventListener: typeof window.addEventListener
  removeEventListener: typeof window.removeEventListener
  document: Document
}

export interface A11yStatusMessageOptions<Item> {
  highlightedIndex: number | null
  inputValue: string
  isOpen: boolean
  itemToString: (item: Item) => string
  previousResultCount: number
  resultCount: number
  selectedItem: Item
}

export interface StateChangeOptions<Item> {
  type: StateChangeTypes
  highlightedIndex: number
  inputValue: string
  isOpen: boolean
  selectedItem: Item
}

export interface GetRootPropsOptions {
  refKey: string
}

export interface GetInputPropsOptions
  extends React.HTMLProps<HTMLInputElement> {}

export interface GetLabelPropsOptions
  extends React.HTMLProps<HTMLLabelElement> {}

export interface getToggleButtonPropsOptions
  extends React.HTMLProps<HTMLButtonElement> {}

interface OptionalExtraGetItemPropsOptions {
  [key: string]: any
}

export interface GetItemPropsOptions<Item>
  extends OptionalExtraGetItemPropsOptions {
  index?: number
  item: Item
}

export interface PropGetters<Item> {
  getRootProps: (options: GetRootPropsOptions) => any
  getToggleButtonProps: (options?: getToggleButtonPropsOptions) => any
  getButtonProps: (options?: getToggleButtonPropsOptions) => any
  getLabelProps: (options?: GetLabelPropsOptions) => any
  getInputProps: (options?: GetInputPropsOptions) => any
  getItemProps: (options: GetItemPropsOptions<Item>) => any
}

export interface Actions<Item> {
  openMenu: (cb?: Callback) => void
  closeMenu: (cb?: Callback) => void
  toggleMenu: (cb?: Callback) => void
  selectItem: (item: Item, otherStateToSet?: {}, cb?: Callback) => void
  selectItemAtIndex: (
    index: number,
    otherStateToSet?: {},
    cb?: Callback,
  ) => void
  selectHighlightedItem: (otherStateToSet?: {}, cb?: Callback) => void
  setHighlightedIndex: (
    index: number,
    otherStateToSet?: {},
    cb?: Callback,
  ) => void
  clearSelection: (cb?: Callback) => void
  clearItems: () => void
  reset: (otherStateToSet?: {}, cb?: Callback) => void
  itemToString: (item: Item) => string
}

export type ControllerStateAndHelpers<Item> = DownshiftState<Item> &
  PropGetters<Item> &
  Actions<Item>

export type ChildrenFunction<Item> = (
  options: ControllerStateAndHelpers<Item>,
) => React.ReactNode

export type DownshiftInterface<Item> = React.ComponentClass<
  DownshiftProps<Item>
> & {
  stateChangeTypes: {
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
  }
}

declare const Downshift: DownshiftInterface<any>
export default Downshift
