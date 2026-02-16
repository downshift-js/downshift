import PropTypes from 'prop-types'

// Re-export utils from parent directories
export {
  callAllEventHandlers,
  handleRefs,
  useLatestRef,
  validatePropTypes,
} from '../../../utils'
export {useControlledReducer} from '../../utils'

export {useElementIds} from './useElementIds'
export {getInitialState} from './getInitialState'
export {isStateEqual} from './isStateEqual'
export {
  useAccessibleDescription,
  A11Y_DESCRIPTION_ELEMENT_ID,
} from './useAccessibleDescription'
export {getMergedProps} from './getMergedProps'
export {useRovingTagFocus} from './useRovingTagFocus'

export const propTypes: Record<
  string,
  PropTypes.Requireable<(...args: unknown[]) => unknown>
> = {
  isItemDisabled: PropTypes.func,
}
