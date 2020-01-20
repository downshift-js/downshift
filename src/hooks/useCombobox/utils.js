import PropTypes from 'prop-types'
import {
  getElementIds as getElementIdsCommon,
  getInitialValue as getInitialValueCommon,
  getDefaultValue as getDefaultValueCommon,
  defaultProps as defaultPropsCommon,
} from '../utils'
import {generateId} from '../../utils'

const defaultStateValues = {
  inputValue: '',
}

function getElementIds({id, inputId, ...rest} = {}) {
  const uniqueId = id === undefined ? `downshift-${generateId()}` : id

  return {
    inputId: inputId || `${uniqueId}-input`,
    ...getElementIdsCommon({id, ...rest}),
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
  let inputValue = getInitialValue(props, 'inputValue')

  if (
    inputValue === '' &&
    selectedItem &&
    props.defaultInputValue === undefined &&
    props.initialInputValue === undefined &&
    props.inputValue === undefined
  ) {
    inputValue = props.itemToString(selectedItem)
  }

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
