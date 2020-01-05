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
  getMemoizedItemHandlers: PropTypes.func,
}

export {
  getInitialState,
  defaultStateValues,
  propTypes,
  getDefaultValue,
  getItemIndexByCharacterKey,
  defaultPropsCommon as defaultProps,
}
