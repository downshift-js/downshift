import PropTypes from 'prop-types'

import {dropdownPropTypes, dropdownDefaultProps} from '../../utils.dropdown'

export const propTypes = {
  ...dropdownPropTypes,
  items: PropTypes.array.isRequired,
  isItemDisabled: PropTypes.func,
  inputValue: PropTypes.string,
  defaultInputValue: PropTypes.string,
  initialInputValue: PropTypes.string,
  inputId: PropTypes.string,
  onInputValueChange: PropTypes.func,
}

export const defaultProps = {
  ...dropdownDefaultProps,
  isItemDisabled() {
    return false
  },
}

export {getInitialState} from './getInitialState'
export {useControlledReducer} from './useControlledReducer'