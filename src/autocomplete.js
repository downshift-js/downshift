/* eslint camelcase:0 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import setA11yStatus from './set-a11y-status'
import {cbToCb, composeEventHandlers, debounce, scrollIntoView} from './utils'

class Autocomplete extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    defaultHighlightedIndex: PropTypes.number,
    defaultValue: PropTypes.any,
    getA11yStatusMessage: PropTypes.func,
    getValue: PropTypes.func,
    multiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onStateChange: PropTypes.func,
    onClick: PropTypes.func,
    // things we keep in state for uncontrolled components
    // but can accept as props for controlled components
    /* eslint-disable react/no-unused-prop-types */
    selectedValue: PropTypes.any,
    isOpen: PropTypes.bool,
    inputValue: PropTypes.string,
    highlightedIndex: PropTypes.number,
    /* eslint-enable */
  }

  static defaultProps = {
    defaultHighlightedIndex: null,
    defaultValue: null,
    getA11yStatusMessage({resultCount, highlightedItem, getValue}) {
      if (!resultCount) {
        return 'No results.'
      } else if (!highlightedItem) {
        return `${resultCount} ${resultCount === 1 ?
          'result is' :
          'results are'} available, use up and down arrow keys to navigate.`
      }
      return getValue(highlightedItem)
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
    return this._rootNode.querySelector(
      `[data-autocomplete-item-index="${index}"]`,
    )
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
        const inputNode = this._rootNode.querySelector(
          '[data-autocomplete-input]',
        )
        inputNode && inputNode.focus && inputNode.focus()
      },
    )
  }

  selectItem = itemValue => {
    if (!this.props.multiple) {
      this.reset()
    }
    this.internalSetState(({selectedValue: previousValue}) => {
      if (this.props.multiple) {
        const values = [...previousValue]
        const pos = values.indexOf(itemValue)
        if (pos > -1) {
          values.splice(pos, 1)
        } else {
          values.push(itemValue)
        }
        return {
          selectedValue: values,
          inputValue: values.map(value => this.getValue(value)).join(', '),
        }
      } else {
        return {
          selectedValue: itemValue,
          inputValue: this.getValue(itemValue),
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
        // if the selectedValue changed
        // then let's call onChange!
        if (Object.keys(onChangeArg).length) {
          this.props.onChange(onChangeArg)
        }
        // We call this function whether we're controlled or not
        // It's mostly useful if we're controlled, but it can
        // definitely be useful for folks to know when something
        // happens internally.
        this.props.onStateChange(onStateChangeArg)
      },
    )
  }

  getControllerStateAndHelpers() {
    const {
      highlightedIndex,
      inputValue,
      selectedValue,
      isOpen,
    } = this.getState()
    const {
      getRootProps,
      getButtonProps,
      getInputProps,
      getItemProps,
      getItemFromIndex,
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
      // prop getters
      getRootProps,
      getButtonProps,
      getInputProps,
      getItemProps,
      getItemFromIndex,

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

  getRootProps = ({refKey = 'ref', onClick, ...rest} = {}) => {
    // this is used in the render to know whether the user has called getRootProps.
    // It uses that to know whether to apply the props automatically
    this.getRootProps.called = true
    return {
      [refKey]: this.rootRef,
      onClick: composeEventHandlers(onClick, this.root_handleClick),
      ...rest,
    }
  }

  root_handleClick = event => {
    event.preventDefault()
    const {target} = event
    if (!target) {
      return
    }
    const index = target.getAttribute('data-autocomplete-item-index')
    if (!index) {
      return
    }
    this.selectItemAtIndex(Number(index))
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

  /////////////////////////////// INPUT

  getValue = itemValue => {
    return itemValue ? this.props.getValue(itemValue) : ''
  }

  getInputProps = ({onChange, onKeyDown, onBlur, ...rest} = {}) => {
    const {inputValue, isOpen} = this.getState()
    return {
      'data-autocomplete-input': true,
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': isOpen,
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
  getItemProps = ({onMouseEnter, value, index, ...rest} = {}) => {
    this.items.push({index, value})
    return {
      'data-autocomplete-item-index': index,
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
      inputValue: this.getValue(selectedValue),
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
    const item = this.getItemFromIndex(this.getState().highlightedIndex) || {}
    const status = this.props.getA11yStatusMessage({
      resultCount: this.items.length,
      highlightedItem: item.value,
      getValue: this.getValue,
    })
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

  componentDidUpdate(prevProps, prevState) {
    // TODO: what do we need to do for this when the
    // autocomplete is a controlled component?
    if (
      prevState.highlightedIndex !== this.state.highlightedIndex ||
      this.state.selectedValue !== prevState.selectedValue
    ) {
      this.updateStatus()
    }
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
