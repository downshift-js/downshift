import React, {Component} from 'react'
import PropTypes from 'prop-types'

import AUTOCOMPLETE_CONTEXT from './context'
import {compose} from './utils'

class Item extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    index: PropTypes.number.isRequired,
    onMouseEnter: PropTypes.func,
    onClick: PropTypes.func,
    ref: PropTypes.func,
    value: PropTypes.any.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.handleClick = compose(this.handleClick, props.onClick)
    this.handleMouseEnter = compose(this.handleMouseEnter, props.onMouseEnter)
    this.ref = compose(node => (this.node = node), props.ref)
  }

  handleMouseEnter = () => {
    this.autocomplete.setHighlightedIndex(this.props.index)
  }

  handleClick = () => {
    this.autocomplete.selectItemAtIndex(this.props.index)
  }

  componentWillMount() {
    this.autocomplete.addItemInstance(this)
  }

  componentWillUnmount() {
    this.autocomplete.removeItemInstance(this)
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {index, value, ...rest} = this.props
    return (
      <div
        {...rest}
        ref={this.ref}
        onMouseEnter={this.handleMouseEnter}
        onClick={this.handleClick}
      />
    )
  }
}

export default Item
