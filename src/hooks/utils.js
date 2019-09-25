import PropTypes from 'prop-types'
import React from 'react'

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

function getNextWrappingIndex(moveAmount, baseIndex, itemsLength, circular) {
  if (baseIndex === -1) {
    return moveAmount > 0 ? 0 : itemsLength - 1
  }
  const nextIndex = baseIndex + moveAmount

  if (nextIndex < 0) {
    return circular ? itemsLength - 1 : 0
  }
  if (nextIndex >= itemsLength) {
    return circular ? 0 : itemsLength - 1
  }

  return nextIndex
}

function getItemIndexByCharacterKey(
  keysSoFar,
  highlightedIndex,
  items,
  itemToStringParam,
) {
  let newHighlightedIndex = -1
  const itemStrings = items.map(item => itemToStringParam(item).toLowerCase())
  const startPosition = highlightedIndex + 1

  newHighlightedIndex = itemStrings
    .slice(startPosition)
    .findIndex(itemString => itemString.startsWith(keysSoFar))

  if (newHighlightedIndex > -1) {
    return newHighlightedIndex + startPosition
  } else {
    return itemStrings
      .slice(0, startPosition)
      .findIndex(itemString => itemString.startsWith(keysSoFar))
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
  const enhancedReducer = React.useCallback(
    (state, action) => {
      state = getState(state, action.props)

      const {stateReducer} = action.props
      const changes = reducer(state, action)
      const newState = stateReducer(state, {...action, changes})

      callOnChangeProps(action.props, state, newState)

      return newState
    },
    [reducer],
  )

  const [state, dispatch] = React.useReducer(enhancedReducer, initialState)

  return [getState(state, props), dispatch]
}

export {
  getElementIds,
  getNextWrappingIndex,
  getItemIndexByCharacterKey,
  getState,
  getItemIndex,
  getPropTypesValidator,
  itemToString,
  isAcceptedCharacterKey,
  useEnhancedReducer,
  capitalizeString,
}
