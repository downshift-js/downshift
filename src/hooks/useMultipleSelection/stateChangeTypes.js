import productionEnum from '../../productionEnum.macro'

export const SelectedItemClick = productionEnum('__selected_item_click__')
export const SelectedItemKeyDownDelete = productionEnum(
  '__selected_item_keydown_delete__',
)
export const SelectedItemKeyDownBackspace = productionEnum(
  '__selected_item_keydown_backspace__',
)
export const SelectedItemKeyDownNavigationNext = productionEnum(
  '__selected_item_keydown_navigation_next__',
)
export const SelectedItemKeyDownNavigationPrevious = productionEnum(
  '__selected_item_keydown_navigation_previous__',
)

export const DropdownKeyDownNavigationPrevious = productionEnum(
  '__dropdown_keydown_navigation_previous__',
)
export const DropdownKeyDownBackspace = productionEnum(
  '__dropdown_keydown_backspace__',
)
export const DropdownClick = productionEnum('__dropdown_click__')

export const FunctionAddSelectedItem = productionEnum(
  '__function_add_selected_item__',
)
export const FunctionRemoveSelectedItem = productionEnum(
  '__function_remove_selected_item__',
)
export const FunctionSetSelectedItems = productionEnum(
  '__function_set_selected_items__',
)
export const FunctionSetActiveIndex = productionEnum(
  '__function_set_active_index__',
)
export const FunctionReset = productionEnum('__function_reset__')
