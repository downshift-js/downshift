import productionEnum from '../../productionEnum.macro'

export const ItemClick = productionEnum('__item_click__')
export const ItemKeyDownDelete = productionEnum('__item_keydown_delete__')
export const ItemKeyDownBackspace = productionEnum('__item_keydown_backspace__')
export const ItemKeyDownArrowRight = productionEnum(
  '__item_keydown_arrow_right__',
)
export const ItemKeyDownArrowLeft = productionEnum(
  '__item_keydown_arrow_left__',
)

export const DropdownKeyDownArrowLeft = productionEnum(
  '__dropdown_keydown_arrow_left__',
)
export const DropdownKeyDownBackspace = productionEnum(
  '__dropdown_keydown_backspace__',
)

export const FunctionAddItem = productionEnum('__function_add_item__')
export const FunctionRemoveItem = productionEnum('__function_remove_item__')
