import {useRef, useEffect} from 'react'

import {ControlledPropUpdatedSelectedItem} from '../stateChangeTypes'
import {getState, type Action} from '../../../utils'
import {useEnhancedReducer, useIsInitialMount} from '../../utils'
import {
  type UseComboboxMergedProps,
  type UseComboboxState,
  type UseComboboxStateChangeTypes,
} from '../index.types'

/**
 * The useCombobox version of useControlledReducer, which also
 * checks if the controlled prop selectedItem changed between
 * renders. If so, it will also update inputValue with its
 * string equivalent. It uses the common useEnhancedReducer to
 * compute the rest of the state.
 *
 * @param reducer Reducer function from downshift.
 * @param props The hook props, also passed to createInitialState.
 * @param createInitialState Function that returns the initial state.
 * @param isStateEqual Function that checks if a previous state is equal to the next.
 * @returns An array with the state and an action dispatcher.
 */
export function useControlledReducer<Item>(
  reducer: (
    state: UseComboboxState<Item>,
    props: UseComboboxMergedProps<Item>,
    action: Action<UseComboboxStateChangeTypes>,
  ) => UseComboboxState<Item>,
  props: UseComboboxMergedProps<Item>,
  createInitialState: (
    props: UseComboboxMergedProps<Item>,
  ) => UseComboboxState<Item>,
  isStateEqual: (
    prevState: UseComboboxState<Item>,
    newState: UseComboboxState<Item>,
  ) => boolean,
): [
  UseComboboxState<Item>,
  (action: Action<UseComboboxStateChangeTypes>) => void,
] {
  const previousSelectedItemRef = useRef<Item | null>(null)
  const [state, dispatch] = useEnhancedReducer(
    reducer,
    props,
    createInitialState,
    isStateEqual,
  )
  const isInitialMount = useIsInitialMount()

  useEffect(() => {
    if (props.selectedItem === undefined) {
      return
    }

    // on first mount we already have the proper inputValue for a initial selected item.
    if (!isInitialMount) {
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

    // if the internal state selected item is the same, it means the change came from the outside.
    previousSelectedItemRef.current =
      state.selectedItem === previousSelectedItemRef.current
        ? props.selectedItem
        : state.selectedItem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedItem, props.selectedItem])

  return [
    getState<
      UseComboboxState<Item>,
      UseComboboxMergedProps<Item>,
      UseComboboxStateChangeTypes
    >(state, props),
    dispatch,
  ]
}
