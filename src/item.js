import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {AUTOCOMPLETE_CONTEXT} from './constants'
import {compose} from './utils'

class Item extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    component: PropTypes.any,
    index: PropTypes.number.isRequired,
    innerRef: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onClick: PropTypes.func,
    value: PropTypes.any.isRequired,
  }

  static defaultProps = {
    component: 'div',
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.handleClick = compose(this.handleClick, props.onClick)
    this.handleMouseEnter = compose(this.handleMouseEnter, props.onMouseEnter)
    this.ref = node => {
      this.node = node
      if (typeof props.innerRef === 'function') {
        props.innerRef(node)
      }
    }
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
    const {component: ItemComponent, index, value, ...rest} = this.props
    return (
      <ItemComponent
        {...rest}
        ref={this.ref}
        onMouseEnter={this.handleMouseEnter}
        onClick={this.handleClick}
      />
    )
  }
}

export default Item
