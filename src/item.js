import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {AUTOCOMPLETE_CONTEXT, MENU_CONTEXT} from './constants'
import {compose} from './utils'

class Item extends Component {
  static contextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }
  static propTypes = {
    onMouseEnter: PropTypes.func,
    onClick: PropTypes.func,
    ref: PropTypes.func,
    index: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
  }
  constructor(props, context) {
    super(props, context)
    this.menu = this.context[MENU_CONTEXT]
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.handleMouseEnter = compose(
      this.handleMouseEnter,
      this.props.onMouseEnter,
    )
    this.handleClick = compose(this.handleClick, this.props.onClick)
    this.ref = compose(node => (this.node = node), this.props.ref)
  }
  handleMouseEnter = () => {
    this.menu.setHighlightedIndex(this.props.index)
  }
  handleClick = () => {
    this.autocomplete.selectItemAtIndex(this.props.index)
  }
  componentWillMount() {
    this.menu.addItemInstance(this)
  }
  componentWillUnmount() {
    this.menu.removeItemInstance(this)
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
