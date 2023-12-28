import PropTypes from 'prop-types'
import {
  getInitialValue as getInitialValueCommon,
  getDefaultValue as getDefaultValueCommon,
  defaultProps as defaultPropsCommon,
  commonPropTypes,
} from '../utils'
import {noop} from '../../utils'

const defaultStateValues = {
  activeIndex: -1,
  selectedItems: [],
}

/**
 * Returns the initial value for a state key in the following order:
 * 1. controlled prop, 2. initial prop, 3. default prop, 4. default
 * value from Downshift.
 *
 * @param {Object} props Props passed to the hook.
 * @param {string} propKey Props key to generate the value for.
 * @returns {any} The initial value for that prop.
 */
function getInitialValue(props, propKey) {
  return getInitialValueCommon(props, propKey, defaultStateValues)
}

/**
 * Returns the default value for a state key in the following order:
 * 1. controlled prop, 2. default prop, 3. default value from Downshift.
 *
 * @param {Object} props Props passed to the hook.
 * @param {string} propKey Props key to generate the value for.
 * @returns {any} The initial value for that prop.
 */
function getDefaultValue(props, propKey) {
  return getDefaultValueCommon(props, propKey, defaultStateValues)
}

/**
 * Gets the initial state based on the provided props. It uses initial, default
 * and controlled props related to state in order to compute the initial value.
 *
 * @param {Object} props Props passed to the hook.
 * @returns {Object} The initial state.
 */
function getInitialState(props) {
  const activeIndex = getInitialValue(props, 'activeIndex')
  const selectedItems = getInitialValue(props, 'selectedItems')

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
 * Returns a message to be added to aria-live region when item is removed.
 *
 * @param {Object} selectionParameters Parameters required to build the message.
 * @returns {string} The a11y message.
 */
function getA11yRemovalMessage(selectionParameters) {
  const {removedSelectedItem, itemToString: itemToStringLocal} =
    selectionParameters

  return `${itemToStringLocal(removedSelectedItem)} has been removed.`
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
  ...commonPropTypes,
  selectedItems: PropTypes.array,
  initialSelectedItems: PropTypes.array,
  defaultSelectedItems: PropTypes.array,
  getA11yRemovalMessage: PropTypes.func,
  activeIndex: PropTypes.number,
  initialActiveIndex: PropTypes.number,
  defaultActiveIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func,
  onSelectedItemsChange: PropTypes.func,
  keyNavigationNext: PropTypes.string,
  keyNavigationPrevious: PropTypes.string,
}

export const defaultProps = {
  itemToString: defaultPropsCommon.itemToString,
  stateReducer: defaultPropsCommon.stateReducer,
  environment: defaultPropsCommon.environment,
  getA11yRemovalMessage,
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
  getDefaultValue,
  getInitialState,
  isKeyDownOperationPermitted,
  isStateEqual,
}
