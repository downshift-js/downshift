import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {AUTOCOMPLETE_CONTEXT} from './constants'
import {compose} from './utils'

class Input extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static ignoreKeys = ['Shift', 'Meta', 'Alt', 'Control']

  static propTypes = {
    component: PropTypes.any,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    defaultValue: PropTypes.string,
  }

  static defaultProps = {
    component: 'input',
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.autocomplete.input = this
    this.handleChange = compose(this.handleChange, props.onChange)
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
      this.autocomplete.openMenu(() => {
        this.autocomplete.highlightIndex()
      })
    }
  }

  handleChange = event => {
    this.updateAutocompleteValue(event.target.value)
  }

  focusInput = () => {
    this._inputNode.focus()
  }

  componentWillUnmount() {
    if (this.autocomplete.input === this) {
      this.autocomplete.input = null
    }
  }

  componentDidMount() {
    if (this.props.defaultValue) {
      this.updateAutocompleteValue(this.props.defaultValue)
    }
  }

  updateAutocompleteValue(value) {
    this.autocomplete.setState(currState => {
      if (currState.value !== value) {
        return {value}
      }
      return {}
    })
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {component: InputComponent, defaultValue, ...rest} = this.props
    const {value, selectedItem, isOpen} = this.autocomplete.state
    const selectedItemValue = this.autocomplete.getValue(selectedItem)
    return (
      <InputComponent
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        autoComplete="off"
        value={(value === null ? selectedItemValue : value) || ''}
        {...rest}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        ref={node => (this._inputNode = node)}
      />
    )
  }
}

export default Input
