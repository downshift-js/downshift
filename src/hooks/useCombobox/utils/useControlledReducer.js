import {useRef, useEffect} from 'react'

import {ControlledPropUpdatedSelectedItem} from '../stateChangeTypes'
import {isControlledProp} from '../../../utils'
import {getState} from '../../utils'
import {useEnhancedReducer, useIsInitialMount} from '.'

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
      !isInitialMount // on first mount we already have the proper inputValue for a initial selected item.
    ) {
      const shouldCallDispatch =
        props.itemToKey(props.selectedItem) !==
        props.itemToKey(previousSelectedItemRef.current)

      if (shouldCallDispatch) {
        dispatch({
          type: ControlledPropUpdatedSelectedItem,
          inputValue: props.itemToString(props.selectedItem),
        })
      }
    }

    previousSelectedItemRef.current =
      state.selectedItem === previousSelectedItemRef.current
        ? props.selectedItem
        : state.selectedItem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItem, props.selectedItem])

  return [getState(state, props), dispatch]
}
