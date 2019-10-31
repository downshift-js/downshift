import {defaultProps} from '../utils'

function useCombobox(userProps = {}) {
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }
  props() // bogus
}

export default useCombobox
