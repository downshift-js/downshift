/* eslint camelcase:0 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import setA11yStatus from './set-a11y-status'
import {
  cbToCb,
  findParent,
  composeEventHandlers,
  debounce,
  scrollIntoView,
  generateId,
  firstDefined,
  isNumber,
  containsSubset,
  getA11yStatusMessage,
} from './utils'

class Downshift extends Component {
  static propTypes = {
    children: PropTypes.func,
    defaultHighlightedIndex: PropTypes.number,
    defaultSelectedItem: PropTypes.any,
    defaultInputValue: PropTypes.string,
    defaultIsOpen: PropTypes.bool,
    getA11yStatusMessage: PropTypes.func,
    itemToString: PropTypes.func,
    onChange: PropTypes.func,
    onStateChange: PropTypes.func,
    onClick: PropTypes.func,
    // things we keep in state for uncontrolled components
    // but can accept as props for controlled components
    /* eslint-disable react/no-unused-prop-types */
    selectedItem: PropTypes.any,
    isOpen: PropTypes.bool,
    inputValue: PropTypes.string,
    highlightedIndex: PropTypes.number,
    /* eslint-enable */
  }

  static defaultProps = {
    defaultHighlightedIndex: null,
    defaultSelectedItem: null,
    defaultInputValue: '',
    defaultIsOpen: false,
    getA11yStatusMessage,
    itemToString: i => (i == null ? '' : String(i)),
    onStateChange: () => {},
    onChange: () => {},
  }

  // this is an experimental feature
  // so we're not going to document this yet
  static stateChangeTypes = {
    mouseUp: '__autocomplete_mouseup__',
  }

  constructor(...args) {
    super(...args)
    this.id = generateId('downshift')
    this.state = {
      highlightedIndex: this.props.defaultHighlightedIndex,
      inputValue: this.props.defaultInputValue,
      isOpen: this.props.defaultIsOpen,
      selectedItem: this.props.defaultSelectedItem,
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

  getItemFromIndex = index => {
    if (!this.items || !this.items[0]) {
      return null
    }
    return this.items[index]
  }

  getItemNodeFromIndex = index => {
    return document.getElementById(this.getItemId(index))
  }

  maybeScrollToHighlightedElement(highlightedIndex) {
    const node = this.getItemNodeFromIndex(highlightedIndex)
    const rootNode = this._rootNode
    scrollIntoView(node, rootNode)
  }

  setHighlightedIndex = (
    highlightedIndex = this.props.defaultHighlightedIndex,
  ) => {
    this.internalSetState({highlightedIndex}, () => {
      this.maybeScrollToHighlightedElement(highlightedIndex)
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
        selectedItem: null,
        inputValue: '',
        isOpen: false,
      },
      () => {
        const inputNode = this._rootNode.querySelector(`#${this.inputId}`)
        inputNode && inputNode.focus && inputNode.focus()
      },
    )
  }

  selectItem = item => {
    this.reset()
    this.internalSetState({
      selectedItem: item,
      inputValue: this.props.itemToString(item),
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
    this.selectItem(item)
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
  // selectedItem is changed because that's important whether
  // that property is controlled or not.
  internalSetState(stateToSet, cb) {
    const onChangeArg = {}
    let onStateChangeArg, stateChanged
    return this.setState(
      state => {
        state = this.getState(state)
        onStateChangeArg =
          typeof stateToSet === 'function' ? stateToSet(state) : stateToSet
        // this keeps track of the object we want to call with setState
        const nextState = {}
        // this is just used to tell whether the state changed
        const nextFullState = {}
        // we need to call on change if the outside world is controlling any of our state
        // and we're trying to update that state. OR if the selection has changed and we're
        // trying to update the selection
        if (onStateChangeArg.hasOwnProperty('selectedItem')) {
          onChangeArg.selectedItem = onStateChangeArg.selectedItem
          onChangeArg.previousItem = state.selectedItem
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
          nextFullState[key] = onStateChangeArg[key]
          // if it's coming from props, then we don't want to set it internally
          if (!this.props.hasOwnProperty(key)) {
            nextState[key] = onStateChangeArg[key]
          }
        })
        stateChanged = !containsSubset(state, nextFullState)
        return nextState
      },
      () => {
        // call the provided callback if it's a callback
        cbToCb(cb)()
        if (stateChanged) {
          // We call this function whether we're controlled or not
          // It's mostly useful if we're controlled, but it can
          // definitely be useful for folks to know when something
          // happens internally.
          this.props.onStateChange(onStateChangeArg)
        }
        if (Object.keys(onChangeArg).length) {
          // if the selectedItem changed
          // then let's call onChange!
          this.props.onChange(onChangeArg)
        }
      },
    )
  }

  getControllerStateAndHelpers() {
    const {highlightedIndex, inputValue, selectedItem, isOpen} = this.getState()
    const {
      getRootProps,
      getButtonProps,
      getLabelProps,
      getInputProps,
      getItemProps,
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
      getLabelProps,
      getInputProps,
      getItemProps,

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
      selectedItem,
    }
  }

  //////////////////////////// ROOT

  rootRef = node => (this._rootNode = node)

  getRootProps = ({refKey = 'ref', onClick, ...rest} = {}) => {
    // this is used in the render to know whether the user has called getRootProps.
    // It uses that to know whether to apply the props automatically
    this.getRootProps.called = true
    this.getRootProps.refKey = refKey
    return {
      [refKey]: this.rootRef,
      onClick: composeEventHandlers(onClick, this.root_handleClick),
      ...rest,
    }
  }

  root_handleClick = event => {
    event.preventDefault()
    const itemParent = findParent(
      node => {
        const index = this.getItemIndexFromId(node.getAttribute('id'))
        return isNumber(index)
      },
      event.target,
      this._rootNode,
    )
    if (itemParent) {
      this.selectItemAtIndex(
        this.getItemIndexFromId(itemParent.getAttribute('id')),
      )
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
      this.toggleMenu()
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

  getLabelProps = (props = {}) => {
    this.getLabelProps.called = true
    if (
      this.getInputProps.called &&
      props.htmlFor &&
      props.htmlFor !== this.inputId
    ) {
      throw new Error(
        `downshift: You provided the htmlFor of "${props.htmlFor}" for your label, but the id of your input is "${this
          .inputId}". You must either remove the id from your input or set the htmlFor of the label equal to the input id.`,
      )
    }
    this.inputId = firstDefined(
      this.inputId,
      props.htmlFor,
      generateId('downshift-input'),
    )
    return {
      ...props,
      htmlFor: this.inputId,
    }
  }

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ LABEL

  /////////////////////////////// INPUT

  getInputProps = ({onChange, onKeyDown, onBlur, ...rest} = {}) => {
    this.getInputProps.called = true
    if (this.getLabelProps.called && rest.id && rest.id !== this.inputId) {
      throw new Error(
        `downshift: You provided the id of "${rest.id}" for your input, but the htmlFor of your label is "${this
          .inputId}". You must either remove the id from your input or set the htmlFor of the label equal to the input id.`,
      )
    }
    this.inputId = firstDefined(
      this.inputId,
      rest.id,
      generateId('downshift-input'),
    )
    const {inputValue, isOpen, highlightedIndex} = this.getState()
    return {
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': isOpen,
      'aria-activedescendant':
        typeof highlightedIndex === 'number' && highlightedIndex >= 0 ?
          this.getItemId(highlightedIndex) :
          null,
      autoComplete: 'off',
      value: inputValue,
      onChange: composeEventHandlers(onChange, this.input_handleChange),
      onKeyDown: composeEventHandlers(onKeyDown, this.input_handleKeyDown),
      onBlur: composeEventHandlers(onBlur, this.input_handleBlur),
      ...rest,
      id: this.inputId,
    }
  }

  input_handleKeyDown = event => {
    if (event.key && this.keyDownHandlers[event.key]) {
      this.keyDownHandlers[event.key].call(this, event)
    }
  }

  input_handleChange = event => {
    this.internalSetState({isOpen: true, inputValue: event.target.value})
  }

  input_handleBlur = () => {
    if (!this.isMouseDown) {
      this.reset()
    }
  }
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ INPUT

  /////////////////////////////// ITEM
  getItemId(index) {
    return `${this.id}-item-${index}`
  }

  getItemIndexFromId(id) {
    if (id) {
      return Number(id.split(`${this.id}-item-`)[1])
    } else {
      return null
    }
  }

  getItemProps = ({onMouseEnter, item, index, ...rest} = {}) => {
    this.items[index] = item
    return {
      id: this.getItemId(index),
      onMouseEnter: composeEventHandlers(onMouseEnter, () => {
        this.setHighlightedIndex(index)
      }),
      ...rest,
    }
  }
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ ITEM

  reset = type => {
    this.internalSetState(({selectedItem}) => ({
      type,
      isOpen: false,
      highlightedIndex: null,
      inputValue: this.props.itemToString(selectedItem),
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
        const {isOpen} = this.getState()
        if (isOpen) {
          this.setHighlightedIndex()
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
      itemToString: this.props.itemToString,
      previousResultCount: this.previousResultCount,
      resultCount,
      highlightedItem: item,
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
      if (
        event.target === this._rootNode ||
        !this._rootNode.contains(event.target)
      ) {
        this.reset(Downshift.stateChangeTypes.mouseUp)
      }
    }
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    this.cleanup = () => {
      this._isMounted = false
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
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
    this.getRootProps.refKey = undefined
    // we do something similar for getLabelProps
    this.getLabelProps.called = false
    // and something similar for getInputProps
    this.getInputProps.called = false
    const uiDescriptor =
      children && children(this.getControllerStateAndHelpers())
    if (!uiDescriptor) {
      return null
    }
    // doing React.Children.only for Preact support ⚛️
    const element = React.Children.only(uiDescriptor)
    if (this.getRootProps.called) {
      validateGetRootPropsCalledCorrectly(element, this.getRootProps)
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

export default Downshift

function validateGetRootPropsCalledCorrectly(element, {refKey}) {
  const refKeySpecified = refKey !== 'ref'
  const isComposite = typeof element.type !== 'string'
  if (isComposite && !refKeySpecified) {
    throw new Error(
      'downshift: You returned a non-DOM element. You must specify a refKey in getRootProps',
    )
  } else if (!isComposite && refKeySpecified) {
    throw new Error(
      `downshift: You returned a DOM element. You should not specify a refKey in getRootProps. You specified "${refKey}"`,
    )
  }
  if (!element.props.hasOwnProperty(refKey)) {
    throw new Error(
      `downshift: You must apply the ref prop "${refKey}" from getRootProps onto your root element.`,
    )
  }
  if (!element.props.hasOwnProperty('onClick')) {
    throw new Error(
      `downshift: You must apply the "onClick" prop from getRootProps onto your root element.`,
    )
  }
}
