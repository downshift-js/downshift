import * as PropTypes from 'prop-types'

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
    prevState[key] = props[key] === undefined ? state[key] : props[key]
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
  return function validate(options) {
    Object.entries(propTypes).forEach(([key]) => {
      PropTypes.checkPropTypes(propTypes, options, key, caller.name)
    })
  }
}

export {
  getElementIds,
  getNextWrappingIndex,
  getItemIndexByCharacterKey,
  getState,
  getItemIndex,
  getPropTypesValidator,
  itemToString,
}
