import productionEnum from '../../productionEnum.macro'
export * from '../stateChangeTypes'

export const MenuKeyDownArrowDown = productionEnum(
  '__menu_keydown_arrow_down__',
)
export const MenuKeyDownArrowUp = productionEnum('__menu_keydown_arrow_up__')
export const MenuKeyDownEscape = productionEnum('__menu_keydown_escape__')
export const MenuKeyDownHome = productionEnum('__menu_keydown_home__')
export const MenuKeyDownEnd = productionEnum('__menu_keydown_end__')
export const MenuKeyDownEnter = productionEnum('__menu_keydown_enter__')
export const MenuKeyDownSpaceButton = productionEnum(
  '__menu_keydown_space_button__',
)
export const MenuKeyDownCharacter = productionEnum('__menu_keydown_character__')
export const MenuBlur = productionEnum('__menu_blur__')
export const ToggleButtonKeyDownArrowDown = productionEnum(
  '__togglebutton_keydown_arrow_down__',
)
export const ToggleButtonKeyDownArrowUp = productionEnum(
  '__togglebutton_keydown_arrow_up__',
)
export const ToggleButtonKeyDownCharacter = productionEnum(
  '__togglebutton_keydown_character__',
)
