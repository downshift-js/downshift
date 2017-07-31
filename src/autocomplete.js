import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Button from './button'
import Controller from './controller'
import Input from './input'
import Item from './item'
import Status from './status'
import {cbToCb, scrollIntoView} from './utils'
import {AUTOCOMPLETE_CONTEXT} from './constants'

class Autocomplete extends Component {
  static Button = Button
  static Controller = Controller
  static Input = Input
  static Item = Item
  static childContextTypes = {
    [AUTOCOMPLETE_CONTEXT]: PropTypes.object.isRequired,
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    component: PropTypes.any,
    defaultSelectedIndex: PropTypes.string,
    defaultHighlightedIndex: PropTypes.number,
    getA11yStatusMessage: PropTypes.func,
    getValue: PropTypes.func,
    innerRef: PropTypes.func,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    component: 'div',
    defaultHighlightedIndex: null,
    getValue: i => String(i),
    innerRef: () => {},
  }

  ref = node => {
    this._rootNode = node
    this.props.innerRef(node)
  }

  input = null
  items = []
  state = {
    highlightedIndex: null,
    value: null,
    isOpen: false,
    selectedItem: null,
  }

  addItemInstance(itemInstance) {
    this.items.push(itemInstance)
    this.forceUpdate()
  }

  removeItemInstance(itemInstance) {
    const index = this.items.indexOf(itemInstance)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
    this.forceUpdate()
  }

  getItemFromIndex = index => {
    if (!this.items || !this.items[0]) {
      return null
    }
    return this.items.find(itemInstance => {
      return itemInstance.props.index === index
    })
  }

  getIndexFromItem = item => {
    let itemIndex = -1
    this.items.forEach((itemInstance, index) => {
      if (itemInstance.props.value === item) {
        itemIndex = index
      }
    })
    return itemIndex
  }

  maybeScrollToHighlightedElement(highlightedIndex, alignToTop) {
    const itemInstance = this.getItemFromIndex(highlightedIndex)
    if (!itemInstance || !itemInstance.node) {
      return
    }
    scrollIntoView(itemInstance.node, alignToTop)
  }

  setHighlightedIndex = (
    highlightedIndex = this.props.defaultHighlightedIndex,
  ) => {
    this.setState({highlightedIndex}, () => {
      this.maybeScrollToHighlightedElement(highlightedIndex)
    })
  }

  highlightSelectedItem = () => {
    const highlightedIndex = this.getIndexFromItem(this.state.selectedItem)
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
        this.input.focusInput()
      },
    )
  }

  selectItem = item => {
    this.reset()
    this.setState({selectedItem: item, value: this.getValue(item)}, () => {
      this.props.onChange(item)
    })
  }

  selectItemAtIndex = itemIndex => {
    if (itemIndex === null) {
      // no item highlighted
      return
    }
    const itemInstance = this.getItemFromIndex(itemIndex)
    if (!itemInstance) {
      // TODO: see if this is even possible?
      return
    }
    this.selectItem(itemInstance.props.value)
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
    }
  }

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
        cbToCb(cb)
      },
    )
  }

  openMenu = () => {
    this.toggleMenu(true)
  }

  closeMenu = () => {
    this.toggleMenu(false)
  }

  getValue = item => {
    return item ? this.props.getValue(item) : null
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
    const {
      component: AutocompleteComponent,
      children,
      // eslint-disable-next-line no-unused-vars
      defaultHighlightedIndex,
      getA11yStatusMessage,
      // eslint-disable-next-line no-unused-vars
      getValue,
      // eslint-disable-next-line no-unused-vars
      onChange,
      // eslint-disable-next-line no-unused-vars
      innerRef,
      ...rest
    } = this.props
    return (
      <AutocompleteComponent ref={this.ref} {...rest}>
        {children}
        <Status
          getA11yStatusMessage={getA11yStatusMessage}
          getItemFromIndex={this.getItemFromIndex}
          getValue={this.getValue}
          highlightedIndex={this.state.highlightedIndex}
          resultCount={this.items.length}
          value={this.state.value}
        />
      </AutocompleteComponent>
    )
  }
}

export default Autocomplete
