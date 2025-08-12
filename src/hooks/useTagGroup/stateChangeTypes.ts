import {UseTagGroupStateChangeTypes} from './index.types'

// eslint-disable-next-line
const productionEnum = require('../../productionEnum.macro');

export const TagClick: UseTagGroupStateChangeTypes.TagClick =
  productionEnum('__tag_click__')

export const TagGroupKeyDownArrowLeft: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowLeft =
  productionEnum('__taggroup_keydown_arrowleft__')
export const TagGroupKeyDownArrowRight: UseTagGroupStateChangeTypes.TagGroupKeyDownArrowRight =
  productionEnum('__taggroup_keydown_arrowright__')
export const TagGroupKeyDownDelete: UseTagGroupStateChangeTypes.TagGroupKeyDownDelete =
  productionEnum('__taggroup_keydown_delete__')
export const TagGroupKeyDownBackspace: UseTagGroupStateChangeTypes.TagGroupKeyDownBackspace =
  productionEnum('__taggroup_keydown_backspace__')

export const TagRemoveClick: UseTagGroupStateChangeTypes.TagRemoveClick =
  productionEnum('__tagremove_click__')

export const FunctionAddItem: UseTagGroupStateChangeTypes.FunctionAddItem =
  productionEnum('__function_add_item__')
