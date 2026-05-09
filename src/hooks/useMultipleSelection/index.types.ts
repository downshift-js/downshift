import * as React from 'react'
import {
  Environment,
  GetPropsCommonOptions,
  Overwrite,
} from '../../downshift.types'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Breaking Change to move to unknown.
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

export interface UseMultipleSelectionStateChangeOptions<
  Item,
> extends UseMultipleSelectionDispatchAction<Item> {
  changes: Partial<UseMultipleSelectionState<Item>>
}

export interface UseMultipleSelectionDispatchAction<Item> {
  type: UseMultipleSelectionStateChangeTypes
  index?: number
  selectedItem?: Item | null
  selectedItems?: Item[]
  activeIndex?: number
}

export interface UseMultipleSelectionStateChange<Item> extends Partial<
  UseMultipleSelectionState<Item>
> {
  type: UseMultipleSelectionStateChangeTypes
}

export interface UseMultipleSelectionActiveIndexChange<
  Item,
> extends UseMultipleSelectionStateChange<Item> {
  activeIndex: number
}

export interface UseMultipleSelectionSelectedItemsChange<
  Item,
> extends UseMultipleSelectionStateChange<Item> {
  selectedItems: Item[]
}

export interface A11yRemovalMessage<Item> {
  itemToString: (item: Item) => string
  resultCount: number
  activeSelectedItem: Item
  removedSelectedItem: Item
  activeIndex: number
}

export interface UseMultipleSelectionGetSelectedItemPropsOptions<
  Item,
> extends React.HTMLProps<HTMLElement> {
  refKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  index?: number
  selectedItem: Item
}

export interface UseMultipleSelectionGetSelectedItemReturnValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  tabIndex: 0 | -1
  onClick: React.MouseEventHandler
  onKeyDown: React.KeyboardEventHandler
}

export interface UseMultipleSelectionGetDropdownPropsOptions extends React.HTMLProps<HTMLElement> {
  preventKeyAction?: boolean
  refKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
}

export interface UseMultipleSelectionGetDropdownReturnValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- element type unknown at declaration site
  ref?: React.Ref<any>
  onClick?: React.MouseEventHandler
  onKeyDown?: React.KeyboardEventHandler
}

export interface UseMultipleSelectionPropGetters<Item> {
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

export declare const useMultipleSelection: UseMultipleSelectionInterface
