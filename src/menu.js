import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import MenuStatus from './menu-status'
import {AUTOCOMPLETE_CONTEXT, MENU_CONTEXT} from './constants'
import {cbToCb, scrollIntoView} from './utils'

class Menu extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    defaultHighlightedIndex: PropTypes.number,
    getA11yStatusMessage: PropTypes.func,
    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    defaultHighlightedIndex: null,
  }

  static initialState = {
    highlightedIndex: null,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
  }

  state = Menu.initialState
  items = []

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
    this.setState({highlightedIndex: newIndex})
  }

  setHighlightedIndex = highlightedIndex => {
    this.setState({highlightedIndex})
  }

  setDefaultHighlightedIndex = () => {
    if (typeof this.props.defaultHighlightedIndex !== 'undefined') {
      this.setHighlightedIndex(this.props.defaultHighlightedIndex)
    }
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

  createStatus() {
    this._statusNode = document.createElement('div')
    document.body.appendChild(this._statusNode)
  }

  removeStatus() {
    if (this._statusNode) {
      ReactDOM.unmountComponentAtNode(this._statusNode)
      document.body.removeChild(this._statusNode)
      this._statusNode = null
    }
  }

  renderStatus = () => {
    if (this._statusNode) {
      ReactDOM.render(
        <MenuStatus
          getA11yStatusMessage={this.props.getA11yStatusMessage}
          getInputValue={this.autocomplete.getInputValue}
          getItemFromIndex={this.getItemFromIndex}
          highlightedIndex={this.state.highlightedIndex}
          inputValue={this.autocomplete.state.inputValue}
          resultCount={this.items.length}
        />,
        this._statusNode,
      )
    }
  }

  getChildContext() {
    return {[MENU_CONTEXT]: this}
  }

  handleMenuOpen = () => {
    const lastActiveElement = document.activeElement
    this.returnFocus = () => {
      // only return focus if a non-focusable item was selected when closing
      if (document.activeElement === document.body) {
        lastActiveElement.focus()
      }
    }
    this.createStatus()
    this.renderStatus()
    this.setDefaultHighlightedIndex()
  }

  handleMenuClose = () => {
    this.removeStatus()
    this.returnFocus()
  }

  componentDidMount() {
    this.autocomplete.setMenu(this)
    this.autocomplete.emitter.on('menu:open', this.handleMenuOpen)
    this.autocomplete.emitter.on('menu:close', this.handleMenuClose)
  }

  componentDidUpdate() {
    this.maybeScrollToHighlightedElement()
    this.renderStatus()
  }

  componentWillUnmount() {
    this.autocomplete.removeMenu(this)
    this.autocomplete.emitter.off('menu:open', this.handleMenuOpen)
    this.autocomplete.emitter.off('menu:close', this.handleMenuClose)
  }

  render() {
    return this.props.children(this.autocomplete.getControllerStateAndHelpers())
  }
}

export default Menu
