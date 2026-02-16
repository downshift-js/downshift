import PropTypes from 'prop-types'

import {
  propTypes as dropdownPropTypes,
  defaultProps as dropdownDefaultProps,
} from '../../utils.dropdown'

export {getInitialState} from './getInitialState'
export {useControlledReducer} from './useControlledReducer'

export {
  handleRefs,
  normalizeArrowKey,
  callAllEventHandlers,
  validatePropTypes,
  useLatestRef,
  useGetterPropsCalledChecker,
  getNonDisabledIndex,
  getHighlightedIndex
} from '../../../utils'
export {
  useScrollIntoView,
  useControlPropsValidator,
  isDropdownsStateEqual,
  getItemAndIndex,
  getInitialValue,
  useIsInitialMount,
  useEnhancedReducer,
  useA11yMessageStatus,
  getDefaultValue,
} from '../../utils'

export {
  defaultStateValues,
  useElementIds,
  useMouseAndTouchTracker,
} from '../../utils.dropdown'

export const propTypes = {
  ...dropdownPropTypes,
  items: PropTypes.array.isRequired,
  isItemDisabled: PropTypes.func,
  inputValue: PropTypes.string,
  defaultInputValue: PropTypes.string,
  initialInputValue: PropTypes.string,
  inputId: PropTypes.string,
  onInputValueChange: PropTypes.func,
}

export const defaultProps = {
  ...dropdownDefaultProps,
  isItemDisabled() {
    return false
  },
}
