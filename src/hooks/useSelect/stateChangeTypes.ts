import productionEnum from '../../productionEnum.macro'
import {UseSelectStateChangeTypes} from './index.types'

export const ToggleButtonClick = productionEnum(
  '__togglebutton_click__',
) as UseSelectStateChangeTypes.ToggleButtonClick

export const ToggleButtonKeyDownArrowDown = productionEnum(
  '__togglebutton_keydown_arrow_down__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownArrowDown

export const ToggleButtonKeyDownArrowUp = productionEnum(
  '__togglebutton_keydown_arrow_up__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownArrowUp

export const ToggleButtonKeyDownCharacter = productionEnum(
  '__togglebutton_keydown_character__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownCharacter

export const ToggleButtonKeyDownEscape = productionEnum(
  '__togglebutton_keydown_escape__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownEscape

export const ToggleButtonKeyDownHome = productionEnum(
  '__togglebutton_keydown_home__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownHome

export const ToggleButtonKeyDownEnd = productionEnum(
  '__togglebutton_keydown_end__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownEnd

export const ToggleButtonKeyDownEnter = productionEnum(
  '__togglebutton_keydown_enter__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownEnter

export const ToggleButtonKeyDownSpaceButton = productionEnum(
  '__togglebutton_keydown_space_button__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownSpaceButton

export const ToggleButtonKeyDownPageUp = productionEnum(
  '__togglebutton_keydown_page_up__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownPageUp

export const ToggleButtonKeyDownPageDown = productionEnum(
  '__togglebutton_keydown_page_down__',
) as UseSelectStateChangeTypes.ToggleButtonKeyDownPageDown

export const ToggleButtonBlur = productionEnum(
  '__togglebutton_blur__',
) as UseSelectStateChangeTypes.ToggleButtonBlur

export const MenuMouseLeave = productionEnum(
  '__menu_mouse_leave__',
) as UseSelectStateChangeTypes.MenuMouseLeave

export const ItemMouseMove = productionEnum(
  '__item_mouse_move__',
) as UseSelectStateChangeTypes.ItemMouseMove

export const ItemClick = productionEnum(
  '__item_click__',
) as UseSelectStateChangeTypes.ItemClick

export const FunctionToggleMenu = productionEnum(
  '__function_toggle_menu__',
) as UseSelectStateChangeTypes.FunctionToggleMenu

export const FunctionOpenMenu = productionEnum(
  '__function_open_menu__',
) as UseSelectStateChangeTypes.FunctionOpenMenu

export const FunctionCloseMenu = productionEnum(
  '__function_close_menu__',
) as UseSelectStateChangeTypes.FunctionCloseMenu

export const FunctionSetHighlightedIndex = productionEnum(
  '__function_set_highlighted_index__',
) as UseSelectStateChangeTypes.FunctionSetHighlightedIndex

export const FunctionSelectItem = productionEnum(
  '__function_select_item__',
) as UseSelectStateChangeTypes.FunctionSelectItem

export const FunctionSetInputValue = productionEnum(
  '__function_set_input_value__',
) as UseSelectStateChangeTypes.FunctionSetInputValue

export const FunctionReset = productionEnum(
  '__function_reset__',
) as UseSelectStateChangeTypes.FunctionReset
