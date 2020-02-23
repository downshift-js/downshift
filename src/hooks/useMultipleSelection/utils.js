import PropTypes from 'prop-types'
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

const propTypes = {
  items: PropTypes.array.isRequired,
  onItemRemoved: PropTypes.func,
  itemToString: PropTypes.func,
  getA11yRemovalMessage: PropTypes.func,
  circularNavigation: PropTypes.bool,
  stateReducer: PropTypes.func,
  activeIndex: PropTypes.number,
  onActiveIndexChange: PropTypes.func,
  environment: PropTypes.shape({
    addEventListener: PropTypes.func,
    removeEventListener: PropTypes.func,
    document: PropTypes.shape({
      getElementById: PropTypes.func,
      activeElement: PropTypes.any,
      body: PropTypes.any,
    }),
  }),
}

const defaultProps = {
  itemToString: defaultPropsCommon.itemToString,
  stateReducer: defaultPropsCommon.stateReducer,
}

export {getInitialState, defaultProps, propTypes}
