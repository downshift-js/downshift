/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {UseMultipleSelectionStateChangeTypes} from './types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const productionEnum = require('../../productionEnum.macro')

export const SelectedItemClick: UseMultipleSelectionStateChangeTypes.SelectedItemClick = productionEnum(
  '__selected_item_click__',
)
export const SelectedItemKeyDownDelete: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownDelete = productionEnum(
  '__selected_item_keydown_delete__',
)
export const SelectedItemKeyDownBackspace: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownBackspace = productionEnum(
  '__selected_item_keydown_backspace__',
)
export const SelectedItemKeyDownNavigationNext: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownNavigationNext = productionEnum(
  '__selected_item_keydown_navigation_next__',
)
export const SelectedItemKeyDownNavigationPrevious: UseMultipleSelectionStateChangeTypes.SelectedItemKeyDownNavigationPrevious = productionEnum(
  '__selected_item_keydown_navigation_previous__',
)

export const DropdownKeyDownNavigationPrevious: UseMultipleSelectionStateChangeTypes.DropdownKeyDownNavigationPrevious = productionEnum(
  '__dropdown_keydown_navigation_previous__',
)
export const DropdownKeyDownBackspace: UseMultipleSelectionStateChangeTypes.DropdownKeyDownBackspace = productionEnum(
  '__dropdown_keydown_backspace__',
)
export const DropdownClick: UseMultipleSelectionStateChangeTypes.DropdownClick = productionEnum(
  '__dropdown_click__',
)

export const FunctionAddSelectedItem: UseMultipleSelectionStateChangeTypes.FunctionAddSelectedItem = productionEnum(
  '__function_add_selected_item__',
)
export const FunctionRemoveSelectedItem: UseMultipleSelectionStateChangeTypes.FunctionRemoveSelectedItem = productionEnum(
  '__function_remove_selected_item__',
)
export const FunctionSetSelectedItems: UseMultipleSelectionStateChangeTypes.FunctionSetSelectedItems = productionEnum(
  '__function_set_selected_items__',
)
export const FunctionSetActiveIndex: UseMultipleSelectionStateChangeTypes.FunctionSetActiveIndex = productionEnum(
  '__function_set_active_index__',
)
export const FunctionReset: UseMultipleSelectionStateChangeTypes.FunctionReset = productionEnum(
  '__function_reset__',
)
