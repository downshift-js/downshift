import * as React from 'react'

// @flow

type A11StatusMessageOptions = {
  highlightedIndex: number,
  highlightedValue: any,
  inputValue: string,
  isOpen: boolean,
  itemToString: (item: any) => string,
  previousResultCount: number,
  resultCount: number,
  selectedItem: any,
}

type ChangeOptions = {
  selectedItem: any,
  previousItem: any,
}

type StateChangeOptions = {
  highlightedIndex: number,
  inputValue: string,
  isOpen: boolean,
  selectedItem: any,
}

type GetRootPropsOptions = {
  refKey: string,
}

type GetItemPropsOptions = {
  index: number,
  item: any,
}

type ControllerStateAndHelpers = {
  // prop getters
  getRootProps: (options: GetRootPropsOptions) => any,
  getButtonProps: (options: GetButtonPropsOptions) => any,
  getLabelProps: (options: GetLabelPropsOptions) => any,
  getInputProps: (options: GetInputPropsOptions) => any,
  getItemProps: (options: GetItemPropsOptions) => any,

  // actions
  openMenu: () => void,
  closeMenu: () => void,
  toggleMenu: () => void,
  selectItem: (item: any) => void,
  selectItemAtIndex: (index: number) => void,
  selectHighlightedItem: (index: number) => void,
  setHighlightedItem: (index: number) => void,
  clearSelection: () => void,

  // state
  highlightedIndex: number,
  inputValue: string,
  isOpen: boolean,
  selectedItem: any,
}

type GetInputPropsOptions = React.InputHTMLAttributes

type GetLabelPropsOptions = React.LabelHTMLAttributes

type GetButtonPropsOptions = {
  // actions
  clearSelection: () => void,
  closeMenu: () => void,
  openMenu: () => void,
  selectHighlightedItem: () => void,
  selectItem: (item: any) => void,
  selectItemAtIndex: (index: number) => void,
  setHighlightedIndex: (index: number) => void,
  toggleMenu: (state: boolean) => void,

  // state
  highlightedIndex: number,
  inputValue: string,
  isOpen: boolean,
  selectedItem: any,
}

type ChildrenFunction = (options: ControllerStateAndHelpers) => React.Node<*>

type downshiftProps = {
  children: ChildrenFunction,
  defaultHighlightedIndex?: number,
  defaultSelectedItem?: any,
  defaultInputValue?: string,
  defaultIsOpen?: boolean,
  getA11yStatusMessage?: (options: A11StatusMessageOptions) => any,
  itemToString?: (item: any) => any,
  onChange?: (
    options: ChangeOptions,
    stateAndHelpers: ControllerStateAndHelpers,
  ) => void,
  onStateChange?: (
    options: StateChangeOptions,
    stateAndHelpers: ControllerStateAndHelpers,
  ) => void,
  onClick?: Function,
  selectedItem?: any,
  isOpen?: boolean,
  inputValue?: string,
  highlightedIndex?: number,
}

type Downshift = React$Component<downshiftProps, void>

declare module 'downshift' {
  declare export default Downshift
}
