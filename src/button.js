import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {AUTOCOMPLETE_CONTEXT} from './constants'
import {compose} from './utils'

class Button extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    disabled: PropTypes.bool,
    onKeyDown: PropTypes.func,
    onClick: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.handleKeyDown = compose(this.handleKeyDown, props.onKeyDown)
    this.handleClick = compose(this.handleClick, props.onClick)
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
      event.preventDefault()
      if (this.autocomplete.state.isOpen) {
        this.autocomplete.selectHighlightedItem()
      } else {
        this.autocomplete.open()
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
    this.autocomplete.toggleMenu()
  }

  focusButton = () => {
    this._buttonNode.focus()
  }

  render() {
    const {disabled, ...rest} = this.props
    const {isOpen} = this.autocomplete.state
    return (
      <button
        role="button"
        tabIndex={disabled ? '' : '0'}
        aria-haspopup={true}
        aria-expanded={isOpen}
        aria-disabled={disabled}
        {...rest}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
        ref={node => (this._buttonNode = node)}
      />
    )
  }
}

export default Button
