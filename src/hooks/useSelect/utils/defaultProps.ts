import {dropdownDefaultProps} from '../../utils'

export const defaultProps = {
  ...dropdownDefaultProps,
  isItemDisabled() {
    return false
  },
}
