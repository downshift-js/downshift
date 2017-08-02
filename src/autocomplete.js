/* eslint camelcase:0 */

import {Component} from 'react'
import PropTypes from 'prop-types'
import setA11yStatus from './set-a11y-status'
import {cbToCb, composeEventHandlers, debounce, scrollIntoView} from './utils'

class Autocomplete extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    defaultSelectedItem: PropTypes.any,
    defaultHighlightedIndex: PropTypes.number,
    getA11yStatusMessage: PropTypes.func,
    getValue: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    defaultSelectedItem: null,
    defaultHighlightedIndex: null,
    getValue: i => String(i),
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
  }

  constructor(...args) {
    super(...args)
    this.state = {
      highlightedIndex: null,
      value: null,
      isOpen: false,
      selectedItem: this.props.defaultSelectedItem,
    }
    this.handleClick = composeEventHandlers(
      this.props.onClick,
      this.handleClick,
    )
  }

  input = null
  items = []

  getItemFromIndex = index => {
    if (!this.items || !this.items[0]) {
      return null
    }
    return this.items.find(item => {
      return item.index === index
    })
  }

  getIndexFromItem = itemValue => {
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
    if (node) {
      scrollIntoView(node, alignToTop)
    }
  }

  setHighlightedIndex = (
    highlightedIndex = this.props.defaultHighlightedIndex,
  ) => {
    this.setState({highlightedIndex}, () => {
      this.maybeScrollToHighlightedElement(highlightedIndex)
    })
  }

  highlightSelectedItem = () => {
    const highlightedIndex = this.getIndexFromItem(this.state.selectedItem) || 0
    this.setState({highlightedIndex}, () => {
      this.maybeScrollToHighlightedElement(highlightedIndex, true)
    })
  }

  highlightIndex = index => {
    this.openMenu(() => {
      this.setHighlightedIndex(index)
    })
  }

  moveHighlightedIndex = amount => {
    if (this.state.isOpen) {
      this.changeHighlighedIndex(amount)
    } else {
      this.highlightIndex()
    }
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
    this.setHighlightedIndex(newIndex)
  }

  clearSelection = () => {
    this.setState(
      {
        selectedItem: null,
        value: null,
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
    this.reset()
    this.setState(
      {selectedItem: itemValue, value: this.getValue(itemValue)},
      () => {
        this.props.onChange(itemValue)
      },
    )
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
    return this.selectItemAtIndex(this.state.highlightedIndex)
  }

  getControllerStateAndHelpers() {
    const {highlightedIndex, value, isOpen, selectedItem} = this.state
    const {
      toggleMenu,
      openMenu,
      closeMenu,
      clearSelection,
      selectItem,
      selectItemAtIndex,
      selectHighlightedItem,
      setHighlightedIndex,
      getRootProps,
      getButtonProps,
      getInputProps,
      getItemProps,
    } = this
    return {
      selectedItem,
      selectItem,
      selectItemAtIndex,
      selectHighlightedItem,
      highlightedIndex,
      setHighlightedIndex,
      value,
      isOpen,
      toggleMenu,
      openMenu,
      closeMenu,
      clearSelection,
      getRootProps,
      getButtonProps,
      getInputProps,
      getItemProps,
    }
  }

  //////////////////////////// ROOT

  rootRef = node => (this._rootNode = node)

  getRootProps = ({refKey = 'ref', onClick, ...rest} = {}) => {
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
      if (this.state.isOpen) {
        this.selectHighlightedItem()
      }
    },

    Escape(event) {
      event.preventDefault()
      this.reset()
    },
  }

  //////////////////////////// BUTTON

  getButtonProps = ({onClick, onKeyDown, ...rest} = {}) => {
    const {isOpen} = this.state
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
    if (this.keyDownHandlers[event.key]) {
      this.keyDownHandlers[event.key].call(this, event)
    } else if (event.key === ' ') {
      event.preventDefault()
      this.toggleMenu()
    }
  }

  button_handleClick = event => {
    event.preventDefault()
    this.toggleMenu()
  }

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ BUTTON

  /////////////////////////////// INPUT

  getInputProps = ({onChange, onKeyDown, onBlur, ...rest} = {}) => {
    const {value, selectedItem, isOpen} = this.state
    return {
      'data-autocomplete-input': true,
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': isOpen,
      autoComplete: 'off',
      value: (value === null ? this.getValue(selectedItem) : value) || '',
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
      this.openMenu(() => {
        this.highlightIndex()
      })
    }
  }

  input_handleChange = event => {
    this.setState({value: event.target.value})
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

  reset = () => {
    this.setState(({selectedItem}) => ({
      isOpen: false,
      highlightedIndex: null,
      value: this.getValue(selectedItem),
    }))
  }

  toggleMenu = (newState, cb) => {
    this.setState(
      ({isOpen}) => {
        let nextIsOpen = !isOpen
        if (typeof newState === 'boolean') {
          nextIsOpen = newState
        }
        return {isOpen: nextIsOpen}
      },
      () => {
        if (this.state.isOpen) {
          this.highlightSelectedItem()
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

  getValue = item => {
    return item ? this.props.getValue(item) : null
  }

  updateStatus = debounce(() => {
    if (!this._isMounted) {
      return
    }
    const item = this.getItemFromIndex(this.state.highlightedIndex) || {}
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
        this.reset()
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
    if (
      prevState.highlightedIndex !== this.state.highlightedIndex ||
      this.state.value !== prevState.value
    ) {
      this.updateStatus()
    }
  }

  componentWillUnmount() {
    this.cleanup() // avoids memory leak
  }

  render() {
    // because the items are rerendered every time we call the children
    // we clear this out each render and
    this.items = []
    const {children} = this.props
    return children(this.getControllerStateAndHelpers())
  }
}

export default Autocomplete
