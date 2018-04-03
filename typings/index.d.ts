import * as React from 'react'

export interface DownshiftState {
  highlightedIndex: number | null
  inputValue: string | null
  isOpen: boolean
  selectedItem: any
}

export interface DownshiftStateWithType extends DownshiftState {
  type: StateChangeTypes;
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

export interface BreakingChangesProps {
  resetInputOnSelection?: boolean;
}

export interface DownshiftProps {
  defaultSelectedItem?: any
  defaultHighlightedIndex?: number | null
  defaultInputValue?: string
  defaultIsOpen?: boolean
  itemToString?: (item: any) => string
  selectedItemChanged?: (prevItem: any, item: any) => boolean
  getA11yStatusMessage?: (options: A11yStatusMessageOptions) => any
  onChange?: (
    selectedItem: any,
    stateAndHelpers: ControllerStateAndHelpers,
  ) => void
  onSelect?: (
    selectedItem: any,
    stateAndHelpers: ControllerStateAndHelpers,
  ) => void
  onStateChange?: (
    options: StateChangeOptions,
    stateAndHelpers: ControllerStateAndHelpers,
  ) => void
  onInputValueChange?: (
    inputValue: string,
    stateAndHelpers: ControllerStateAndHelpers,
  ) => void
  stateReducer?: (
    state: DownshiftState,
    changes: StateChangeOptions,
  ) => StateChangeOptions
  itemCount?: number
  highlightedIndex?: number
  inputValue?: string
  isOpen?: boolean
  selectedItem?: any
  render?: ChildrenFunction
  children?: ChildrenFunction
  id?: string
  environment?: Environment
  onOuterClick?: () => void
  onUserAction?: (
    options: StateChangeOptions,
    stateAndHelpers: ControllerStateAndHelpers,
  ) => void
  breakingChanges?: BreakingChangesProps;
}

export interface Environment {
  addEventListener: (type: string, cb: Function) => void
  removeEventListener: (type: string, cb: Function) => void
  document: Document
}

export interface Document {
  getElementById: (id: string) => HTMLElement
}

export interface A11yStatusMessageOptions {
  highlightedIndex: number | null
  highlightedValue: any
  inputValue: string
  isOpen: boolean
  itemToString: (item: any) => string
  previousResultCount: number
  resultCount: number
  selectedItem: any
}

export interface StateChangeOptions {
  type: StateChangeTypes
  highlightedIndex: number
  inputValue: string
  isOpen: boolean
  selectedItem: any
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

export interface GetItemPropsOptions extends OptionalExtraGetItemPropsOptions {
  index?: number
  item: any
}

export interface PropGetters {
  getRootProps: (options: GetRootPropsOptions) => any
  getToggleButtonProps: (options?: getToggleButtonPropsOptions) => any
  getButtonProps: (options?: getToggleButtonPropsOptions) => any
  getLabelProps: (options?: GetLabelPropsOptions) => any
  getInputProps: (options?: GetInputPropsOptions) => any
  getItemProps: (options: GetItemPropsOptions) => any
}

export interface Actions {
  openMenu: (cb?: Function) => void
  closeMenu: (cb?: Function) => void
  toggleMenu: (cb?: Function) => void
  selectItem: (item: any, otherStateToSet?: Partial<DownshiftStateWithType>, cb?: Function) => void
  selectItemAtIndex: (
    index: number,
    otherStateToSet?: Partial<DownshiftStateWithType>,
    cb?: Function,
  ) => void
  selectHighlightedItem: (otherStateToSet?: Partial<DownshiftStateWithType>, cb?: Function) => void
  setHighlightedIndex: (
    index: number,
    otherStateToSet?: Partial<DownshiftStateWithType>,
    cb?: Function,
  ) => void
  clearSelection: (cb?: Function) => void
  clearItems: () => void
  reset: (otherStateToSet?: Partial<DownshiftStateWithType>, cb?: Function) => void
  setItemCount: (count: number) => void
  unsetItemCount: () => void
  setState: (
    stateToSet: 
      Partial<DownshiftStateWithType> |
      ((state: DownshiftStateWithType) => Partial<DownshiftStateWithType>),
    cb?: Function
  ) => void
  itemToString: (item: any) => string
}

export type ControllerStateAndHelpers = DownshiftState & PropGetters & Actions

export type ChildrenFunction = (
  options: ControllerStateAndHelpers,
) => React.ReactNode
export type DownshiftInterface = React.ComponentClass<DownshiftProps> & {
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

declare const Downshift: DownshiftInterface
export default Downshift
