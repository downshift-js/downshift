import {useEnhancedReducer} from '../utils'

import {getInitialState} from './utils'
import downshiftMultipleSelectionReducer from './reducer'

function useMultipleSelection(userProps = {}) {
  // Props defaults and destructuring.
  const props = {
    // ...defaultProps,
    ...userProps,
  }

  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  // eslint-disable-next-line no-unused-vars
  const [{selectedItems, focusedIndex}, dispatch] = useEnhancedReducer(
    downshiftMultipleSelectionReducer,
    initialState,
    props,
  )

  return {}
}

export default useMultipleSelection
