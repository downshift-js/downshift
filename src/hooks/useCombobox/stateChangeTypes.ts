import productionEnum from '../../productionEnum.macro'
import {UseComboboxStateChangeTypes} from '.'

export const InputKeyDownArrowDown = productionEnum(
  '__input_keydown_arrow_down__',
) as UseComboboxStateChangeTypes.InputKeyDownArrowDown

export const InputKeyDownArrowUp = productionEnum(
  '__input_keydown_arrow_up__',
) as UseComboboxStateChangeTypes.InputKeyDownArrowUp

export const InputKeyDownEscape = productionEnum(
  '__input_keydown_escape__',
) as UseComboboxStateChangeTypes.InputKeyDownEscape

export const InputKeyDownHome = productionEnum(
  '__input_keydown_home__',
) as UseComboboxStateChangeTypes.InputKeyDownHome

export const InputKeyDownEnd = productionEnum(
  '__input_keydown_end__',
) as UseComboboxStateChangeTypes.InputKeyDownEnd

export const InputKeyDownPageUp = productionEnum(
  '__input_keydown_page_up__',
) as UseComboboxStateChangeTypes.InputKeyDownPageUp

export const InputKeyDownPageDown = productionEnum(
  '__input_keydown_page_down__',
) as UseComboboxStateChangeTypes.InputKeyDownPageDown

export const InputKeyDownEnter = productionEnum(
  '__input_keydown_enter__',
) as UseComboboxStateChangeTypes.InputKeyDownEnter

export const InputChange = productionEnum(
  '__input_change__',
) as UseComboboxStateChangeTypes.InputChange

export const InputBlur = productionEnum(
  '__input_blur__',
) as UseComboboxStateChangeTypes.InputBlur

export const InputClick = productionEnum(
  '__input_click__',
) as UseComboboxStateChangeTypes.InputClick

export const MenuMouseLeave = productionEnum(
  '__menu_mouse_leave__',
) as UseComboboxStateChangeTypes.MenuMouseLeave

export const ItemMouseMove = productionEnum(
  '__item_mouse_move__',
) as UseComboboxStateChangeTypes.ItemMouseMove

export const ItemClick = productionEnum(
  '__item_click__',
) as UseComboboxStateChangeTypes.ItemClick

export const ToggleButtonClick = productionEnum(
  '__togglebutton_click__',
) as UseComboboxStateChangeTypes.ToggleButtonClick

export const FunctionToggleMenu = productionEnum(
  '__function_toggle_menu__',
) as UseComboboxStateChangeTypes.FunctionToggleMenu

export const FunctionOpenMenu = productionEnum(
  '__function_open_menu__',
) as UseComboboxStateChangeTypes.FunctionOpenMenu

export const FunctionCloseMenu = productionEnum(
  '__function_close_menu__',
) as UseComboboxStateChangeTypes.FunctionCloseMenu

export const FunctionSetHighlightedIndex = productionEnum(
  '__function_set_highlighted_index__',
) as UseComboboxStateChangeTypes.FunctionSetHighlightedIndex

export const FunctionSelectItem = productionEnum(
  '__function_select_item__',
) as UseComboboxStateChangeTypes.FunctionSelectItem

export const FunctionSetInputValue = productionEnum(
  '__function_set_input_value__',
) as UseComboboxStateChangeTypes.FunctionSetInputValue

export const FunctionReset = productionEnum(
  '__function_reset__',
) as UseComboboxStateChangeTypes.FunctionReset

export const ControlledPropUpdatedSelectedItem = productionEnum(
  '__controlled_prop_updated_selected_item__',
) as UseComboboxStateChangeTypes.ControlledPropUpdatedSelectedItem
