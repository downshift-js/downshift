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
  const highlightedIndex = getInitialValue(props, 'highlightedIndex')
  const isOpen = getInitialValue(props, 'isOpen')
  const inputValue = getInitialValue(props, 'inputValue')

  return {
    highlightedIndex,
    isOpen,
    selectedItem,
    inputValue,
  }
}

export {getElementIds, getInitialState, getDefaultValue}
