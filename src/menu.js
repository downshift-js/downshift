import React, {Component} from 'react'
import PropTypes from 'prop-types'
import mitt from 'mitt'

import MenuStatus from './menu-status'
import {AUTOCOMPLETE_CONTEXT, MENU_CONTEXT} from './constants'
import {cbToCb, compose, scrollIntoView} from './utils'

class Menu extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    ref: PropTypes.func,
    children: PropTypes.func.isRequired,
  }

  static initialState = {
    highlightedIndex: null,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.ref = compose(node => (this.node = node), this.props.ref)
  }

  state = Menu.initialState
  items = []
  emitter = mitt()

  reset = cb => {
    this.setState(Menu.initialState, cbToCb(cb))
  }

  changeHighlighedIndex = moveAmount => {
    const {highlightedIndex} = this.state
    const baseIndex = highlightedIndex === null ? -1 : highlightedIndex
    const itemsLastIndex = this.items.length - 1
    if (itemsLastIndex < 0) {
      return
    }
    let newIndex = baseIndex + moveAmount
    if (newIndex < 0) {
      newIndex = itemsLastIndex
    } else if (newIndex > itemsLastIndex) {
      newIndex = 0
    }
    this.setState({
      highlightedIndex: newIndex,
    })
    this.emitter.emit('changeHighlighedIndex', newIndex)
  }

  setHighlightedIndex = highlightedIndex => {
    this.setState({highlightedIndex})
  }

  getItemFromIndex = index => {
    if (!this.items || !this.items[0]) {
      return null
    }
    return this.items.find(itemInstance => {
      return itemInstance.props.index === index
    })
  }

  maybeScrollToHighlightedElement() {
    const itemInstance = this.getItemFromIndex(this.state.highlightedIndex)
    if (!itemInstance || !itemInstance.node) {
      return
    }
    scrollIntoView(itemInstance.node)
  }

  addItemInstance(itemInstance) {
    this.items.push(itemInstance)
  }

  removeItemInstance(itemInstance) {
    const index = this.items.indexOf(itemInstance)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  getChildContext() {
    return {[MENU_CONTEXT]: this}
  }

  componentDidMount() {
    this.autocomplete.setMenu(this)
  }

  componentDidUpdate() {
    this.maybeScrollToHighlightedElement()
  }

  componentWillUnmount() {
    this.autocomplete.removeMenu(this)
  }
  render() {
    if (!this.autocomplete.state.isOpen) {
      return null
    }
    const {inputValue} = this.autocomplete.state
    const {highlightedIndex} = this.state
    const {children, ...rest} = this.props
    return (
      <div {...rest} ref={this.ref}>
        <div>
          {children(this.autocomplete.getControllerStateAndHelpers())}
        </div>
        <MenuStatus
          highlightedIndex={highlightedIndex}
          inputValue={inputValue}
        />
      </div>
    )
  }
}

export default Menu
