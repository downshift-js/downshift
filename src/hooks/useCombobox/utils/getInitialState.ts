import {
  getInitialState as getInitialStateCommon,
  GetInitialStateProps as GetInitialStatePropsCommon,
} from '../../utils'

export type GetInitialStateProps<T> = GetInitialStatePropsCommon<T> & {
  itemToString: (item: T) => string
}

export function getInitialState<T>(props: GetInitialStateProps<T>) {
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
