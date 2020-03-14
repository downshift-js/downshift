import PropTypes from 'prop-types'
import {
  getInitialValue as getInitialValueCommon,
  defaultProps as defaultPropsCommon,
} from '../utils'

const defaultStateValues = {
  activeIndex: -1,
  items: [],
}

function getInitialValue(props, propKey) {
  return getInitialValueCommon(props, propKey, defaultStateValues)
}

export function getInitialState(props) {
  const activeIndex = getInitialValue(props, 'activeIndex')
  const items = getInitialValue(props, 'items')

  return {
    activeIndex,
    items,
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
export function isKeyDownOperationPermitted(event) {
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

export const propTypes = {
  items: PropTypes.array.isRequired,
  onItemRemoved: PropTypes.func,
  itemToString: PropTypes.func,
  getA11yRemovalMessage: PropTypes.func,
  circularNavigation: PropTypes.bool,
  stateReducer: PropTypes.func,
  activeIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any,
    }),
  }),
}

export const defaultProps = {
  itemToString: defaultPropsCommon.itemToString,
  stateReducer: defaultPropsCommon.stateReducer,
}
