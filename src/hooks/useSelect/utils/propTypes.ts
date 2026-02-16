import PropTypes from 'prop-types'

import {dropdownPropTypes} from '.'

export const propTypes = {
  ...dropdownPropTypes,
  items: PropTypes.array.isRequired,
  isItemDisabled: PropTypes.func,
}
