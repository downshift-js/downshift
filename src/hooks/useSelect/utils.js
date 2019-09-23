import PropTypes from 'prop-types'
import {getNextWrappingIndex, capitalizeString} from '../utils'

const defaultStateValues = {
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
}

function getA11yStatusMessage({isOpen, items}) {
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

function getA11ySelectionMessage({selectedItem, itemToString}) {
  return `${itemToString(selectedItem)} has been selected.`
}

function getHighlightedIndexOnOpen(props, state, offset) {
  const {items, initialHighlightedIndex, defaultHighlightedIndex} = props
  const {selectedItem, highlightedIndex} = state

  // initialHighlightedIndex will give value to highlightedIndex on initial state only.
  if (initialHighlightedIndex !== undefined && highlightedIndex > -1) {
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
      false,
    )
  }
  if (offset === 0) {
    return -1
  }
  return offset < 0 ? items.length - 1 : 0
}

function getDefaultValue(props, propKey) {
  const defaultPropKey = `default${capitalizeString(propKey)}`
  if (props[defaultPropKey] !== undefined) {
    return props[defaultPropKey]
  }
  return defaultStateValues[propKey]
}

function getInitialValue(props, propKey) {
  if (props[propKey] !== undefined) {
    return props[propKey]
  }
  const initialPropKey = `initial${capitalizeString(propKey)}`
  if (props[initialPropKey] !== undefined) {
    return props[initialPropKey]
  }
  return getDefaultValue(props, propKey)
}

function getInitialState(props) {
  return {
    highlightedIndex: getInitialValue(props, 'highlightedIndex'),
    isOpen: getInitialValue(props, 'isOpen'),
    selectedItem: getInitialValue(props, 'selectedItem'),
    keysSoFar: '',
  }
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

export {
  getHighlightedIndexOnOpen,
  getA11yStatusMessage,
  getA11ySelectionMessage,
  getInitialState,
  defaultStateValues,
  propTypes,
  getDefaultValue,
}
