import PropTypes from 'prop-types'
import {generateId} from '../../utils'
import {
  getInitialValue as getInitialValueCommon,
  getDefaultValue as getDefaultValueCommon,
  defaultProps as defaultPropsCommon,
} from '../utils'

const defaultStateValues = {
  inputValue: '',
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
}

function getElementIds({
  id,
  labelId,
  menuId,
  getItemId,
  toggleButtonId,
  inputId,
} = {}) {
  const uniqueId = id || `downshift-${generateId()}`

  return {
    labelId: labelId || `${uniqueId}-label`,
    menuId: menuId || `${uniqueId}-menu`,
    getItemId: getItemId || (index => `${uniqueId}-item-${index}`),
    toggleButtonId: toggleButtonId || `${uniqueId}-toggle-button`,
    inputId: inputId || `${uniqueId}-input`,
  }
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
  inputValue: PropTypes.string,
  defaultInputValue: PropTypes.string,
  initialInputValue: PropTypes.string,
  id: PropTypes.string,
  labelId: PropTypes.string,
  menuId: PropTypes.string,
  getItemId: PropTypes.func,
  inputId: PropTypes.string,
  toggleButtonId: PropTypes.string,
  stateReducer: PropTypes.func,
  onSelectedItemChange: PropTypes.func,
  onHighlightedIndexChange: PropTypes.func,
  onStateChange: PropTypes.func,
  onIsOpenChange: PropTypes.func,
  onInputValueChange: PropTypes.func,
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

const defaultProps = {
  ...defaultPropsCommon,
  circularNavigation: true,
}

export {
  getElementIds,
  getInitialState,
  defaultStateValues,
  propTypes,
  getDefaultValue,
  defaultProps,
}
