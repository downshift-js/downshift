import {productionEnumFn} from '../stateChangeTypes'

export * from '../stateChangeTypes'

export const MenuKeyDownArrowDown = productionEnumFn(
  '__menu_keydown_arrow_down__',
)
export const MenuKeyDownArrowUp = productionEnumFn('__menu_keydown_arrow_up__')
export const MenuKeyDownEscape = productionEnumFn('__menu_keydown_escape__')
export const MenuKeyDownHome = productionEnumFn('__menu_keydown_home__')
export const MenuKeyDownEnd = productionEnumFn('__menu_keydown_end__')
export const MenuKeyDownEnter = productionEnumFn('__menu_keydown_enter__')
export const MenuKeyDownSpaceButton = productionEnumFn(
  '__menu_keydown_space_button__',
)
export const MenuKeyDownCharacter = productionEnumFn('__menu_keydown_character__')
export const MenuBlur = productionEnumFn('__menu_blur__')
export const ToggleButtonKeyDownArrowDown = productionEnumFn(
  '__togglebutton_keydown_arrow_down__',
)
export const ToggleButtonKeyDownArrowUp = productionEnumFn(
  '__togglebutton_keydown_arrow_up__',
)
export const ToggleButtonKeyDownCharacter = productionEnumFn(
  '__togglebutton_keydown_character__',
)
