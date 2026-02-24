import PropTypes from 'prop-types'

import {dropdownPropTypes, dropdownDefaultProps} from '../../utils.dropdown'

// Re-exports
export {
  handleRefs,
  normalizeArrowKey,
  callAllEventHandlers,
  validatePropTypes,
  useLatestRef,
  useGetterPropsCalledChecker,
  getNonDisabledIndex,
  getHighlightedIndex,
} from '../../../utils'
export {
  useScrollIntoView,
  useControlPropsValidator,
  getItemAndIndex,
  getInitialValue,
  useIsInitialMount,
  useEnhancedReducer,
  useA11yMessageStatus,
  getDefaultValue,
} from '../../utils'
export {
  dropdownDefaultStateValues,
  useElementIds,
  dropdownDefaultProps,
  getInitialDropdownState,
  useMouseAndTouchTracker,
  isDropdownStateEqual,
  getHighlightedIndexOnOpen,
  getChangesOnSelection,
  getDefaultHighlightedIndex,
} from '../../utils.dropdown'

// Actual exports
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

export {getInitialState} from './getInitialState'
export {useControlledReducer} from './useControlledReducer'