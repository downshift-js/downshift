import {
  getInitialValue as getInitialValueCommon,
  defaultProps as defaultPropsCommon,
} from '../utils'

const defaultStateValues = {
  activeIndex: -1,
}

function getInitialValue(props, propKey) {
  return getInitialValueCommon(props, propKey, defaultStateValues)
}

function getInitialState(props) {
  const activeIndex = getInitialValue(props, 'activeIndex')

  return {
    activeIndex,
  }
}

const defaultProps = {
  itemToString: defaultPropsCommon.itemToString,
  stateReducer: defaultPropsCommon.stateReducer,
}

export {getInitialState, defaultProps}
