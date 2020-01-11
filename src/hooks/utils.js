import PropTypes from 'prop-types'
import {useState, useEffect, useCallback, useReducer} from 'react'
import {scrollIntoView, getNextWrappingIndex} from '../utils'

const defaultStateValues = {
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
}

function getElementIds(
  generateDefaultId,
  {id, labelId, menuId, getItemId, toggleButtonId} = {},
) {
  const uniqueId = id === undefined ? `downshift-${generateDefaultId()}` : id

  return {
    labelId: labelId || `${uniqueId}-label`,
    menuId: menuId || `${uniqueId}-menu`,
    getItemId: getItemId || (index => `${uniqueId}-item-${index}`),
    toggleButtonId: toggleButtonId || `${uniqueId}-toggle-button`,
  }
}

function getState(state, props) {
  return Object.keys(state).reduce((prevState, key) => {
    // eslint-disable-next-line no-param-reassign
    prevState[key] = key in props ? props[key] : state[key]
    return prevState
  }, {})
}

function getItemIndex(index, item, items) {
  if (index !== undefined) {
    return index
  }
  if (items.length === 0) {
    return -1
  }
  return items.indexOf(item)
}

function itemToString(item) {
  return item ? String(item) : ''
}

function getPropTypesValidator(caller, propTypes) {
  // istanbul ignore next
  return function validate(options = {}) {
    Object.entries(propTypes).forEach(([key]) => {
      PropTypes.checkPropTypes(propTypes, options, key, caller.name)
    })
  }
}

function isAcceptedCharacterKey(key) {
  return /^\S{1}$/.test(key)
}

function capitalizeString(string) {
  return `${string.slice(0, 1).toUpperCase()}${string.slice(1)}`
}

function invokeOnChangeHandler(propKey, props, state, changes) {
  const handler = `on${capitalizeString(propKey)}Change`
  if (
    props[handler] &&
    changes[propKey] !== undefined &&
    changes[propKey] !== state[propKey]
  ) {
    props[handler](changes)
  }
}

function callOnChangeProps(props, state, changes) {
  Object.keys(state).forEach(stateKey => {
    invokeOnChangeHandler(stateKey, props, state, changes)
  })

  if (props.onStateChange && changes !== undefined) {
    props.onStateChange(changes)
  }
}

function useEnhancedReducer(reducer, initialState, props) {
  const enhancedReducer = useCallback(
    (state, action) => {
      state = getState(state, action.props)

      const {stateReducer: stateReduceLocal} = action.props
      const changes = reducer(state, action)
      const newState = stateReduceLocal(state, {...action, changes})

      callOnChangeProps(action.props, state, newState)

      return newState
    },
    [reducer],
  )

  const [state, dispatch] = useReducer(enhancedReducer, initialState)

  return [getState(state, props), dispatch]
}

let lastId = 0
// istanbul ignore next
const genId = () => ++lastId

/**
 * Autogenerate IDs to facilitate WAI-ARIA and server rendering.
 * Taken from @reach/auto-id
 * @see https://github.com/reach/reach-ui/blob/6e9dbcf716d5c9a3420e062e5bac1ac4671d01cb/packages/auto-id/src/index.js
 */
// istanbul ignore next
function useId() {
  const [id, setId] = useState(null)

  useEffect(() => setId(genId()), [])

  return id
}

/**
 * Checks if nextElement receives focus after the blur event.
 *
 * @param {FocusEvent} event The blur event.
 * @param {Element} nextElement The element to check that receive focus next.
 * @returns {boolean} If the focus lands on nextElement.
 */
function focusLandsOnElement(event, nextElement) {
  return (
    !!nextElement &&
    (event.relatedTarget === nextElement ||
      // https://github.com/downshift-js/downshift/issues/832 - workaround for Firefox.
      (event.nativeEvent &&
        (nextElement === event.nativeEvent.explicitOriginalTarget ||
          nextElement.contains(event.nativeEvent.explicitOriginalTarget))))
  )
}
/**
 * Default state reducer that returns the changes.
 *
 * @param {Object} s state.
 * @param {Object} a action with changes.
 * @returns {Object} changes.
 */
function stateReducer(s, a) {
  return a.changes
}

/**
 * Returns a message to be added to aria-live region when dropdown is open.
 *
 * @param {*} selectionParameters Parameters required to build the message.
 * @returns {string} The a11y message.
 */
function getA11yStatusMessage(selectionParameters) {
  const {isOpen, items} = selectionParameters

  if (!items) {
    return ''
  }

  const resultCount = items.length
  if (isOpen) {
    if (resultCount === 0) {
      return 'No results are available'
    }
    return `${resultCount} result${
      resultCount === 1 ? ' is' : 's are'
    } available, use up and down arrow keys to navigate. Press Enter key to select.`
  }

  return ''
}

/**
 * Returns a message to be added to aria-live region when item is selected.
 *
 * @param {Object} selectionParameters Parameters required to build the message.
 * @returns {string} The a11y message.
 */
function getA11ySelectionMessage(selectionParameters) {
  const {selectedItem, itemToString: itemToStringLocal} = selectionParameters

  return `${itemToStringLocal(selectedItem)} has been selected.`
}

const defaultProps = {
  itemToString,
  stateReducer,
  getA11yStatusMessage,
  getA11ySelectionMessage,
  scrollIntoView,
  circularNavigation: false,
  environment:
    typeof window === 'undefined' /* istanbul ignore next (ssr) */
      ? {}
      : window,
}

function getDefaultValue(props, propKey, defaultStateValuesLocal) {
  const defaultPropKey = `default${capitalizeString(propKey)}`
  if (defaultPropKey in props) {
    return props[defaultPropKey]
  }
  return {...defaultStateValues, ...defaultStateValuesLocal}[propKey]
}

function getInitialValue(props, propKey, defaultStateValuesLocal) {
  if (propKey in props) {
    return props[propKey]
  }
  const initialPropKey = `initial${capitalizeString(propKey)}`
  if (initialPropKey in props) {
    return props[initialPropKey]
  }
  return getDefaultValue(props, propKey, defaultStateValuesLocal)
}

function getHighlightedIndexOnOpen(props, state, offset, getItemNodeFromIndex) {
  const {items, initialHighlightedIndex, defaultHighlightedIndex} = props
  const {selectedItem, highlightedIndex} = state

  // initialHighlightedIndex will give value to highlightedIndex on initial state only.
  if (
    initialHighlightedIndex !== undefined &&
    highlightedIndex === initialHighlightedIndex
  ) {
    return initialHighlightedIndex
  }
  if (defaultHighlightedIndex !== undefined) {
    return defaultHighlightedIndex
  }
  if (selectedItem) {
    if (offset === 0) {
      return items.indexOf(selectedItem)
    }
    return getNextWrappingIndex(
      offset,
      items.indexOf(selectedItem),
      items.length,
      getItemNodeFromIndex,
      false,
    )
  }
  if (offset === 0) {
    return -1
  }
  return offset < 0 ? items.length - 1 : 0
}

export {
  getElementIds,
  getState,
  getItemIndex,
  getPropTypesValidator,
  isAcceptedCharacterKey,
  useEnhancedReducer,
  capitalizeString,
  useId,
  focusLandsOnElement,
  defaultProps,
  getDefaultValue,
  getInitialValue,
  getHighlightedIndexOnOpen,
  defaultStateValues,
}
