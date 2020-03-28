import productionEnum from '../../productionEnum.macro'

export const ItemClick = productionEnum('__item_click__')
export const ItemKeyDownDelete = productionEnum('__item_keydown_delete__')
export const ItemKeyDownBackspace = productionEnum('__item_keydown_backspace__')
export const ItemKeyDownNavigationNext = productionEnum(
  '__item_keydown_navigation_next__',
)
export const ItemKeyDownNavigationPrevious = productionEnum(
  '__item_keydown_navigation_previous__',
)

export const DropdownKeyDownNavigationPrevious = productionEnum(
  '__dropdown_keydown_navigation_previous__',
)
export const DropdownKeyDownBackspace = productionEnum(
  '__dropdown_keydown_backspace__',
)
export const DropdownClick = productionEnum('__dropdown_click__')

export const FunctionAddItem = productionEnum('__function_add_item__')
export const FunctionRemoveItem = productionEnum('__function_remove_item__')
export const FunctionSetItems = productionEnum('__function_set_items__')
export const FunctionSetActiveIndex = productionEnum(
  '__function_set_active_index__',
)
export const FunctionReset = productionEnum('__function_reset__')
