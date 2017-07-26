import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {MENU_CONTEXT} from './constants'
import {compose} from './utils'

class ItemContainer extends Component {
  static contextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
  }
  static propTypes = {
    ref: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.menu = this.context[MENU_CONTEXT]
    this.ref = compose(node => (this.node = node), this.props.ref)
  }
  componentDidMount() {
    this.menu.itemContainer = this.node
  }
  componentWillUnmount() {
    if (this.menu.itemContainer === this) {
      this.menu.itemContainer = null
    }
  }
  render() {
    return <div {...this.props} ref={this.ref} />
  }
}

export default ItemContainer
