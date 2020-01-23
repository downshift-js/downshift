import PropTypes from 'prop-types'
import {generateId, getA11yStatusMessage} from '../../utils'
import {
  getElementIds as getElementIdsCommon,
  defaultProps as defaultPropsCommon,
  getInitialState as getInitialStateCommon,
} from '../utils'

function getElementIds({id, inputId, ...rest}) {
  const uniqueId = id === undefined ? `downshift-${generateId()}` : id

  return {
    inputId: inputId || `${uniqueId}-input`,
    ...getElementIdsCommon({id, ...rest}),
  }
}

function getInitialState(props) {
  const initialState = getInitialStateCommon(props)
  const {selectedItem} = initialState
  let {inputValue} = initialState

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
    ...initialState,
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
  getA11yStatusMessage,
  circularNavigation: true,
}

export {getInitialState, propTypes, defaultProps, getElementIds}
