import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {MENU_CONTEXT} from './constants'
import {debounce} from './utils'

class MenuStatus extends Component {
  static contextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
  }

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
    highlightedIndex: PropTypes.number,
    inputValue: PropTypes.string,
    getA11yStatusMessage: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.menu = this.context[MENU_CONTEXT]
    this.updateStatus = debounce(this.updateStatus, 200)
  }
  // have to do this because updateStatus is debounced
  _isMounted = false
  state = {statuses: []}

  updateStatus = (highlightedIndex = this.props.highlightedIndex) => {
    if (!this._isMounted) {
      return
    }
    const {
      items = [],
      getItemFromIndex,
      autocomplete: {getInputValue},
    } = this.menu
    const {statuses} = this.state
    const resultCount = items.length
    const itemInstance = getItemFromIndex(highlightedIndex) || {
      props: {},
    }
    const status = this.props.getA11yStatusMessage({
      resultCount,
      highlightedItem: itemInstance.props.item,
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
    this.cleanup = this.menu.addItemsChangedListener(this.updateStatus)
    this.updateStatus()
  }

  componentWillUnmount() {
    this._isMounted = false
    this.cleanup()
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
