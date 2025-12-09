import productionEnum from '../../productionEnum.macro'
import {UseTagGroupStateChangeTypes} from './index.types'

export const TagClick = productionEnum(
  '__tag_click__',
) as UseTagGroupStateChangeTypes.TagClick

export const TagGroupKeyDownArrowLeft = productionEnum(
  '__taggroup_keydown_arrowleft__',
) as UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft
export const TagGroupKeyDownArrowRight = productionEnum(
  '__taggroup_keydown_arrowright__',
) as UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight
export const TagGroupKeyDownDelete = productionEnum(
  '__taggroup_keydown_delete__',
) as UseTagGroupStateChangeTypes.TagGroupKeyDownDelete
export const TagGroupKeyDownBackspace = productionEnum(
  '__taggroup_keydown_backspace__',
) as UseTagGroupStateChangeTypes.TagGroupKeyDownBackspace

export const TagRemoveClick = productionEnum(
  '__tagremove_click__',
) as UseTagGroupStateChangeTypes.TagRemoveClick

export const FunctionAddItem = productionEnum(
  '__function_add_item__',
) as UseTagGroupStateChangeTypes.FunctionAddItem
