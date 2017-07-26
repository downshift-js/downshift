import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {AUTOCOMPLETE_CONTEXT} from './constants'
import {compose, moveCursorToTheEnd} from './utils'

class Input extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }
  static ignoreKeys = ['Shift', 'Meta', 'Alt', 'Control']
  static propTypes = {
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onBlur: PropTypes.func,
    getValue: PropTypes.func,
    defaultValue: PropTypes.string,
  }
  static defaultProps = {
    getValue: i => String(i),
  }
  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.autocomplete.input = this
    this.handleChange = compose(this.handleChange, this.props.onChange)
    this.handleKeyDown = compose(this.handleKeyDown, this.props.onKeyDown)
    this.handleBlur = compose(this.handleBlur, this.props.onBlur)
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
      this.autocomplete.selectHighlightedItem()
    },

    Escape(event) {
      event.preventDefault()
      this.autocomplete.reset()
    },
  }

  handleKeyDown = event => {
    if (event.key && this.keyDownHandlers[event.key]) {
      this.keyDownHandlers[event.key].call(this, event)
    } else if (!Input.ignoreKeys.includes(event.key)) {
      this.autocomplete.open()
      this.autocomplete.highlightIndex(null)
    }
  }

  handleChange = event => {
    this.updateInputValue(event.target.value)
  }

  handleBlur = () => {
    if (!this.autocomplete.isMouseDown) {
      this.autocomplete.reset()
    }
  }

  reset = () => {
    moveCursorToTheEnd(this._inputNode)
  }

  focusInput = () => {
    this._inputNode.focus()
  }

  getValue = item => {
    return item ? this.props.getValue(item) : null
  }

  componentWillUnmount() {
    if (this.autocomplete.input === this) {
      this.autocomplete.input = null
    }
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.updateInputValue(this.props.defaultValue)
    }
  }

  updateInputValue(value) {
    if (this.autocomplete.state.inputValue !== value) {
      this.autocomplete.setState({
        inputValue: value,
      })
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {defaultValue, getValue, ...rest} = this.props
    const {inputValue, selectedItem} = this.autocomplete.state
    const selectedItemValue = this.getValue(selectedItem)
    return (
      <input
        value={(inputValue === null ? selectedItemValue : inputValue) || ''}
        {...rest}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleBlur}
        ref={node => (this._inputNode = node)}
      />
    )
  }
}

export default Input
