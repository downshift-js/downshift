import {productionEnumFn} from '../stateChangeTypes'

export * from '../stateChangeTypes'

export const InputKeyDownArrowDown = productionEnumFn(
  '__input_keydown_arrow_down__',
)
export const InputKeyDownArrowUp = productionEnumFn('__input_keydown_arrow_up__')
export const InputKeyDownEscape = productionEnumFn('__input_keydown_escape__')
export const InputKeyDownHome = productionEnumFn('__input_keydown_home__')
export const InputKeyDownEnd = productionEnumFn('__input_keydown_end__')
export const InputKeyDownEnter = productionEnumFn('__input_keydown_enter__')
export const InputChange = productionEnumFn('__input_change__')
export const InputBlur = productionEnumFn('__input_blur__')
export const ControlledPropUpdatedSelectedItem = productionEnumFn(
  '__controlled_prop_updated_selected_item__',
)
