import productionEnum from '../productionEnum.macro'

export const MenuMouseLeave = productionEnum('__menu_mouse_leave__')

export const ItemMouseMove = productionEnum('__item_mouse_move__')
export const ItemClick = productionEnum('__item_click__')

export const ToggleButtonClick = productionEnum('__togglebutton_click__')

export const FunctionToggleMenu = productionEnum('__function_toggle_menu__')
export const FunctionOpenMenu = productionEnum('__function_open_menu__')
export const FunctionCloseMenu = productionEnum('__function_close_menu__')
export const FunctionSetHighlightedIndex = productionEnum(
  '__function_set_highlighted_index__',
)
export const FunctionSelectItem = productionEnum('__function_select_item__')
export const FunctionSetInputValue = productionEnum(
  '__function_set_input_value__',
)
export const FunctionReset = productionEnum('__function_reset__')

// to be used by useSelect and useCombobox
export function productionEnumFn(state) {
  return productionEnum(state)
}
