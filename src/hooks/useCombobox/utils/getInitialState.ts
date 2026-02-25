import {
  getInitialDropdownState,
  type DropdownState,
  type GetInitialDropdownStateProps,
} from '../../utils.dropdown'

type GetInitialStateProps = GetInitialDropdownStateProps & {
  itemToString: (item: unknown) => string
}

/**
 * Returns the initial state for the combobox.
 *
 * @param props Props from useCombobox.
 * @returns The initial state.
 */
export function getInitialState(props: GetInitialStateProps): DropdownState {
  const initialState = getInitialDropdownState(props)
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
