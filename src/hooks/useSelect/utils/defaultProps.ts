import {dropdownDefaultProps} from '../../utils.dropdown'

export const defaultProps = {
  ...dropdownDefaultProps,
  isItemDisabled() {
    return false
  },
}
