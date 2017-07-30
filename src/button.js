import React, {Component} from 'react'
import PropTypes from 'prop-types'

import AUTOCOMPLETE_CONTEXT from './context'
import {compose} from './utils'

class Button extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    onKeyDown: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.handleKeyDown = compose(this.handleKeyDown, props.onKeyDown)
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
        this.autocomplete.openMenu()
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

  render() {
    const {isOpen} = this.autocomplete.state
    return (
      <button
        role="button"
        aria-label={isOpen ? 'close menu' : 'open menu'}
        aria-expanded={isOpen}
        aria-haspopup={true}
        onClick={this.handleClick}
        {...this.props}
        onKeyDown={this.handleKeyDown}
        ref={node => (this._buttonNode = node)}
      />
    )
  }
}

export default Button
