import PropTypes from 'prop-types'

function getItemIndexByCharacterKey(
  keysSoFar,
  highlightedIndex,
  items,
  itemToStringParam,
  getItemNodeFromIndex,
) {
  const lowerCasedItemStrings = items.map(item =>
    itemToStringParam(item).toLowerCase(),
  )
  const lowerCasedKeysSoFar = keysSoFar.toLowerCase()
  const isValid = (itemString, index) => {
    const element = getItemNodeFromIndex(index)

    return (
      itemString.startsWith(lowerCasedKeysSoFar) &&
      !(element && element.hasAttribute('disabled'))
    )
  }

  for (
    let index = highlightedIndex + 1;
    index < lowerCasedItemStrings.length;
    index++
  ) {
    const itemString = lowerCasedItemStrings[index]

    if (isValid(itemString, index)) {
      return index
    }
  }

  for (let index = 0; index < highlightedIndex; index++) {
    const itemString = lowerCasedItemStrings[index]

    if (isValid(itemString, index)) {
      return index
    }
  }

  return highlightedIndex
}

const propTypes = {
  items: PropTypes.array.isRequired,
  itemToString: PropTypes.func,
  getA11yStatusMessage: PropTypes.func,
  getA11ySelectionMessage: PropTypes.func,
  circularNavigation: PropTypes.bool,
  highlightedIndex: PropTypes.number,
  defaultHighlightedIndex: PropTypes.number,
  initialHighlightedIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  defaultIsOpen: PropTypes.bool,
  initialIsOpen: PropTypes.bool,
  selectedItem: PropTypes.any,
  initialSelectedItem: PropTypes.any,
  defaultSelectedItem: PropTypes.any,
  id: PropTypes.string,
  labelId: PropTypes.string,
  menuId: PropTypes.string,
  getItemId: PropTypes.func,
  toggleButtonId: PropTypes.string,
  stateReducer: PropTypes.func,
  onSelectedItemChange: PropTypes.func,
  onHighlightedIndexChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onIsOpenChange: PropTypes.func,
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

export {propTypes, getItemIndexByCharacterKey}
