import PropTypes from 'prop-types'

// Shared between all exports.
export const propTypes = {
  environment: PropTypes.shape({
    addEventListener: PropTypes.func.isRequired,
    removeEventListener: PropTypes.func.isRequired,
    document: PropTypes.shape({
      createElement: PropTypes.func.isRequired,
      getElementById: PropTypes.func.isRequired,
      activeElement: PropTypes.any.isRequired,
      body: PropTypes.any.isRequired,
    }).isRequired,
    Node: PropTypes.func.isRequired,
  }),
  itemToKey: PropTypes.func,
  stateReducer: PropTypes.func,
}
