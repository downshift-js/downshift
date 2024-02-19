import {useRef, useEffect} from 'react'
import PropTypes from 'prop-types'
import {
  getA11yStatusMessage,
  isControlledProp,
  getState,
  noop,
} from '../../utils'
import {
  commonDropdownPropTypes,
  defaultProps as defaultPropsCommon,
  getInitialState as getInitialStateCommon,
  useEnhancedReducer,
  useIsInitialMount,
} from '../utils'
import {ControlledPropUpdatedSelectedItem} from './stateChangeTypes'

export function getInitialState(props) {
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
  ...commonDropdownPropTypes,
  items: PropTypes.array.isRequired,
  isItemDisabled: PropTypes.func,
  selectedItemChanged: PropTypes.func,
  getA11ySelectionMessage: PropTypes.func,
  inputValue: PropTypes.string,
  defaultInputValue: PropTypes.string,
  initialInputValue: PropTypes.string,
  inputId: PropTypes.string,
  onInputValueChange: PropTypes.func,
}

/**
 * The useCombobox version of useControlledReducer, which also
 * checks if the controlled prop selectedItem changed between
 * renders. If so, it will also update inputValue with its
 * string equivalent. It uses the common useEnhancedReducer to
 * compute the rest of the state.
 *
 * @param {Function} reducer Reducer function from downshift.
 * @param {Object} props The hook props, also passed to createInitialState.
 * @param {Function} createInitialState Function that returns the initial state.
 * @param {Function} isStateEqual Function that checks if a previous state is equal to the next.
 * @returns {Array} An array with the state and an action dispatcher.
 */
export function useControlledReducer(
  reducer,
  props,
  createInitialState,
  isStateEqual,
) {
  const previousSelectedItemRef = useRef()
  const [state, dispatch] = useEnhancedReducer(
    reducer,
    props,
    createInitialState,
    isStateEqual,
  )
  const isInitialMount = useIsInitialMount()

  useEffect(() => {
    if (!isControlledProp(props, 'selectedItem')) {
      return
    }

    if (
      !isInitialMount && // on first mount we already have the proper inputValue for a initial selected item.
      props.selectedItemChanged(
        previousSelectedItemRef.current,
        props.selectedItem,
      )
    ) {
      dispatch({
        type: ControlledPropUpdatedSelectedItem,
        inputValue: props.itemToString(props.selectedItem),
      })
    }

    previousSelectedItemRef.current =
      state.selectedItem === previousSelectedItemRef.current
        ? props.selectedItem
        : state.selectedItem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItem, props.selectedItem])

  return [getState(state, props), dispatch]
}

// eslint-disable-next-line import/no-mutable-exports
export let validatePropTypes = noop
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  validatePropTypes = (options, caller) => {
    PropTypes.checkPropTypes(propTypes, options, 'prop', caller.name)
  }
}

export const defaultProps = {
  ...defaultPropsCommon,
  selectedItemChanged: (prevItem, item) => prevItem !== item,
  getA11yStatusMessage,
  isItemDisabled() {
    return false
  },
}
