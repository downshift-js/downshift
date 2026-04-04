import {useRef, useEffect} from 'react'
import {getState} from '../../../utils'
import {
  useIsInitialMount,
  useEnhancedReducer,
  Reducer,
  Props,
} from '../../utils'
import {ControlledPropUpdatedSelectedItem} from '../stateChangeTypes'
import {
  UseComboboxMergedProps,
  UseComboboxState,
  UseComboboxStateChange,
} from '..'

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
  reducer: Reducer<UseComboboxState<Item>, UseComboboxStateChange<Item>>,
  props: UseComboboxMergedProps<Item>,
  createInitialState: (
    props: UseComboboxMergedProps<Item>,
  ) => UseComboboxState<Item>,
  isStateEqual: (
    prev: UseComboboxState<Item>,
    next: UseComboboxState<Item>,
  ) => boolean,
) {
  const previousSelectedItemRef = useRef<Item | null>(null)
  const [state, dispatch] = useEnhancedReducer(
    reducer,
    props,
    // ToDo: improve this cast
    createInitialState as (
      props: Props<UseComboboxState<Item>, UseComboboxStateChange<Item>>,
    ) => UseComboboxState<Item>,
    isStateEqual,
  )
  const isInitialMount = useIsInitialMount()

  useEffect(() => {
    if (props.selectedItem === undefined) {
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
