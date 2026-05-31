import PropTypes from 'prop-types'

import {noop} from '../../utils'
import {
  dropdownDefaultProps,
  dropdownPropTypes,
  getInitialValue,
} from '../utils'

export const defaultStateValues = {
  activeIndex: -1,
  selectedItems: [],
}

/**
 * Gets the initial state based on the provided props. It uses initial, default
 * and controlled props related to state in order to compute the initial value.
 *
 * @param {Object} props Props passed to the hook.
 * @returns {Object} The initial state.
 */
function getInitialState(props) {
  const activeIndex = getInitialValue(
    props.activeIndex,
    props.initialActiveIndex,
    props.defaultActiveIndex,
    defaultStateValues.activeIndex,
  )
  const selectedItems = getInitialValue(
    props.selectedItems,
    props.initialSelectedItems,
    props.defaultSelectedItems,
    defaultStateValues.selectedItems,
  )

  return {
    activeIndex,
    selectedItems,
  }
}

/**
 * Returns true if dropdown keydown operation is permitted. Should not be
 * allowed on keydown with modifier keys (ctrl, alt, shift, meta), on
 * input element with text content that is either highlighted or selection
 * cursor is not at the starting position.
 *
 * @param {KeyboardEvent} event The event from keydown.
 * @returns {boolean} Whether the operation is allowed.
 */
function isKeyDownOperationPermitted(event) {
  if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
    return false
  }

  const element = event.target

  if (
    element instanceof HTMLInputElement && // if element is a text input
    element.value !== '' && // and we have text in it
    // and cursor is either not at the start or is currently highlighting text.
    (element.selectionStart !== 0 || element.selectionEnd !== 0)
  ) {
    return false
  }

  return true
}

/**
 * Check if a state is equal for taglist, by comparing active index and selected items.
 * Used by useSelect and useCombobox.
 *
 * @param {Object} prevState
 * @param {Object} newState
 * @returns {boolean} Wheather the states are deeply equal.
 */
function isStateEqual(prevState, newState) {
  return (
    prevState.selectedItems === newState.selectedItems &&
    prevState.activeIndex === newState.activeIndex
  )
}

const propTypes = {
  stateReducer: dropdownPropTypes.stateReducer,
  itemToKey: dropdownPropTypes.itemToKey,
  environment: dropdownPropTypes.environment,
  selectedItems: PropTypes.array,
  initialSelectedItems: PropTypes.array,
  defaultSelectedItems: PropTypes.array,
  getA11yStatusMessage: PropTypes.func,
  activeIndex: PropTypes.number,
  initialActiveIndex: PropTypes.number,
  defaultActiveIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func,
  onSelectedItemsChange: PropTypes.func,
  keyNavigationNext: PropTypes.string,
  keyNavigationPrevious: PropTypes.string,
}

export const defaultProps = {
  itemToKey: dropdownDefaultProps.itemToKey,
  stateReducer: dropdownDefaultProps.stateReducer,
  environment: dropdownDefaultProps.environment,
  keyNavigationNext: 'ArrowRight',
  keyNavigationPrevious: 'ArrowLeft',
}

// eslint-disable-next-line import/no-mutable-exports
let validatePropTypes = noop
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validatePropTypes = (options, caller) => {
    PropTypes.checkPropTypes(propTypes, options, 'prop', caller.name)
  }
}

export {
  validatePropTypes,
  getInitialState,
  isKeyDownOperationPermitted,
  isStateEqual,
}
