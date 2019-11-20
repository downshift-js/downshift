import PropTypes from 'prop-types'
import {
  getInitialValue as getInitialValueAbstract,
  getDefaultValue as getDefaultValueAbstract,
} from '../utils'

const defaultStateValues = {
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
}

function getDefaultValue(props, propKey) {
  return getDefaultValueAbstract(props, propKey, defaultStateValues)
}

function getInitialValue(props, propKey) {
  return getInitialValueAbstract(props, propKey, defaultStateValues)
}

function getInitialState(props) {
  const selectedItem = getInitialValue(props, 'selectedItem')
  const isOpen = getInitialValue(props, 'isOpen')
  let highlightedIndex

  if (isOpen) {
    highlightedIndex = getInitialValue(props, 'highlightedIndex')
    if (highlightedIndex < 0 && selectedItem) {
      highlightedIndex = props.items.indexOf(selectedItem)
    }
  }

  return {
    highlightedIndex,
    isOpen,
    selectedItem,
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

export {getInitialState, defaultStateValues, propTypes, getDefaultValue}
