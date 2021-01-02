import productionEnum from '../../productionEnum.macro'
export * from '../stateChangeTypes'

export const InputKeyDownArrowDown = productionEnum(
  '__input_keydown_arrow_down__',
)
export const InputKeyDownArrowUp = productionEnum('__input_keydown_arrow_up__')
export const InputKeyDownEscape = productionEnum('__input_keydown_escape__')
export const InputKeyDownHome = productionEnum('__input_keydown_home__')
export const InputKeyDownEnd = productionEnum('__input_keydown_end__')
export const InputKeyDownEnter = productionEnum('__input_keydown_enter__')
export const InputChange = productionEnum('__input_change__')
export const InputBlur = productionEnum('__input_blur__')
export const ControlledPropUpdatedSelectedItem = productionEnum(
  '__controlled_prop_updated_selected_item__',
)
