import {getInitialValue as getInitialValueCommon} from '../utils'

const defaultStateValues = {
  selectedItems: [],
  focusedIndex: -1,
}

function getInitialValue(props, propKey) {
  return getInitialValueCommon(props, propKey, defaultStateValues)
}

function getInitialState(props) {
  const selectedItems = getInitialValue(props, 'selectedItems')
  const focusedIndex = getInitialValue(props, 'focusedIndex')

  return {
    selectedItems,
    focusedIndex,
  }
}

export {getInitialState}
