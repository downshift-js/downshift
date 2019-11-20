import {
  getElementIds as getElementIdsAbstract,
  getInitialValue as getInitialValueAbstract,
  getDefaultValue as getDefaultValueAbstract,
} from '../utils'

const defaultStateValues = {
  highlightedIndex: -1,
  isOpen: false,
  selectedItem: null,
  inputValue: '',
}

function getElementIds(generateDefaultId, {id, inputId, ...rest} = {}) {
  const uniqueId = id === undefined ? `downshift-${generateDefaultId()}` : id

  return {
    inputId: inputId || `${uniqueId}-input`,
    ...getElementIdsAbstract(generateDefaultId, {id, ...rest}),
  }
}

function getDefaultValue(props, propKey) {
  return getDefaultValueAbstract(props, propKey, defaultStateValues)
}

function getInitialValue(props, propKey) {
  return getInitialValueAbstract(props, propKey, defaultStateValues)
}

function getInitialState(props) {
  const selectedItem = getInitialValue(props, 'selectedItem')
  const isOpen = getInitialValue(props, 'isOpen')
  let inputValue = getInitialValue(props, 'inputValue')
  let highlightedIndex

  if (isOpen) {
    highlightedIndex = getInitialValue(props, 'highlightedIndex')
    if (highlightedIndex < 0 && selectedItem) {
      highlightedIndex = props.items.indexOf(selectedItem)
    }
  }
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
    highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
}

export {getElementIds, getInitialState, getDefaultValue}
