import * as React from 'react'

export interface DownshiftState {
  highlightedIndex: number | null
  inputValue: string | null
  isOpen: boolean
  selectedItem: any
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
  type: string
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

export interface GetButtonPropsOptions
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
  getButtonProps: (options?: GetButtonPropsOptions) => any
  getLabelProps: (options?: GetLabelPropsOptions) => any
  getInputProps: (options?: GetInputPropsOptions) => any
  getItemProps: (options: GetItemPropsOptions) => any
}

export interface Actions {
  openMenu: (cb?: Function) => void
  closeMenu: (cb?: Function) => void
  toggleMenu: (cb?: Function) => void
  selectItem: (item: any, otherStateToSet?: object, cb?: Function) => void
  selectItemAtIndex: (
    index: number,
    otherStateToSet?: object,
    cb?: Function,
  ) => void
  selectHighlightedItem: (otherStateToSet?: object, cb?: Function) => void
  setHighlightedIndex: (
    index: number,
    otherStateToSet?: object,
    cb?: Function,
  ) => void
  clearSelection: (cb?: Function) => void
  clearItems: () => void
  reset: (otherStateToSet?: object, cb?: Function) => void
  itemToString: (item: any) => void
}

export type ControllerStateAndHelpers = DownshiftState & PropGetters & Actions

export type ChildrenFunction = (
  options: ControllerStateAndHelpers,
) => React.ReactNode
export type DownshiftInterface = React.ComponentClass<DownshiftProps>

declare const Downshift: DownshiftInterface
export default Downshift
