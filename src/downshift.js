/* eslint camelcase:0 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import preval from 'preval.macro'
import setA11yStatus from './set-a11y-status'
import {
  cbToCb,
  composeEventHandlers,
  debounce,
  scrollIntoView,
  generateId,
  firstDefined,
  getA11yStatusMessage,
  unwrapArray,
  isDOMElement,
  getElementProps,
  noop,
  requiredProp,
  pickState,
  isPlainObject,
} from './utils'

class Downshift extends Component {
  static propTypes = {
    children: PropTypes.func,
    render: PropTypes.func,
    defaultHighlightedIndex: PropTypes.number,
    defaultSelectedItem: PropTypes.any,
    defaultInputValue: PropTypes.string,
    defaultIsOpen: PropTypes.bool,
    getA11yStatusMessage: PropTypes.func,
    itemToString: PropTypes.func,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onStateChange: PropTypes.func,
    onInputValueChange: PropTypes.func,
    onUserAction: PropTypes.func,
    onOuterClick: PropTypes.func,
    selectedItemChanged: PropTypes.func,
    stateReducer: PropTypes.func,
    itemCount: PropTypes.number,
    id: PropTypes.string,
    environment: PropTypes.shape({
      addEventListener: PropTypes.func,
      removeEventListener: PropTypes.func,
      document: PropTypes.shape({
        getElementById: PropTypes.func,
        activeElement: PropTypes.any,
        body: PropTypes.any,
      }),
    }),
    // things we keep in state for uncontrolled components
    // but can accept as props for controlled components
    /* eslint-disable react/no-unused-prop-types */
    selectedItem: PropTypes.any,
    isOpen: PropTypes.bool,
    inputValue: PropTypes.string,
    highlightedIndex: PropTypes.number,
    breakingChanges: PropTypes.shape({
      resetInputOnSelection: PropTypes.bool,
    }),
    /* eslint-enable */
  }

  static defaultProps = {
    defaultHighlightedIndex: null,
    defaultSelectedItem: null,
    defaultInputValue: '',
    defaultIsOpen: false,
    getA11yStatusMessage,
    itemToString: i => {
      if (i == null) {
        return ''
      }
      if (process.env.NODE_ENV !== 'production' && isPlainObject(i)) {
        //eslint-disable-next-line no-console
        console.warn(
          'downshift: An object was passed to the default implementation of `itemToString`. You should probably provide your own `itemToString` implementation. Please refer to the `itemToString` API documentation.',
          'The object that was passed:',
          i,
        )
      }
      return String(i)
    },
    onStateChange: () => {},
    onInputValueChange: () => {},
    onUserAction: () => {},
    onChange: () => {},
    onSelect: () => {},
    onOuterClick: () => {},
    selectedItemChanged: (prevItem, item) => prevItem !== item,
    environment:
      typeof window === 'undefined' /* istanbul ignore next (ssr) */
        ? {}
        : window,
    stateReducer: (state, stateToSet) => stateToSet,
    breakingChanges: {},
  }

  static stateChangeTypes = {
    unknown: '__autocomplete_unknown__',
    mouseUp: '__autocomplete_mouseup__',
    itemMouseEnter: '__autocomplete_item_mouseenter__',
    keyDownArrowUp: '__autocomplete_keydown_arrow_up__',
    keyDownArrowDown: '__autocomplete_keydown_arrow_down__',
    keyDownEscape: '__autocomplete_keydown_escape__',
    keyDownEnter: '__autocomplete_keydown_enter__',
    clickItem: '__autocomplete_click_item__',
    blurInput: '__autocomplete_blur_input__',
    changeInput: '__autocomplete_change_input__',
    keyDownSpaceButton: '__autocomplete_keydown_space_button__',
    clickButton: '__autocomplete_click_button__',
    blurButton: '__autocomplete_blur_button__',
    controlledPropUpdatedSelectedItem:
      '__autocomplete_controlled_prop_updated_selected_item__',
  }

  constructor(...args) {
    super(...args)
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
    this.id = this.props.id || `downshift-${generateId()}`
  }

  input = null
  items = []
  // itemCount can be changed asynchronously
  // from within downshift (so it can't come from a prop)
  // this is why we store it as an instance and use
  // getItemCount rather than just use items.length
  // (to support windowing + async)
  itemCount = null
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
      state[key] = this.isControlledProp(key)
        ? this.props[key]
        : stateToMerge[key]
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
  isControlledProp(key) {
    return this.props[key] !== undefined
  }

  getItemCount() {
    // things read better this way. They're in priority order:
    // 1. `this.itemCount`
    // 2. `this.props.itemCount`
    // 3. `this.items.length`
    /* eslint-disable no-negated-condition */
    if (this.itemCount != null) {
      return this.itemCount
    } else if (this.props.itemCount !== undefined) {
      return this.props.itemCount
    } else {
      return this.items.length
    }
    /* eslint-enable no-negated-condition */
  }

  setItemCount = count => (this.itemCount = count)
  unsetItemCount = () => (this.itemCount = null)

  getItemNodeFromIndex = index => {
    return this.props.environment.document.getElementById(this.getItemId(index))
  }

  setHighlightedIndex = (
    highlightedIndex = this.props.defaultHighlightedIndex,
    otherStateToSet = {},
  ) => {
    otherStateToSet = pickState(otherStateToSet)
    this.internalSetState({highlightedIndex, ...otherStateToSet})
  }

  scrollHighlightedItemIntoView = () => {
    /* istanbul ignore else (react-native) */
    if (preval`module.exports = process.env.BUILD_REACT_NATIVE !== 'true'`) {
      const node = this.getItemNodeFromIndex(this.getState().highlightedIndex)
      const rootNode = this._rootNode
      scrollIntoView(node, rootNode)
    }
  }

  openAndHighlightDefaultIndex = (otherStateToSet = {}) => {
    this.setHighlightedIndex(undefined, {isOpen: true, ...otherStateToSet})
  }

  highlightDefaultIndex = (otherStateToSet = {}) => {
    this.setHighlightedIndex(undefined, otherStateToSet)
  }

  moveHighlightedIndex = (amount, otherStateToSet) => {
    if (this.getState().isOpen) {
      this.changeHighlightedIndex(amount, otherStateToSet)
    } else {
      this.openAndHighlightDefaultIndex(otherStateToSet)
    }
  }

  // eslint-disable-next-line complexity
  changeHighlightedIndex = (moveAmount, otherStateToSet) => {
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
    this.setHighlightedIndex(newIndex, otherStateToSet)
  }

  clearSelection = cb => {
    this.internalSetState(
      {
        selectedItem: null,
        inputValue: '',
        isOpen: false,
      },
      cb,
    )
  }

  selectItem = (item, otherStateToSet, cb) => {
    otherStateToSet = pickState(otherStateToSet)
    this.internalSetState(
      {
        isOpen: false,
        highlightedIndex: this.props.defaultHighlightedIndex,
        selectedItem: item,
        inputValue:
          this.isControlledProp('selectedItem') &&
          this.props.breakingChanges.resetInputOnSelection
            ? this.props.defaultInputValue
            : this.props.itemToString(item),
        ...otherStateToSet,
      },
      cb,
    )
  }

  selectItemAtIndex = (itemIndex, otherStateToSet, cb) => {
    const item = this.items[itemIndex]
    if (item == null) {
      return
    }
    this.selectItem(item, otherStateToSet, cb)
  }

  selectHighlightedItem = (otherStateToSet, cb) => {
    return this.selectItemAtIndex(
      this.getState().highlightedIndex,
      otherStateToSet,
      cb,
    )
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
    let isItemSelected, onChangeArg

    const onStateChangeArg = {}
    const isStateToSetFunction = typeof stateToSet === 'function'

    // we want to call `onInputValueChange` before the `setState` call
    // so someone controlling the `inputValue` state gets notified of
    // the input change as soon as possible. This avoids issues with
    // preserving the cursor position.
    // See https://github.com/paypal/downshift/issues/217 for more info.
    if (!isStateToSetFunction && stateToSet.hasOwnProperty('inputValue')) {
      this.props.onInputValueChange(stateToSet.inputValue, {
        ...this.getStateAndHelpers(),
        ...stateToSet,
      })
    }
    return this.setState(
      state => {
        state = this.getState(state)
        stateToSet = isStateToSetFunction ? stateToSet(state) : stateToSet

        // Your own function that could modify the state that will be set.
        stateToSet = this.props.stateReducer(state, stateToSet)

        // checks if an item is selected, regardless of if it's different from
        // what was selected before
        // used to determine if onSelect and onChange callbacks should be called
        isItemSelected = stateToSet.hasOwnProperty('selectedItem')
        // this keeps track of the object we want to call with setState
        const nextState = {}
        // this is just used to tell whether the state changed
        const nextFullState = {}
        // we need to call on change if the outside world is controlling any of our state
        // and we're trying to update that state. OR if the selection has changed and we're
        // trying to update the selection
        if (isItemSelected && stateToSet.selectedItem !== state.selectedItem) {
          onChangeArg = stateToSet.selectedItem
        }
        stateToSet.type = stateToSet.type || Downshift.stateChangeTypes.unknown

        Object.keys(stateToSet).forEach(key => {
          // onStateChangeArg should only have the state that is
          // actually changing
          if (state[key] !== stateToSet[key]) {
            onStateChangeArg[key] = stateToSet[key]
          }
          // the type is useful for the onStateChangeArg
          // but we don't actually want to set it in internal state.
          // this is an undocumented feature for now... Not all internalSetState
          // calls support it and I'm not certain we want them to yet.
          // But it enables users controlling the isOpen state to know when
          // the isOpen state changes due to mouseup events which is quite handy.
          if (key === 'type') {
            return
          }
          nextFullState[key] = stateToSet[key]
          // if it's coming from props, then we don't care to set it internally
          if (!this.isControlledProp(key)) {
            nextState[key] = stateToSet[key]
          }
        })

        // if stateToSet is a function, then we weren't able to call onInputValueChange
        // earlier, so we'll call it now that we know what the inputValue state will be.
        if (isStateToSetFunction && stateToSet.hasOwnProperty('inputValue')) {
          this.props.onInputValueChange(stateToSet.inputValue, {
            ...this.getStateAndHelpers(),
            ...stateToSet,
          })
        }

        return nextState
      },
      () => {
        // call the provided callback if it's a callback
        cbToCb(cb)()

        // only call the onStateChange and onChange callbacks if
        // we have relevant information to pass them.
        const hasMoreStateThanType = Object.keys(onStateChangeArg).length > 1
        if (hasMoreStateThanType) {
          this.props.onStateChange(onStateChangeArg, this.getStateAndHelpers())
        }

        if (isItemSelected) {
          this.props.onSelect(
            stateToSet.selectedItem,
            this.getStateAndHelpers(),
          )
        }

        if (onChangeArg !== undefined) {
          this.props.onChange(onChangeArg, this.getStateAndHelpers())
        }
        // this is currently undocumented and therefore subject to change
        // We'll try to not break it, but just be warned.
        this.props.onUserAction(onStateChangeArg, this.getStateAndHelpers())
      },
    )
  }

  getStateAndHelpers() {
    const {highlightedIndex, inputValue, selectedItem, isOpen} = this.getState()
    const {itemToString} = this.props
    const {id} = this
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
      clearItems,
      reset,
      setItemCount,
      unsetItemCount,
    } = this
    return {
      // prop getters
      getRootProps,
      getButtonProps,
      getLabelProps,
      getInputProps,
      getItemProps,

      // actions
      reset,
      openMenu,
      closeMenu,
      toggleMenu,
      selectItem,
      selectItemAtIndex,
      selectHighlightedItem,
      setHighlightedIndex,
      clearSelection,
      clearItems,
      setItemCount,
      unsetItemCount,

      //props
      itemToString,

      //derived
      id,

      // state
      highlightedIndex,
      inputValue,
      isOpen,
      selectedItem,
    }
  }

  //////////////////////////// ROOT

  rootRef = node => (this._rootNode = node)

  getRootProps = (
    {refKey = 'ref', ...rest} = {},
    {suppressRefError = false} = {},
  ) => {
    // this is used in the render to know whether the user has called getRootProps.
    // It uses that to know whether to apply the props automatically
    this.getRootProps.called = true
    this.getRootProps.refKey = refKey
    this.getRootProps.suppressRefError = suppressRefError
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
      this.moveHighlightedIndex(amount, {
        type: Downshift.stateChangeTypes.keyDownArrowDown,
      })
    },

    ArrowUp(event) {
      event.preventDefault()
      const amount = event.shiftKey ? -5 : -1
      this.moveHighlightedIndex(amount, {
        type: Downshift.stateChangeTypes.keyDownArrowUp,
      })
    },

    Enter(event) {
      if (this.getState().isOpen) {
        event.preventDefault()
        this.selectHighlightedItem({
          type: Downshift.stateChangeTypes.keyDownEnter,
        })
      }
    },

    Escape(event) {
      event.preventDefault()
      this.reset({type: Downshift.stateChangeTypes.keyDownEscape})
    },
  }

  //////////////////////////// BUTTON

  buttonKeyDownHandlers = {
    ...this.keyDownHandlers,

    ' '(event) {
      event.preventDefault()
      this.toggleMenu({type: Downshift.stateChangeTypes.keyDownSpaceButton})
    },
  }

  getButtonProps = ({onClick, onKeyDown, onBlur, ...rest} = {}) => {
    const {isOpen} = this.getState()
    const enabledEventHandlers = preval`module.exports = process.env.BUILD_REACT_NATIVE === 'true'`
      ? /* istanbul ignore next (react-native) */
        {
          onPress: composeEventHandlers(onClick, this.button_handleClick),
        }
      : {
          onClick: composeEventHandlers(onClick, this.button_handleClick),
          onKeyDown: composeEventHandlers(onKeyDown, this.button_handleKeyDown),
          onBlur: composeEventHandlers(onBlur, this.button_handleBlur),
        }
    const eventHandlers = rest.disabled ? {} : enabledEventHandlers
    return {
      type: 'button',
      role: 'button',
      'aria-label': isOpen ? 'close menu' : 'open menu',
      'aria-expanded': isOpen,
      'aria-haspopup': true,
      ...eventHandlers,
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
    // handle odd case for Safari and Firefox which
    // don't give the button the focus properly.
    /* istanbul ignore if (can't reasonably test this) */
    if (
      this.props.environment.document.activeElement ===
      this.props.environment.document.body
    ) {
      event.target.focus()
    }
    this.toggleMenu({type: Downshift.stateChangeTypes.clickButton})
  }

  button_handleBlur = () => {
    if (!this.isMouseDown) {
      this.reset({type: Downshift.stateChangeTypes.blurButton})
    }
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
        `downshift: You provided the htmlFor of "${
          props.htmlFor
        }" for your label, but the id of your input is "${
          this.inputId
        }". You must either remove the id from your input or set the htmlFor of the label equal to the input id.`,
      )
    }
    this.inputId = firstDefined(this.inputId, props.htmlFor, `${this.id}-input`)
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
        `downshift: You provided the id of "${
          rest.id
        }" for your input, but the htmlFor of your label is "${
          this.inputId
        }". You must either remove the id from your input or set the htmlFor of the label equal to the input id.`,
      )
    }
    this.inputId = firstDefined(this.inputId, rest.id, `${this.id}-input`)
    let onChangeKey
    /* istanbul ignore next (preact) */
    if (preval`module.exports = process.env.BUILD_PREACT === 'true'`) {
      onChangeKey = 'onInput'
      /* istanbul ignore next (react-native) */
    } else if (
      preval`module.exports = process.env.BUILD_REACT_NATIVE === 'true'`
    ) {
      onChangeKey = 'onChangeText'
    } else {
      onChangeKey = 'onChange'
    }
    const {inputValue, isOpen, highlightedIndex} = this.getState()
    const eventHandlers = rest.disabled
      ? {}
      : {
          [onChangeKey]: composeEventHandlers(
            onChange,
            onInput,
            this.input_handleChange,
          ),
          onKeyDown: composeEventHandlers(onKeyDown, this.input_handleKeyDown),
          onBlur: composeEventHandlers(onBlur, this.input_handleBlur),
        }
    return {
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': isOpen,
      'aria-activedescendant':
        isOpen && typeof highlightedIndex === 'number' && highlightedIndex >= 0
          ? this.getItemId(highlightedIndex)
          : null,
      autoComplete: 'off',
      value: inputValue,
      ...eventHandlers,
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
    this.internalSetState({
      type: Downshift.stateChangeTypes.changeInput,
      isOpen: true,
      inputValue: preval`module.exports = process.env.BUILD_REACT_NATIVE === 'true'`
        ? /* istanbul ignore next (react-native) */ event
        : event.target.value,
    })
  }

  input_handleBlur = () => {
    if (!this.isMouseDown) {
      this.reset({type: Downshift.stateChangeTypes.blurInput})
    }
  }

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ INPUT

  /////////////////////////////// ITEM
  getItemId(index) {
    return `${this.id}-item-${index}`
  }

  getItemProps = ({
    onMouseMove,
    onMouseDown,
    onClick,
    index,
    item = requiredProp('getItemProps', 'item'),
    ...rest
  } = {}) => {
    if (index === undefined) {
      this.items.push(item)
      index = this.items.indexOf(item)
    } else {
      this.items[index] = item
    }

    const onSelectKey = preval`module.exports = process.env.BUILD_REACT_NATIVE === 'true'`
      ? /* istanbul ignore next (react-native) */ 'onPress'
      : 'onClick'

    const enabledEventHandlers = {
      // onMouseMove is used over onMouseEnter here. onMouseMove
      // is only triggered on actual mouse movement while onMouseEnter
      // can fire on DOM changes, interrupting keyboard navigation
      onMouseMove: composeEventHandlers(onMouseMove, () => {
        if (index === this.getState().highlightedIndex) {
          return
        }
        this.setHighlightedIndex(index, {
          type: Downshift.stateChangeTypes.itemMouseEnter,
        })

        // We never want to manually scroll when changing state based
        // on `onMouseMove` because we will be moving the element out
        // from under the user which is currently scrolling/moving the
        // cursor
        this.avoidScrolling = true
        setTimeout(() => (this.avoidScrolling = false), 250)
      }),
      onMouseDown: composeEventHandlers(onMouseDown, event => {
        // This prevents the activeElement from being changed
        // to the item so it can remain with the current activeElement
        // which is a more common use case.
        event.preventDefault()
      }),
      [onSelectKey]: composeEventHandlers(onClick, () => {
        this.selectItemAtIndex(index, {
          type: Downshift.stateChangeTypes.clickItem,
        })
      }),
    }

    const eventHandlers = rest.disabled ? {} : enabledEventHandlers

    return {
      id: this.getItemId(index),
      ...eventHandlers,
      ...rest,
    }
  }
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ ITEM

  clearItems = () => {
    this.items = []
  }

  reset = (otherStateToSet = {}, cb) => {
    otherStateToSet = pickState(otherStateToSet)
    this.internalSetState(
      ({selectedItem}) => ({
        isOpen: false,
        highlightedIndex: this.props.defaultHighlightedIndex,
        inputValue: this.props.itemToString(selectedItem),
        ...otherStateToSet,
      }),
      cbToCb(cb),
    )
  }

  toggleMenu = (otherStateToSet = {}, cb) => {
    otherStateToSet = pickState(otherStateToSet)
    this.internalSetState(
      ({isOpen}) => {
        return {isOpen: !isOpen, ...otherStateToSet}
      },
      () => {
        const {isOpen} = this.getState()
        if (isOpen) {
          this.highlightDefaultIndex()
        }
        cbToCb(cb)()
      },
    )
  }

  openMenu = cb => {
    this.internalSetState({isOpen: true}, cbToCb(cb))
  }

  closeMenu = cb => {
    this.internalSetState({isOpen: false}, cbToCb(cb))
  }

  updateStatus = debounce(() => {
    if (!this._isMounted) {
      return
    }
    const state = this.getState()
    const item = this.items[state.highlightedIndex]
    const resultCount = this.getItemCount()
    const status = this.props.getA11yStatusMessage({
      itemToString: this.props.itemToString,
      previousResultCount: this.previousResultCount,
      resultCount,
      highlightedItem: item,
      ...state,
    })
    this.previousResultCount = resultCount
    /* istanbul ignore else (react-native) */
    if (preval`module.exports = process.env.BUILD_REACT_NATIVE !== 'true'`) {
      setA11yStatus(status)
    }
  }, 200)

  componentDidMount() {
    // the _isMounted property is because we have `updateStatus` in a `debounce`
    // and we don't want to update the status if the component has been umounted
    this._isMounted = true
    /* istanbul ignore if (react-native) */
    if (preval`module.exports = process.env.BUILD_REACT_NATIVE === 'true'`) {
      this.cleanup = () => {
        this._isMounted = false
      }
    } else {
      // this.isMouseDown helps us track whether the mouse is currently held down.
      // This is useful when the user clicks on an item in the list, but holds the mouse
      // down long enough for the list to disappear (because the blur event fires on the input)
      // this.isMouseDown is used in the blur handler on the input to determine whether the blur event should
      // trigger hiding the menu.
      const onMouseDown = () => {
        this.isMouseDown = true
      }
      const onMouseUp = event => {
        const {document} = this.props.environment
        this.isMouseDown = false
        if (
          (event.target === this._rootNode ||
            !this._rootNode.contains(event.target)) &&
          this.getState().isOpen &&
          (!this.inputId || document.activeElement.id !== this.inputId)
        ) {
          this.reset({type: Downshift.stateChangeTypes.mouseUp}, () =>
            this.props.onOuterClick(this.getStateAndHelpers()),
          )
        }
      }
      this.props.environment.addEventListener('mousedown', onMouseDown)
      this.props.environment.addEventListener('mouseup', onMouseUp)

      this.cleanup = () => {
        this._isMounted = false
        this.props.environment.removeEventListener('mousedown', onMouseDown)
        this.props.environment.removeEventListener('mouseup', onMouseUp)
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.isControlledProp('selectedItem') &&
      this.props.selectedItemChanged(
        prevProps.selectedItem,
        this.props.selectedItem,
      )
    ) {
      this.internalSetState({
        type: Downshift.stateChangeTypes.controlledPropUpdatedSelectedItem,
        inputValue: this.props.itemToString(this.props.selectedItem),
      })
    }

    const current =
      this.props.highlightedIndex === undefined ? this.state : this.props
    const prev =
      prevProps.highlightedIndex === undefined ? prevState : prevProps

    if (
      current.highlightedIndex !== prev.highlightedIndex &&
      !this.avoidScrolling
    ) {
      this.scrollHighlightedItemIntoView()
    }

    this.updateStatus()
  }

  componentWillUnmount() {
    this.cleanup() // avoids memory leak
  }

  // eslint-disable-next-line complexity
  render() {
    const children = unwrapArray(this.props.render || this.props.children, noop)
    // because the items are rerendered every time we call the children
    // we clear this out each render and
    this.clearItems()
    // we reset this so we know whether the user calls getRootProps during
    // this render. If they do then we don't need to do anything,
    // if they don't then we need to clone the element they return and
    // apply the props for them.
    this.getRootProps.called = false
    this.getRootProps.refKey = undefined
    this.getRootProps.suppressRefError = undefined
    // we do something similar for getLabelProps
    this.getLabelProps.called = false
    // and something similar for getInputProps
    this.getInputProps.called = false
    const element = unwrapArray(children(this.getStateAndHelpers()))
    if (!element) {
      return null
    }
    if (this.getRootProps.called) {
      if (!this.getRootProps.suppressRefError) {
        validateGetRootPropsCalledCorrectly(element, this.getRootProps)
      }
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
  if (!getElementProps(element)[refKey]) {
    throw new Error(
      `downshift: You must apply the ref prop "${refKey}" from getRootProps onto your root element.`,
    )
  }
}
