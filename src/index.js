import React, {Component} from 'react'
import PropTypes from 'prop-types'
import scrollIntoView from 'dom-scroll-into-view'
import {moveCursorToTheEnd, debounce, compose} from './utils'

const AUTOCOMPLETE_CONTEXT = '__autocomplete__'
const MENU_CONTEXT = '__autocomplete_menu__'

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

class Controller extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
  }

  render() {
    return this.props.children(
      this.autocomplete.getControllerStateAndHelpers(),
    )
  }
}

class Menu extends Component {
  static contextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    ref: PropTypes.func,
    children: PropTypes.func.isRequired,
  }

  static initialState = {
    highlightedIndex: null,
  }

  constructor(props, context) {
    super(props, context)
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.ref = compose(node => (this.node = node), this.props.ref)
  }

  state = Menu.initialState
  items = []
  itemChangeListeners = []

  reset = cb => {
    this.setState(Menu.initialState, cbToCb(cb))
  }
  changeHighlighedIndex = moveAmount => {
    const {highlightedIndex} = this.state
    const baseIndex = highlightedIndex === null ? -1 : highlightedIndex
    const itemsLastIndex = this.items.length - 1
    if (itemsLastIndex < 0) {
      return
    }
    let newIndex = baseIndex + moveAmount
    if (newIndex < 0) {
      newIndex = itemsLastIndex
    } else if (newIndex > itemsLastIndex) {
      newIndex = 0
    }
    this.setState({
      highlightedIndex: newIndex,
    })
  }
  setHighlightedIndex = highlightedIndex => {
    this.setState({highlightedIndex})
  }

  getItemFromIndex = index => {
    if (!this.items || !this.items[0]) {
      return null
    }
    return this.items.find(itemInstance => {
      return itemInstance.props.index === index
    })
  }

  maybeScrollToHighlightedElement() {
    const itemInstance = this.getItemFromIndex(this.state.highlightedIndex)
    if (!itemInstance || !itemInstance.node) {
      return
    }
    const itemContainer = this.itemContainer || this.node
    scrollIntoView(itemInstance.node, itemContainer, {
      onlyScrollIfNeeded: true,
    })
  }

  addItemsChangedListener(cb) {
    this.itemChangeListeners.push(cb)
    const cleanup = () => {
      const index = this.itemChangeListeners.indexOf(cb)
      if (index !== -1) {
        this.itemChangeListeners.splice(index, 1)
      }
    }
    return cleanup
  }

  addItemInstance(itemInstance) {
    this.items.push(itemInstance)
    for (let i = 0; i < this.itemChangeListeners.length; i++) {
      this.itemChangeListeners[i]({items: this.items, added: itemInstance})
    }
  }

  removeItemInstance(itemInstance) {
    const index = this.items.indexOf(itemInstance)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
    for (let i = 0; i < this.itemChangeListeners.length; i++) {
      this.itemChangeListeners[i]({items: this.items, removed: itemInstance})
    }
  }

  getChildContext() {
    return {[MENU_CONTEXT]: this}
  }

  componentDidMount() {
    this.autocomplete.setMenu(this)
  }

  componentDidUpdate() {
    this.maybeScrollToHighlightedElement()
  }

  componentWillUnmount() {
    this.autocomplete.removeMenu(this)
  }
  render() {
    if (!this.autocomplete.state.isOpen) {
      return null
    }
    const {inputValue} = this.autocomplete.state
    const {highlightedIndex} = this.state
    const {children, ...rest} = this.props
    return (
      <div {...rest} ref={this.ref}>
        <div>
          {children(this.autocomplete.getControllerStateAndHelpers())}
        </div>
        <MenuStatus
          highlightedIndex={highlightedIndex}
          inputValue={inputValue}
        />
      </div>
    )
  }
}

class MenuStatus extends Component {
  static contextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
  }

  static defaultProps = {
    getA11yStatusMessage({resultCount, highlightedItem, getInputValue}) {
      if (!resultCount) {
        return 'No results.'
      } else if (!highlightedItem) {
        return `${resultCount} ${resultCount === 1 ?
          'result is' :
          'results are'} available, use up and down arrow keys to navigate.`
      }
      return getInputValue(highlightedItem)
    },
  }

  static propTypes = {
    highlightedIndex: PropTypes.number,
    inputValue: PropTypes.string,
    getA11yStatusMessage: PropTypes.func,
  }

  constructor(props, context) {
    super(props, context)
    this.menu = this.context[MENU_CONTEXT]
    this.updateStatus = debounce(this.updateStatus, 200)
  }
  // have to do this because updateStatus is debounced
  _isMounted = false
  state = {statuses: []}

  updateStatus = (highlightedIndex = this.props.highlightedIndex) => {
    if (!this._isMounted) {
      return
    }
    const {
      items = [],
      getItemFromIndex,
      autocomplete: {getInputValue},
    } = this.menu
    const {statuses} = this.state
    const resultCount = items.length
    const itemInstance = getItemFromIndex(highlightedIndex) || {
      props: {},
    }
    const status = this.props.getA11yStatusMessage({
      resultCount,
      highlightedItem: itemInstance.props.item,
      getInputValue,
    })
    const isSameAsLast = statuses[statuses.length - 1] === status
    if (isSameAsLast) {
      this.setState(({statuses: currentStatuses}) => ({
        statuses: [...currentStatuses, status],
      }))
    } else {
      this.setState({statuses: [status]})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.highlightedIndex !== this.props.highlightedIndex ||
      this.props.inputValue !== nextProps.inputValue
    ) {
      this.updateStatus(nextProps.highlightedIndex)
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.cleanup = this.menu.addItemsChangedListener(this.updateStatus)
    this.updateStatus()
  }

  componentWillUnmount() {
    this._isMounted = false
    this.cleanup()
  }

  renderStatus = (status, index) => {
    return (
      <div
        style={{
          display: index === this.state.statuses.length - 1 ? 'block' : 'none',
        }}
        key={index}
      >
        {status}
      </div>
    )
  }

  render() {
    return (
      <div
        role="status"
        aria-live="assertive"
        aria-relevant="additions text"
        style={{
          border: '0',
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: '0',
          position: 'absolute',
          width: '1px',
        }}
      >
        {this.state.statuses.map(this.renderStatus)}
      </div>
    )
  }
}

class ItemContainer extends Component {
  static contextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
  }
  static propTypes = {
    ref: PropTypes.func,
  }
  constructor(props, context) {
    super(props, context)
    this.menu = this.context[MENU_CONTEXT]
    this.ref = compose(node => (this.node = node), this.props.ref)
  }
  componentDidMount() {
    this.menu.itemContainer = this.node
  }
  componentWillUnmount() {
    if (this.menu.itemContainer === this) {
      this.menu.itemContainer = null
    }
  }
  render() {
    return <div {...this.props} ref={this.ref} />
  }
}

class Item extends Component {
  static contextTypes = {
    [MENU_CONTEXT]: PropTypes.object.isRequired,
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }
  static propTypes = {
    onMouseEnter: PropTypes.func,
    onClick: PropTypes.func,
    ref: PropTypes.func,
    index: PropTypes.number.isRequired,
    item: PropTypes.any.isRequired,
  }
  constructor(props, context) {
    super(props, context)
    this.menu = this.context[MENU_CONTEXT]
    this.autocomplete = this.context[AUTOCOMPLETE_CONTEXT]
    this.handleMouseEnter = compose(
      this.handleMouseEnter,
      this.props.onMouseEnter,
    )
    this.handleClick = compose(this.handleClick, this.props.onClick)
    this.ref = compose(node => (this.node = node), this.props.ref)
  }
  handleMouseEnter = () => {
    this.menu.setHighlightedIndex(this.props.index)
  }
  handleClick = () => {
    this.autocomplete.selectItemAtIndex(this.props.index)
  }
  componentWillMount() {
    this.menu.addItemInstance(this)
  }
  componentWillUnmount() {
    this.menu.removeItemInstance(this)
  }
  render() {
    // eslint-disable-next-line no-unused-vars
    const {index, item, ...rest} = this.props
    return (
      <div
        {...rest}
        ref={this.ref}
        onMouseEnter={this.handleMouseEnter}
        onClick={this.handleClick}
      />
    )
  }
}

class Autocomplete extends Component {
  static Input = Input
  static Menu = Menu
  static MenuStatus = MenuStatus
  static Item = Item
  static Controller = Controller
  static ItemContainer = ItemContainer
  static childContextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    ref: PropTypes.func,
    onChange: PropTypes.func.isRequired,
  }

  constructor(...args) {
    super(...args)
    this.ref = compose(node => (this._rootNode = node), this.props.ref)
  }

  input = null

  state = {
    inputValue: null,
    selectedItem: null,
    isOpen: false,
    menu: null,
  }

  setMenu = menuInstance => {
    this.setState({
      menu: menuInstance,
    })
  }

  removeMenu = menuInstance => {
    this.setState(({menu}) => {
      // only remove the menu from the state
      // if the current menu is the same as
      // the one we're trying to remove
      if (menu === menuInstance) {
        return {menu: null}
      }
      return {}
    })
  }

  moveHighlightedIndex = amount => {
    if (!this.state.menu) {
      return
    }
    this.open(() => {
      this.state.menu.changeHighlighedIndex(amount)
    })
  }

  highlightIndex = index => {
    if (!this.state.menu) {
      return
    }
    this.open(() => {
      this.state.menu.setHighlightedIndex(index)
    })
  }

  clearSelection = () => {
    this.setState(
      {
        selectedItem: null,
        inputValue: null,
        isOpen: false,
      },
      () => {
        this.input.focusInput()
      },
    )
  }

  selectItem = item => {
    this.reset()
    this.setState(
      {selectedItem: item, inputValue: this.getInputValue(item)},
      () => {
        this.props.onChange(item)
      },
    )
  }

  selectItemAtIndex = itemIndex => {
    if (itemIndex === null) {
      // no item highlighted
      return
    }
    const itemInstance = this.state.menu.getItemFromIndex(itemIndex)
    if (!itemInstance) {
      // TODO: see if this is even possible?
      return
    }
    this.selectItem(itemInstance.props.item)
  }

  selectHighlightedItem = () => {
    return this.selectItemAtIndex(
      this.state.menu ? this.state.menu.state.highlightedIndex : null,
    )
  }

  getControllerStateAndHelpers() {
    const {selectedItem, inputValue, isOpen} = this.state
    const menu = this.state.menu || {state: {}} // handle the null case (before the menu's been rendered)
    const {
      toggleMenu,
      openMenu,
      closeMenu,
      clearSelection,
      selectItem,
      selectItemAtIndex,
      selectHighlightedItem,
    } = this
    const {setHighlightedIndex} = menu
    const {highlightedIndex} = menu.state
    return {
      selectedItem,
      selectItem,
      selectItemAtIndex,
      selectHighlightedItem,
      highlightedIndex,
      setHighlightedIndex,
      inputValue,
      isOpen,
      toggleMenu,
      openMenu,
      closeMenu,
      clearSelection,
    }
  }

  reset = () => {
    this.setState(
      ({selectedItem}) => ({
        isOpen: false,
        inputValue: this.getInputValue(selectedItem),
      }),
      () => {
        this.state.menu && this.state.menu.reset()
        this.input && this.input.reset()
      },
    )
  }

  open = cb => {
    if (this.state.isOpen) {
      cbToCb(cb)()
    } else {
      this.setState({isOpen: true}, cbToCb(cb))
    }
  }

  toggleMenu = (newState, cb) => {
    this.setState(({isOpen}) => {
      let nextIsOpen = !isOpen
      if (typeof newState === 'boolean') {
        nextIsOpen = newState
      }
      return {isOpen: nextIsOpen}
    }, cbToCb(cb))
  }

  openMenu = () => {
    this.autocomplete.toggleMenu(true)
  }

  closeMenu = () => {
    this.autocomplete.toggleMenu(false)
  }

  getInputValue = item => {
    return this.input.getValue(item)
  }

  getChildContext() {
    return {[AUTOCOMPLETE_CONTEXT]: this}
  }

  componentDidMount() {
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
        this.reset()
      }
    }
    document.body.addEventListener('mousedown', onMouseDown)
    document.body.addEventListener('mouseup', onMouseUp)

    this.unregisterClickTracker = () => {
      document.body.removeEventListener('mousedown', onMouseDown)
      document.body.removeEventListener('mouseup', onMouseUp)
    }
  }

  componentWillUnmount() {
    this.unregisterClickTracker() // avoids memory leak
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {ref, onChange, ...rest} = this.props
    return <div {...rest} ref={this.ref} />
  }
}

export default Autocomplete

/**
 * Accepts a parameter and returns it if it's a function
 * or a noop function if it's not. This allows us to
 * accept a callback, but not worry about it if it's not
 * passed.
 * @param {Function} cb the callback
 * @return {Function} a function
 */
function cbToCb(cb) {
  return typeof cb === 'function' ? cb : noop
}
function noop() {}
