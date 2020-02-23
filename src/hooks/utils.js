import PropTypes from 'prop-types'
import {useCallback, useReducer, useRef, useEffect} from 'react'
import {
  scrollIntoView,
  getNextWrappingIndex,
  getState,
  generateId,
} from '../utils'

const defaultStateValues = {
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
  inputValue: '',
}

function getElementIds({id, labelId, menuId, getItemId, toggleButtonId}) {
  const uniqueId = id === undefined ? `downshift-${generateId()}` : id

  return {
    labelId: labelId || `${uniqueId}-label`,
    menuId: menuId || `${uniqueId}-menu`,
    getItemId: getItemId || (index => `${uniqueId}-item-${index}`),
    toggleButtonId: toggleButtonId || `${uniqueId}-toggle-button`,
  }
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
  const prevState = useRef()
  const enhancedReducer = useCallback(
    (state, action) => {
      state = getState(state, action.props)
      prevState.current = state

      const {stateReducer: stateReduceLocal} = action.props
      const changes = reducer(state, action)
      const newState = stateReduceLocal(state, {...action, changes})

      return newState
    },
    [reducer],
  )
  const [state, dispatch] = useReducer(enhancedReducer, initialState)
  const dispatchWithProps = action => dispatch({props, ...action})

  useEffect(() => {
    if (prevState.current) {
      callOnChangeProps(props, prevState.current, state)
    }
  })

  return [getState(state, props), dispatchWithProps]
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
  getA11ySelectionMessage,
  scrollIntoView,
  circularNavigation: false,
  environment:
    typeof window === 'undefined' /* istanbul ignore next (ssr) */
      ? {}
      : window,
}

function getDefaultValue(props, propKey) {
  const defaultPropKey = `default${capitalizeString(propKey)}`

  if (defaultPropKey in props) {
    return props[defaultPropKey]
  }

  return defaultStateValues[propKey]
}

function getInitialValue(props, propKey) {
  if (propKey in props) {
    return props[propKey]
  }

  const initialPropKey = `initial${capitalizeString(propKey)}`

  if (initialPropKey in props) {
    return props[initialPropKey]
  }
  return getDefaultValue(props, propKey)
}

function getInitialState(props) {
  const selectedItem = getInitialValue(props, 'selectedItem')
  const isOpen = getInitialValue(props, 'isOpen')
  const highlightedIndex = getInitialValue(props, 'highlightedIndex')
  const inputValue = getInitialValue(props, 'inputValue')

  return {
    highlightedIndex:
      highlightedIndex < 0 && selectedItem
        ? props.items.indexOf(selectedItem)
        : highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
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
  getItemIndex,
  getPropTypesValidator,
  isAcceptedCharacterKey,
  useEnhancedReducer,
  capitalizeString,
  defaultProps,
  getDefaultValue,
  getInitialValue,
  getHighlightedIndexOnOpen,
  defaultStateValues,
  getInitialState,
}
