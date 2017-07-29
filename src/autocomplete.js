import React, {Component} from 'react'
import PropTypes from 'prop-types'
import mitt from 'mitt'

import Controller from './controller'
import Input from './input'
import Item from './item'
import Menu from './menu'
import {AUTOCOMPLETE_CONTEXT} from './constants'
import {cbToCb, compose} from './utils'

class Autocomplete extends Component {
  static Input = Input
  static Menu = Menu
  static Item = Item
  static Controller = Controller
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

  state = {
    inputValue: null,
    selectedItem: null,
    isOpen: false,
    menu: null,
  }
  input = null
  emitter = mitt()

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
    if (this.state.isOpen) {
      this.open(() => {
        this.state.menu.changeHighlighedIndex(amount)
      })
    } else {
      this.highlightIndex(this.state.menu.props.defaultHighlightedIndex)
    }
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
    this.selectItem(itemInstance.props.value)
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
      },
    )
  }

  open = cb => {
    if (this.state.isOpen) {
      cbToCb(cb)()
    } else {
      this.emitter.emit('menu:open')
      this.setState({isOpen: true}, cbToCb(cb))
    }
  }

  toggleMenu = (newState, cb) => {
    this.setState(({isOpen}) => {
      let nextIsOpen = !isOpen
      if (typeof newState === 'boolean') {
        nextIsOpen = newState
      }
      if (nextIsOpen) {
        this.emitter.emit('menu:open')
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
