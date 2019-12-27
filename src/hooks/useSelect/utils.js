import PropTypes from 'prop-types'
import {
  getInitialValue as getInitialValueCommon,
  getDefaultValue as getDefaultValueCommon,
  defaultProps as defaultPropsCommon,
} from '../utils'

const defaultStateValues = {
  keysSoFar: '',
}

function getDefaultValue(props, propKey) {
  return getDefaultValueCommon(props, propKey, defaultStateValues)
}

function getInitialValue(props, propKey) {
  return getInitialValueCommon(props, propKey, defaultStateValues)
}

function getInitialState(props) {
  const selectedItem = getInitialValue(props, 'selectedItem')
  const isOpen = getInitialValue(props, 'isOpen')
  const highlightedIndex = getInitialValue(props, 'highlightedIndex')

  return {
    highlightedIndex:
      highlightedIndex < 0 && selectedItem
        ? props.items.indexOf(selectedItem)
        : highlightedIndex,
    isOpen,
    selectedItem,
    keysSoFar: '',
  }
}

function getItemIndexByCharacterKey(
  keysSoFar,
  highlightedIndex,
  items,
  itemToStringParam,
  getItemNodeFromIndex,
) {
  let newHighlightedIndex = -1
  const itemStrings = items.map(item => itemToStringParam(item).toLowerCase())
  const startPosition = highlightedIndex + 1
  const isValid = (itemString, index) => {
    const element = getItemNodeFromIndex(index)
    return (
      itemString.startsWith(keysSoFar) &&
      !(element && element.hasAttribute('disabled'))
    )
  }

  newHighlightedIndex = itemStrings
    .slice(startPosition)
    .findIndex((itemString, index) => isValid(itemString, index))

  if (newHighlightedIndex > -1) {
    return newHighlightedIndex + startPosition
  } else {
    return itemStrings
      .slice(0, startPosition)
      .findIndex((itemString, index) => isValid(itemString, index))
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
  getInitialState,
  defaultStateValues,
  propTypes,
  getDefaultValue,
  getItemIndexByCharacterKey,
  defaultPropsCommon as defaultProps,
}
