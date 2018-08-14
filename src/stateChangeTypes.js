import productionEnum from './productionEnum.macro'

export const unknown = productionEnum('__autocomplete_unknown__')
export const mouseUp = productionEnum('__autocomplete_mouseup__')
export const itemMouseEnter = productionEnum('__autocomplete_item_mouseenter__')
export const keyDownArrowUp = productionEnum(
  '__autocomplete_keydown_arrow_up__',
)
export const keyDownArrowDown = productionEnum(
  '__autocomplete_keydown_arrow_down__',
)
export const keyDownEscape = productionEnum('__autocomplete_keydown_escape__')
export const keyDownEnter = productionEnum('__autocomplete_keydown_enter__')
export const clickItem = productionEnum('__autocomplete_click_item__')
export const blurInput = productionEnum('__autocomplete_blur_input__')
export const changeInput = productionEnum('__autocomplete_change_input__')
export const keyDownSpaceButton = productionEnum(
  '__autocomplete_keydown_space_button__',
)
export const clickButton = productionEnum('__autocomplete_click_button__')
export const blurButton = productionEnum('__autocomplete_blur_button__')
export const controlledPropUpdatedSelectedItem = productionEnum(
  '__autocomplete_controlled_prop_updated_selected_item__',
)
export const touchStart = productionEnum('__autocomplete_touchstart__')
