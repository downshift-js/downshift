import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {AUTOCOMPLETE_CONTEXT} from './constants'
import {compose} from './utils'

class Button extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    component: PropTypes.any,
    action: PropTypes.oneOf(['open', 'close', 'toggle', 'clearSelection']),
    onKeyDown: PropTypes.func,
  }

  static defaultProps = {
    component: 'button',
    action: 'toggle',
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.handleKeyDown = compose(this.handleKeyDown, props.onKeyDown)
  }

  actionTypes = {
    open: {
      label: 'open menu',
      action: () => this.autocomplete.openMenu(),
    },
    close: {
      label: 'close menu',
      action: () => this.autocomplete.closeMenu(),
    },
    toggle: {
      label: isOpen => (isOpen ? 'close menu' : 'open menu'),
      action: () => this.autocomplete.toggleMenu(),
    },
    clearSelection: {
      label: 'clear selection',
      action: () => this.autocomplete.clearSelection(),
    },
  }

  keyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()
      const amount = event.shiftKey ? 5 : 1
      this.autocomplete.moveHighlightedIndex(amount)
    },

    ArrowUp(event) {
      event.preventDefault()
      const amount = event.shiftKey ? -5 : -1
      this.autocomplete.moveHighlightedIndex(amount)
    },

    Enter(event) {
      if (this.props.action !== 'clearSelection') {
        event.preventDefault()
        if (this.autocomplete.state.isOpen) {
          this.autocomplete.selectHighlightedItem()
        } else {
          this.autocomplete.openMenu()
        }
      }
    },

    Escape(event) {
      event.preventDefault()
      this.autocomplete.reset()
    },

    ' '(event) {
      event.preventDefault()
      this.autocomplete.toggleMenu()
    },
  }

  handleKeyDown = event => {
    if (event.key && this.keyDownHandlers[event.key]) {
      this.keyDownHandlers[event.key].call(this, event)
    }
  }

  handleClick = event => {
    event.preventDefault()
    this.actionTypes[this.props.action].action()
  }

  render() {
    const {component: ButtonComponent, action, ...rest} = this.props
    const {isOpen} = this.autocomplete.state
    const {label} = this.actionTypes[action]
    return (
      <ButtonComponent
        role="button"
        aria-label={typeof label === 'function' ? label(isOpen) : label}
        aria-expanded={isOpen}
        aria-haspopup={true}
        onClick={this.handleClick}
        {...rest}
        onKeyDown={this.handleKeyDown}
        ref={node => (this._buttonNode = node)}
      />
    )
  }
}

export default Button
