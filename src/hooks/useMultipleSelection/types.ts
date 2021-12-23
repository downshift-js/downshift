import {
  Environment,
  GetPropsWithRefKey,
  GetToggleButtonPropsOptions,
} from '../../types'
import {GetInputPropsOptions} from '../useCombobox/types'

/* Internal Types */

type SelectedItemKeyDownNavigationPreviousAction = {
  type: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownNavigationPrevious
}

type SelectedItemKeyDownNavigatioNextAction = {
  type: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownNavigationNext
}
type SelectedItemKeyDownDeleteAction = {
  type: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownDelete
}
type SelectedItemKeyDownBackspaceAction = {
  type: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownBackspace
}
type SelectedItemClickAction = {
  type: UseMultipleSelectionStateChangeTypes.SelectedItemClick
  index: number
}
type DropdownClickAction = {
  type: UseMultipleSelectionStateChangeTypes.DropdownClick
}
type DropdownKeyDownNavigationPreviousAction = {
  type: UseMultipleSelectionStateChangeTypes.DropdownKeyDownNavigationPrevious
}
type DropdownKeyDownBackspaceAction = {
  type: UseMultipleSelectionStateChangeTypes.DropdownKeyDownBackspace
}
type FunctionAddSelectedItemAction<Item> = {
  type: UseMultipleSelectionStateChangeTypes.FunctionAddSelectedItem
  selectedItem: Item
}
type FunctionRemoveSelectedItemAction<Item> = {
  type: UseMultipleSelectionStateChangeTypes.FunctionRemoveSelectedItem
  selectedItem: Item
}
type FunctionSetActiveIndexAction = {
  type: UseMultipleSelectionStateChangeTypes.FunctionSetActiveIndex
  activeIndex: number
}
type FunctionResetAction = {
  type: UseMultipleSelectionStateChangeTypes.FunctionReset
}
type FunctionSetSelectedItemsAction<Item> = {
  type: UseMultipleSelectionStateChangeTypes.FunctionSetSelectedItems
  selectedItems: Item[]
}

export type UseMultipleSelectionDispatchProps<Item> =
  | SelectedItemKeyDownNavigationPreviousAction
  | SelectedItemKeyDownNavigatioNextAction
  | SelectedItemKeyDownBackspaceAction
  | SelectedItemKeyDownDeleteAction
  | SelectedItemClickAction
  | DropdownClickAction
  | DropdownKeyDownNavigationPreviousAction
  | DropdownKeyDownBackspaceAction
  | FunctionAddSelectedItemAction<Item>
  | FunctionRemoveSelectedItemAction<Item>
  | FunctionSetActiveIndexAction
  | FunctionResetAction
  | FunctionSetSelectedItemsAction<Item>

export type UseMultipleSelectionDispatch<Item> = (
  props: UseMultipleSelectionDispatchProps<Item>,
) => void

export type UseMultipleSelectionReducerAction<Item> = {
  props: UseMultipleSelectionProps<Item>
} & UseMultipleSelectionDispatchProps<Item>

export interface UseMultipleSelectionDefaultProps<Item> {
  itemToString: (item: Item) => string
  getA11yRemovalMessage: (options: A11yRemovalMessage<Item>) => string
  stateReducer: (
    state: UseMultipleSelectionState<Item>,
    actionAndChanges: UseMultipleSelectionStateChangeOptions<Item>,
  ) => Partial<UseMultipleSelectionState<Item>>
  keyNavigationNext: string
  keyNavigationPrevious: string
  environment: Environment
}

/* External Types */

export interface UseMultipleSelectionState<Item> {
  selectedItems: Item[]
  activeIndex: number
}

export interface UseMultipleSelectionProps<Item> {
  selectedItems?: Item[]
  initialSelectedItems?: Item[]
  defaultSelectedItems?: Item[]
  itemToString?: (item: Item) => string
  getA11yRemovalMessage?: (options: A11yRemovalMessage<Item>) => string
  stateReducer?: (
    state: UseMultipleSelectionState<Item>,
    actionAndChanges: UseMultipleSelectionStateChangeOptions<Item>,
  ) => Partial<UseMultipleSelectionState<Item>>
  activeIndex?: number
  initialActiveIndex?: number
  defaultActiveIndex?: number
  onActiveIndexChange?: (changes: UseMultipleSelectionStateChange<Item>) => void
  onSelectedItemsChange?: (
    changes: UseMultipleSelectionStateChange<Item>,
  ) => void
  onStateChange?: (changes: UseMultipleSelectionStateChange<Item>) => void
  keyNavigationNext?: string
  keyNavigationPrevious?: string
  environment?: Environment
}

export interface UseMultipleSelectionStateChangeOptions<Item>
  extends UseMultipleSelectionDispatchAction<Item> {
  changes: Partial<UseMultipleSelectionState<Item>>
}

export interface UseMultipleSelectionDispatchAction<Item> {
  type: UseMultipleSelectionStateChangeTypes
  index?: number
  selectedItem?: Item | null
  selectedItems?: Item[]
  activeIndex?: number
}

export interface UseMultipleSelectionStateChange<Item>
  extends Partial<UseMultipleSelectionState<Item>> {
  type: UseMultipleSelectionStateChangeTypes
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

export interface A11yRemovalMessage<Item> {
  activeIndex: number
  activeSelectedItem?: Item
  itemToString: (item: Item) => string
  resultCount: number
  removedSelectedItem: Item
}

export interface UseMultipleSelectionGetSelectedItemPropsOptions<Item>
  extends React.HTMLProps<HTMLElement>,
    GetPropsWithRefKey {
  index?: number
  selectedItem: Item
}

export interface UseMultipleSelectionComboboxGetDropdownPropsOptions
  extends GetInputPropsOptions,
    GetPropsWithRefKey {
  preventKeyAction?: boolean
}

export interface UseMultipleSelectionSelectGetDropdownPropsOptions
  extends GetToggleButtonPropsOptions,
    GetPropsWithRefKey {
  preventKeyAction?: boolean
}

export type UseMultipleSelectionGetDropdownPropsOptions =
  | UseMultipleSelectionSelectGetDropdownPropsOptions
  | UseMultipleSelectionComboboxGetDropdownPropsOptions
