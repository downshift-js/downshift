// @flow

type A11yOptionsStatusMessageOptions = {
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
  getRootProps: (options: GetRootPropsOptions) => any,
  getButtonProps: (options: GetButtonPropsOptions) => any,
  getLabelProps: (options: GetLabelPropsOptions) => any,
  getInputProps: (options: GetInputPropsOptions) => any,
  getItemProps: (options: GetItemPropsOptions) => any,
  openMenu: () => void,
  closeMenu: () => void,
  toggleMenu: () => void,
  selectItem: (item: any) => void,
  selectItemAtIndex: (index: number) => void,
  selectHighlightedItem: (index: number) => void,
  setHighlightedItem: (index: number) => void,
  clearSelection: () => void,
  highlightedIndex: number,
  inputValue: string,
  isOpen: boolean,
  selectedItem: any,
}

class GetInputPropsOptions extends HTMLInputElement {}

class GetLabelPropsOptions extends HTMLLabelElement {}

class GetButtonPropsOptions extends HTMLButtonElement {
  clearSelection: () => void
  closeMenu: () => void
  openMenu: () => void
  selectHighlightedItem: () => void
  selectItem: (item: any) => void
  selectItemAtIndex: (index: number) => void
  setHighlightedIndex: (index: number) => void
  toggleMenu: (state: boolean) => void
  highlightedIndex: number
  inputValue: string
  isOpen: boolean
  selectedItem: any
}

type ChildrenFunction = (options: ControllerStateAndHelpers) => React$Node<*>

type downshiftProps = {
  children: ChildrenFunction,
  defaultHighlightedIndex?: number,
  defaultSelectedItem?: any,
  defaultInputValue?: string,
  defaultIsOpen?: boolean,
  getA11yStatusMessage?: (options: A11yOptionsStatusMessageOptions) => any,
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

class Downshift extends React$Component<downshiftProps, void> {
  props: downshiftProps
}

declare module 'downshift' {
  declare export default Downshift
}
