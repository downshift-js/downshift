import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {debounce} from './utils'

class MenuStatus extends Component {
  static defaultProps = {
    getA11yStatusMessage({resultCount, highlightedItem, getInputValue}) {
      if (!resultCount) {
        return 'No results.'
      } else if (!highlightedItem) {
        return `${resultCount} ${resultCount === 1 ?
          'result is' :
          'results are'} available, use up and down arrow keys to navigate.`
      }
      return getInputValue(highlightedItem)
    },
  }

  static propTypes = {
    getA11yStatusMessage: PropTypes.func,
    getInputValue: PropTypes.func,
    getItemFromIndex: PropTypes.func,
    highlightedIndex: PropTypes.number,
    inputValue: PropTypes.string,
    resultCount: PropTypes.number,
  }

  constructor(props, context) {
    super(props, context)
    this.updateStatus = debounce(this.updateStatus, 200)
  }
  // have to do this because updateStatus is debounced
  _isMounted = false
  state = {statuses: []}

  updateStatus = (highlightedIndex = this.props.highlightedIndex) => {
    if (!this._isMounted) {
      return
    }
    const {resultCount, getItemFromIndex, getInputValue} = this.props
    const {statuses} = this.state
    const itemInstance = getItemFromIndex(highlightedIndex) || {
      props: {},
    }
    const status = this.props.getA11yStatusMessage({
      resultCount,
      highlightedItem: itemInstance.props.value,
      getInputValue,
    })
    const isSameAsLast = statuses[statuses.length - 1] === status
    if (isSameAsLast) {
      this.setState(({statuses: currentStatuses}) => ({
        statuses: [...currentStatuses, status],
      }))
    } else {
      this.setState({statuses: [status]})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.highlightedIndex !== this.props.highlightedIndex ||
      this.props.inputValue !== nextProps.inputValue
    ) {
      this.updateStatus(nextProps.highlightedIndex)
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.updateStatus()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  renderStatus = (status, index) => {
    return (
      <div
        style={{
          display: index === this.state.statuses.length - 1 ? 'block' : 'none',
        }}
        key={index}
      >
        {status}
      </div>
    )
  }

  render() {
    return (
      <div
        role="status"
        aria-live="assertive"
        aria-relevant="additions text"
        style={{
          border: '0',
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: '0',
          position: 'absolute',
          width: '1px',
        }}
      >
        {this.state.statuses.map(this.renderStatus)}
      </div>
    )
  }
}

export default MenuStatus
