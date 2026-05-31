import PropTypes from 'prop-types'
import {dropdownPropTypes} from '../../utils'

export const propTypes = {
  ...dropdownPropTypes,
  items: PropTypes.array.isRequired,
  isItemDisabled: PropTypes.func,
}
