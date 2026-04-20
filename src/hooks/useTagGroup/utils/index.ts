import PropTypes from 'prop-types'

export {useElementIds} from './useElementIds'
export {getInitialState} from './getInitialState'
export {isStateEqual} from './isStateEqual'
export {
  useAccessibleDescription,
  A11Y_DESCRIPTION_ELEMENT_ID,
} from './useAccessibleDescription'
export {getMergedProps} from './getMergedProps'
export {useRovingTagFocus} from './useRovingTagFocus'

export const propTypes = {
  isItemDisabled: PropTypes.func,
}
