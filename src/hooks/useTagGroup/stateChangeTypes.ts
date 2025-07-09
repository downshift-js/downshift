import productionEnum from '../../productionEnum.macro'
import {UseTagGroupStateChangeTypes} from './index.types'

export const TagClick: UseTagGroupStateChangeTypes.TagClick =
  productionEnum('__tag_click__')

export const TagGroupKeyDownArrowLeft: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft =
  productionEnum('__taggroup_keydown_arrowleft__')
export const TagGroupKeyDownArrowRight: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight =
  productionEnum('__taggroup_keydown_arrowright__')
