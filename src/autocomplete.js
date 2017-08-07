/* eslint camelcase:0 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import setA11yStatus from './set-a11y-status'
import {
  cbToCb,
  composeEventHandlers,
  debounce,
  scrollIntoView,
  generateId,
} from './utils'

class Autocomplete extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    defaultHighlightedIndex: PropTypes.number,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    getA11yStatusMessage: PropTypes.func,
    getValue: PropTypes.func,
    multiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onStateChange: PropTypes.func,
    onClick: PropTypes.func,
    // things we keep in state for uncontrolled components
    // but can accept as props for controlled components
    /* eslint-disable react/no-unused-prop-types */
    selectedValue: PropTypes.string,
    isOpen: PropTypes.bool,
    inputValue: PropTypes.string,
    highlightedIndex: PropTypes.number,
    /* eslint-enable */
  }

  static defaultProps = {
    defaultHighlightedIndex: null,
    defaultValue: null,
    // eslint-disable-next-line complexity
    getA11yStatusMessage({
      isOpen,
      highlightedValue,
      selectedValue,
      resultCount,
      previousResultCount,
      getValue,
    }) {
      if (!isOpen) {
        if (selectedValue) {
          return getValue(selectedValue)
        } else {
          return ''
        }
      }
      const resultCountChanged = resultCount !== previousResultCount
      if (!resultCount) {
        return 'No results.'
      } else if (!highlightedValue || resultCountChanged) {
        return `${resultCount} ${resultCount === 1 ?
          'result is' :
          'results are'} available, use up and down arrow keys to navigate.`
      }
      return getValue(highlightedValue)
    },
    getValue: i => String(i),
    onStateChange: () => {},
  }

  // this is an experimental feature
  // so we're not going to document this yet
  static stateChangeTypes = {
    mouseUp: '__autocomplete_mouseup__',
  }

  constructor(...args) {
    super(...args)
    this.id = generateId()
    this.inputId = `${this.id}-input`
    this.state = {
      highlightedIndex: null,
      inputValue: '',
      isOpen: false,
      selectedValue: this.props.defaultValue || (this.props.multiple ? [] : ''),
    }
    this.root_handleClick = composeEventHandlers(
      this.props.onClick,
      this.root_handleClick,
    )
  }

  input = null
  items = []
  previousResultCount = 0

  /**
   * Gets the state based on internal state or props
   * If a state value is passed via props, then that
   * is the value given, otherwise it's retrieved from
   * stateToMerge
   *
   * This will perform a shallow merge of the given state object
   * with the state coming from props
   * (for the controlled component scenario)
   * This is used in state updater functions so they're referencing
   * the right state regardless of where it comes from.
   *
   * @param {Object} stateToMerge defaults to this.state
   * @return {Object} the state
   */
  getState(stateToMerge = this.state) {
    return Object.keys(stateToMerge).reduce((state, key) => {
      state[key] =
        this.props[key] === undefined ? this.state[key] : this.props[key]
      return state
    }, {})
  }

  getItemFromValue = (value, items = this.items) => {
    return value.constructor === Array ?
      items.filter(item => value.indexOf(this.getValue(item)) > -1) :
      items.find(item => this.getValue(item) === value)
  }

  getItemFromIndex = index => {
    if (!this.items || !this.items[0]) {
      return null
    }
    return this.items.find(item => {
      return item.index === index
    })
  }

  getIndexFromValue = itemValue => {
    const item = this.items.find(({value}) => value === itemValue)
    return item ? item.index : null
  }

  getItemNodeFromIndex = index => {
    return document.getElementById(this.getItemId(index))
  }

  maybeScrollToHighlightedElement(highlightedIndex, alignToTop) {
    const node = this.getItemNodeFromIndex(highlightedIndex)
    const rootNode = this._rootNode
    scrollIntoView(node, rootNode, alignToTop)
  }

  setHighlightedIndex = (
    highlightedIndex = this.props.defaultHighlightedIndex,
  ) => {
    this.internalSetState({highlightedIndex}, () => {
      this.maybeScrollToHighlightedElement(highlightedIndex)
    })
  }

  highlightSelectedItem = () => {
    const highlightedIndex =
      this.getIndexFromValue(this.getState().selectedValue) || 0
    this.internalSetState({highlightedIndex}, () => {
      this.maybeScrollToHighlightedElement(highlightedIndex, true)
    })
  }

  highlightIndex = index => {
    this.openMenu(() => {
      this.setHighlightedIndex(index)
    })
  }

  moveHighlightedIndex = amount => {
    if (this.getState().isOpen) {
      this.changeHighlighedIndex(amount)
    } else {
      this.highlightIndex()
    }
  }

  // eslint-disable-next-line complexity
  changeHighlighedIndex = moveAmount => {
    const itemsLastIndex = this.items.length - 1
    if (itemsLastIndex < 0) {
      return
    }
    const {highlightedIndex} = this.getState()
    let baseIndex = highlightedIndex
    if (baseIndex === null) {
      baseIndex = moveAmount > 0 ? -1 : itemsLastIndex + 1
    }
    let newIndex = baseIndex + moveAmount
    if (newIndex < 0) {
      newIndex = itemsLastIndex
    } else if (newIndex > itemsLastIndex) {
      newIndex = 0
    }
    this.setHighlightedIndex(newIndex)
  }

  clearSelection = () => {
    this.internalSetState(
      {
        selectedValue: this.multiple ? [] : '',
        isOpen: false,
      },
      () => {
        const inputNode = document.getElementById(this.inputId)
        inputNode && inputNode.focus && inputNode.focus()
      },
    )
  }

  selectItem = itemValue => {
    const value = this.getValue(itemValue)
    if (!this.props.multiple) {
      this.reset()
    }
    this.internalSetState(({selectedValue: previousValue}) => {
      if (this.props.multiple) {
        const values = [...previousValue]
        const pos = values.indexOf(value)
        if (pos > -1) {
          values.splice(pos, 1)
        } else {
          values.push(value)
        }
        return {
          selectedValue: values,
          inputValue: values.join(', '),
        }
      } else {
        return {
          selectedValue: value,
          inputValue: value,
        }
      }
    })
  }

  selectItemAtIndex = itemIndex => {
    if (itemIndex === null) {
      // no item highlighted
      return
    }
    const item = this.getItemFromIndex(itemIndex)
    if (!item) {
      return
    }
    this.selectItem(item.value)
  }

  selectHighlightedItem = () => {
    return this.selectItemAtIndex(this.getState().highlightedIndex)
  }

  // any piece of our state can live in two places:
  // 1. Uncontrolled: it's internal (this.state)
  //    We will call this.setState to update that state
  // 2. Controlled: it's external (this.props)
  //    We will call this.props.onChange to update that state
  //
  // In addition, we'll always call this.props.onChange if the
  // selectedValue is changed because that's important whether
  // that property is controlled or not.
  internalSetState(stateToSet, cb) {
    const onChangeArg = {}
    let onStateChangeArg
    return this.setState(
      state => {
        state = this.getState(state)
        onStateChangeArg =
          typeof stateToSet === 'function' ? stateToSet(state) : stateToSet
        const nextState = {}
        // we need to call on change if the outside world is controlling any of our state
        // and we're trying to update that state. OR if the selection has changed and we're
        // trying to update the selection
        if (onStateChangeArg.hasOwnProperty('selectedValue')) {
          onChangeArg.selectedValue = onStateChangeArg.selectedValue
          onChangeArg.previousValue = state.selectedValue
        }
        Object.keys(onStateChangeArg).forEach(key => {
          // the type is useful for the onStateChangeArg
          // but we don't actually want to set it in internal state.
          // this is an undocumented feature for now... Not all internalSetState
          // calls support it and I'm not certain we want them to yet.
          // But it enables users controlling the isOpen state to know when
          // the isOpen state changes due to mouseup events which is quite handy.
          if (key === 'type') {
            return
          }
          // if it's coming from props, then we don't want to set it internally
          if (!this.props.hasOwnProperty(key)) {
            nextState[key] = onStateChangeArg[key]
          }
        })
        return nextState
      },
      () => {
        // call the provided callback if it's a callback
        cbToCb(cb)()
        // We call this function whether we're controlled or not
        // It's mostly useful if we're controlled, but it can
        // definitely be useful for folks to know when something
        // happens internally.
        this.props.onStateChange(onStateChangeArg)
        // if the selectedValue changed
        // then let's call onChange!
        if (Object.keys(onChangeArg).length) {
          this.props.onChange(onChangeArg)
        }
      },
    )
  }

  getControllerStateAndHelpers() {
    const {
      highlightedIndex,
      inputValue,
      isOpen,
      selectedValue,
    } = this.getState()
    const {
      getRootProps,
      getButtonProps,
      getLabelProps,
      getInputProps,
      getItemProps,
      getItemFromIndex,
      getItemFromValue,
      openMenu,
      closeMenu,
      toggleMenu,
      selectItem,
      selectItemAtIndex,
      selectHighlightedItem,
      setHighlightedIndex,
      clearSelection,
    } = this
    return {
      // getters
      getRootProps,
      getButtonProps,
      getLabelProps,
      getInputProps,
      getItemProps,
      getItemFromIndex,
      getItemFromValue,

      // actions
      openMenu,
      closeMenu,
      toggleMenu,
      selectItem,
      selectItemAtIndex,
      selectHighlightedItem,
      setHighlightedIndex,
      clearSelection,

      // state
      highlightedIndex,
      inputValue,
      isOpen,
      selectedValue,
    }
  }

  //////////////////////////// ROOT

  rootRef = node => (this._rootNode = node)

  getRootProps = ({refKey = 'ref', ...rest} = {}) => {
    // this is used in the render to know whether the user has called getRootProps.
    // It uses that to know whether to apply the props automatically
    this.getRootProps.called = true
    return {
      [refKey]: this.rootRef,
      ...rest,
    }
  }

  //\\\\\\\\\\\\\\\\\\\\\\\\\\ ROOT

  keyDownHandlers = {
    ArrowDown(event) {
      event.preventDefault()
      const amount = event.shiftKey ? 5 : 1
      this.moveHighlightedIndex(amount)
    },

    ArrowUp(event) {
      event.preventDefault()
      const amount = event.shiftKey ? -5 : -1
      this.moveHighlightedIndex(amount)
    },

    Enter(event) {
      event.preventDefault()
      if (this.getState().isOpen) {
        this.selectHighlightedItem()
      }
    },

    Escape(event) {
      event.preventDefault()
      this.reset()
    },
  }

  //////////////////////////// BUTTON

  buttonKeyDownHandlers = {
    ...this.keyDownHandlers,

    ' '(event) {
      event.preventDefault()
      const {isOpen, highlightedIndex} = this.getState()
      if (isOpen) {
        if (highlightedIndex === null) {
          this.closeMenu()
        } else {
          this.selectHighlightedItem()
        }
      } else {
        this.openMenu()
      }
    },
  }

  getButtonProps = ({onClick, onKeyDown, ...rest} = {}) => {
    const {isOpen} = this.getState()
    return {
      role: 'button',
      'aria-label': isOpen ? 'close menu' : 'open menu',
      'aria-expanded': isOpen,
      'aria-haspopup': true,
      onClick: composeEventHandlers(onClick, this.button_handleClick),
      onKeyDown: composeEventHandlers(onKeyDown, this.button_handleKeyDown),
      ...rest,
    }
  }

  button_handleKeyDown = event => {
    if (this.buttonKeyDownHandlers[event.key]) {
      this.buttonKeyDownHandlers[event.key].call(this, event)
    }
  }

  button_handleClick = event => {
    event.preventDefault()
    this.toggleMenu()
  }

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ BUTTON

  /////////////////////////////// LABEL

  getLabelProps = ({htmlFor, ...props}) => {
    this.getLabelProps.called = true
    if (this.getInputProps.called && htmlFor && htmlFor !== this.inputId) {
      throw new Error(
        `downshift: You provided the htmlFor of "${htmlFor}" for your label, but the id of your input is "${this
          .inputId}". You must either remove the id from your input or set the htmlFor of the label equal to the input id.`,
      )
    }
    return {
      ...props,
      htmlFor: typeof htmlFor === 'undefined' ? this.inputId : htmlFor,
    }
  }

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ Label

  /////////////////////////////// INPUT

  getValue = itemValue => {
    return itemValue ? this.props.getValue(itemValue) : ''
  }

  getInputProps = ({id, onChange, onKeyDown, onBlur, ...rest} = {}) => {
    this.getInputProps.called = true
    if (this.getLabelProps.called && id && id !== this.inputId) {
      throw new Error(
        `downshift: You provided the id of "${id}" for your input, but the htmlFor of your label is "${this
          .inputId}". You must either remove the id from your input or set the htmlFor of the label equal to the input id.`,
      )
    }
    const {highlightedIndex, inputValue, isOpen} = this.getState()
    return {
      id: typeof id === 'undefined' ? this.inputId : id,
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': isOpen,
      'aria-activedescendant': highlightedIndex ?
        this.getItemId(highlightedIndex) :
        null,
      autoComplete: 'off',
      value: inputValue,
      onChange: composeEventHandlers(onChange, this.input_handleChange),
      onKeyDown: composeEventHandlers(onKeyDown, this.input_handleKeyDown),
      onBlur: composeEventHandlers(onBlur, this.input_handleBlur),
      ...rest,
    }
  }

  input_handleKeyDown = event => {
    if (event.key && this.keyDownHandlers[event.key]) {
      this.keyDownHandlers[event.key].call(this, event)
    } else if (!['Shift', 'Meta', 'Alt', 'Control'].includes(event.key)) {
      this.openMenu()
    }
  }

  input_handleChange = event => {
    this.internalSetState({inputValue: event.target.value})
  }

  input_handleBlur = () => {
    if (!this.isMouseDown) {
      this.reset()
    }
  }
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ INPUT

  /////////////////////////////// ITEM
  getItemId(index) {
    return `${this.id}-item${index}`
  }

  getItemProps = ({onClick, onMouseEnter, value, index, ...rest} = {}) => {
    const {highlightedIndex, selectedValue} = this.getState()
    this.items.push({index, value})
    return {
      id: this.getItemId(index),
      isHighlighted: highlightedIndex === index,
      isSelected: this.props.multiple ?
        selectedValue.indexOf(this.getValue(value)) > -1 :
        selectedValue === this.getValue(value),
      onClick: composeEventHandlers(onClick, () => {
        this.selectItemAtIndex(Number(index))
      }),
      onMouseEnter: composeEventHandlers(onMouseEnter, () => {
        this.setHighlightedIndex(index)
      }),
      ...rest,
    }
  }
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ ITEM

  reset = type => {
    this.internalSetState(({selectedValue}) => ({
      type,
      isOpen: false,
      highlightedIndex: null,
      inputValue: selectedValue,
    }))
  }

  toggleMenu = (newState, cb) => {
    this.internalSetState(
      ({isOpen}) => {
        let nextIsOpen = !isOpen
        if (typeof newState === 'boolean') {
          nextIsOpen = newState
        }
        return {isOpen: nextIsOpen}
      },
      () => {
        const {isOpen, selectedValue} = this.getState()
        if (isOpen) {
          if (selectedValue.length > 0) {
            this.highlightSelectedItem()
          } else {
            this.setHighlightedIndex()
          }
        }
        cbToCb(cb)()
      },
    )
  }

  openMenu = cb => {
    this.toggleMenu(true, cb)
  }

  closeMenu = cb => {
    this.toggleMenu(false, cb)
  }

  updateStatus = debounce(() => {
    if (!this._isMounted) {
      return
    }
    const state = this.getState()
    const item = this.getItemFromIndex(state.highlightedIndex) || {}
    const resultCount = this.items.length
    const status = this.props.getA11yStatusMessage({
      getValue: this.getValue,
      previousResultCount: this.previousResultCount,
      resultCount,
      highlightedValue: item.value,
      ...state,
    })
    this.previousResultCount = resultCount
    setA11yStatus(status)
  }, 200)

  componentDidMount() {
    // the _isMounted property is because we have `updateStatus` in a `debounce`
    // and we don't want to update the status if the component has been umounted
    this._isMounted = true
    // this.isMouseDown helps us track whether the mouse is currently held down.
    // This is useful when the user clicks on an item in the list, but holds the mouse
    // down long enough for the list to disappear (because the blur event fires on the input)
    // this.isMouseDown is used in the blur handler on the input to determine whether the blur event should
    // trigger hiding the menu.
    const onMouseDown = () => {
      this.isMouseDown = true
    }
    const onMouseUp = event => {
      this.isMouseDown = false
      const {target} = event
      if (!this._rootNode.contains(target)) {
        this.reset(Autocomplete.stateChangeTypes.mouseUp)
      }
    }
    document.body.addEventListener('mousedown', onMouseDown)
    document.body.addEventListener('mouseup', onMouseUp)

    this.cleanup = () => {
      this._isMounted = false
      document.body.removeEventListener('mousedown', onMouseDown)
      document.body.removeEventListener('mouseup', onMouseUp)
    }
  }

  componentDidUpdate() {
    this.updateStatus()
  }

  componentWillUnmount() {
    this.cleanup() // avoids memory leak
  }

  render() {
    const {children} = this.props
    // because the items are rerendered every time we call the children
    // we clear this out each render and
    this.items = []
    // we reset this so we know whether the user calls getRootProps during
    // this render. If they do then we don't need to do anything,
    // if they don't then we need to clone the element they return and
    // apply the props for them.
    this.getRootProps.called = false
    // we do something similar for getLabelProps
    this.getLabelProps.called = false
    // and something similar for getInputProps
    this.getInputProps.called = false
    // doing React.Children.only for Preact support ⚛️
    const element = React.Children.only(
      children(this.getControllerStateAndHelpers()),
    )
    if (!element) {
      // returned null or something...
      return element
    } else if (this.getRootProps.called) {
      // we assumed they applied the root props correctly
      return element
    } else if (typeof element.type === 'string') {
      // they didn't apply the root props, but we can clone
      // this and apply the props ourselves
      return React.cloneElement(element, this.getRootProps(element.props))
    } else {
      // they didn't apply the root props, but they need to
      // otherwise we can't query around the autocomplete
      throw new Error(
        'downshift: If you return a non-DOM element, you must use apply the getRootProps function',
      )
    }
  }
}

export default Autocomplete
