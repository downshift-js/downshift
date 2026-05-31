import PropTypes from 'prop-types'
import {dropdownPropTypes} from '../../utils'

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
