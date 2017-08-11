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
  getA11yStatusMessage,
  unwrapArray,
  isDOMElement,
  getElementProps,
  noop,
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
    itemCount: PropTypes.number,
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
    const state = this.getState({
      highlightedIndex: this.props.defaultHighlightedIndex,
      isOpen: this.props.defaultIsOpen,
      inputValue: this.props.defaultInputValue,
      selectedItem: this.props.defaultSelectedItem,
    })
    if (state.selectedItem) {
      state.inputValue = this.props.itemToString(state.selectedItem)
    }
    this.state = state
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
      state[key] = this.isStateProp(key) ? this.props[key] : stateToMerge[key]
      return state
    }, {})
  }

  /**
   * This determines whether a prop is a "controlled prop" meaning it is
   * state which is controlled by the outside of this component rather
   * than within this component.
   * @param {String} key the key to check
   * @return {Boolean} whether it is a controlled controlled prop
   */
  isStateProp(key) {
    return this.props[key] !== undefined
  }

  getItemCount() {
    if (this.props.itemCount === undefined) {
      return this.items.length
    } else {
      return this.props.itemCount
    }
  }

  getItemNodeFromIndex = index => {
    return document.getElementById(this.getItemId(index))
  }

  setHighlightedIndex = (
    highlightedIndex = this.props.defaultHighlightedIndex,
  ) => {
    this.internalSetState({highlightedIndex}, () => {
      const node = this.getItemNodeFromIndex(this.getState().highlightedIndex)
      const rootNode = this._rootNode
      scrollIntoView(node, rootNode)
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
    const itemsLastIndex = this.getItemCount() - 1
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
    this.internalSetState({
      isOpen: false,
      highlightedIndex: null,
      selectedItem: item,
      inputValue: this.props.itemToString(item),
    })
  }

  selectItemAtIndex = itemIndex => {
    const item = this.items[itemIndex]
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
  //    We will call this.props.onStateChange to update that state
  //
  // In addition, we'll call this.props.onChange if the
  // selectedItem is changed.
  internalSetState(stateToSet, cb) {
    let onChangeArg
    const onStateChangeArg = {}
    return this.setState(
      state => {
        state = this.getState(state)
        stateToSet =
          typeof stateToSet === 'function' ? stateToSet(state) : stateToSet
        // this keeps track of the object we want to call with setState
        const nextState = {}
        // this is just used to tell whether the state changed
        const nextFullState = {}
        // we need to call on change if the outside world is controlling any of our state
        // and we're trying to update that state. OR if the selection has changed and we're
        // trying to update the selection
        if (stateToSet.hasOwnProperty('selectedItem')) {
          onChangeArg = stateToSet.selectedItem
        }
        Object.keys(stateToSet).forEach(key => {
          // the type is useful for the onStateChangeArg
          // but we don't actually want to set it in internal state.
          // this is an undocumented feature for now... Not all internalSetState
          // calls support it and I'm not certain we want them to yet.
          // But it enables users controlling the isOpen state to know when
          // the isOpen state changes due to mouseup events which is quite handy.
          if (key === 'type') {
            return
          }
          // onStateChangeArg should only have the state that is
          // actually changing
          if (state[key] !== stateToSet[key]) {
            onStateChangeArg[key] = stateToSet[key]
          }
          nextFullState[key] = stateToSet[key]
          // if it's coming from props, then we don't care to set it internally
          if (!this.isStateProp(key)) {
            nextState[key] = stateToSet[key]
          }
        })
        return nextState
      },
      () => {
        // call the provided callback if it's a callback
        cbToCb(cb)()

        // only call the onStateChange and onChange callbacks if
        // we have relevant information to pass them.
        if (Object.keys(onStateChangeArg).length) {
          this.props.onStateChange(onStateChangeArg, this.getState())
        }
        if (onChangeArg !== undefined) {
          this.props.onChange(onChangeArg, this.getState())
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

  getInputProps = ({onKeyDown, onBlur, onChange, onInput, ...rest} = {}) => {
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
    const onChangeKey =
      process.env.LIBRARY === 'preact' ? /* istanbul ignore next (preact) */
      'onInput' :
        'onChange'
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
      // preact compatibility
      [onChangeKey]: composeEventHandlers(
        onChange,
        onInput,
        this.input_handleChange,
      ),
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
    const item = this.items[state.highlightedIndex] || {}
    const resultCount = this.getItemCount()
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
        (event.target === this._rootNode ||
          !this._rootNode.contains(event.target)) &&
        this.getState().isOpen
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

  componentDidUpdate(prevProps) {
    if (
      this.isStateProp('selectedItem') &&
      this.props.selectedItem !== prevProps.selectedItem
    ) {
      this.internalSetState({
        inputValue: this.props.itemToString(this.props.selectedItem),
      })
    }
    this.updateStatus()
  }

  componentWillUnmount() {
    this.cleanup() // avoids memory leak
  }

  render() {
    const children = unwrapArray(this.props.children, noop)
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
    const element = unwrapArray(children(this.getControllerStateAndHelpers()))
    if (!element) {
      return null
    }
    if (this.getRootProps.called) {
      validateGetRootPropsCalledCorrectly(element, this.getRootProps)
      return element
    } else if (isDOMElement(element)) {
      // they didn't apply the root props, but we can clone
      // this and apply the props ourselves
      return React.cloneElement(
        element,
        this.getRootProps(getElementProps(element)),
      )
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
  const isComposite = !isDOMElement(element)
  if (isComposite && !refKeySpecified) {
    throw new Error(
      'downshift: You returned a non-DOM element. You must specify a refKey in getRootProps',
    )
  } else if (!isComposite && refKeySpecified) {
    throw new Error(
      `downshift: You returned a DOM element. You should not specify a refKey in getRootProps. You specified "${refKey}"`,
    )
  }
  if (!getElementProps(element).hasOwnProperty(refKey)) {
    throw new Error(
      `downshift: You must apply the ref prop "${refKey}" from getRootProps onto your root element.`,
    )
  }
  if (!getElementProps(element).hasOwnProperty('onClick')) {
    throw new Error(
      `downshift: You must apply the "onClick" prop from getRootProps onto your root element.`,
    )
  }
}
