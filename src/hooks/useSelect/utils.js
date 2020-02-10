import PropTypes from 'prop-types'
import {defaultProps as commonDefaultProps} from '../utils'

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

/**
 * Default implementation for status message. Only added when menu is open.
 * Will specift if there are results in the list, and if so, how many,
 * and what keys are relevant.
 *
 * @param {Object} param the downshift state and other relevant properties
 * @return {String} the a11y status message
 */
function getA11yStatusMessage({isOpen, resultCount}) {
  if (!isOpen) {
    return ''
  }

  if (!resultCount) {
    return 'No results are available.'
  }

  return `${resultCount} result${
    resultCount === 1 ? ' is' : 's are'
  } available, use up and down arrow keys to navigate. Press Enter or Space Bar keys to select.`
}

const defaultProps = {
  ...commonDefaultProps,
  getA11yStatusMessage,
}

export {propTypes, getItemIndexByCharacterKey, defaultProps}
