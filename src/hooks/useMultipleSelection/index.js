import {useRef, useEffect} from 'react'
import {handleRefs, callAllEventHandlers, normalizeArrowKey} from '../../utils'
import {useEnhancedReducer, getItemIndex} from '../utils'
import {getInitialState, defaultProps} from './utils'
import downshiftMultipleSelectionReducer from './reducer'
import * as stateChangeTypes from './stateChangeTypes'

function useMultipleSelection(userProps = {}) {
  // Props defaults and destructuring.
  const props = {
    ...defaultProps,
    ...userProps,
  }

  // Initial state depending on controlled props.
  const initialState = getInitialState(props)

  // Reducer init.
  const [{activeIndex, items}, dispatch] = useEnhancedReducer(
    downshiftMultipleSelectionReducer,
    initialState,
    props,
  )

  // Refs.
  const isInitialMount = useRef(true)
  const dropdownRef = useRef(null)
  const itemRefs = useRef()
  itemRefs.current = []

  // Effects.
  useEffect(() => {
    if (isInitialMount.current) {
      return
    }

    if (activeIndex === -1) {
      dropdownRef.current.focus()
    } else {
      itemRefs.current[activeIndex].focus()
    }
  }, [activeIndex])
  /* Make initial ref false. */
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // Event handler functions.
  const itemKeyDownHandlers = {
    ArrowLeft(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ItemKeyDownArrowLeft,
      })
    },
    ArrowRight(event) {
      event.preventDefault()

      dispatch({
        type: stateChangeTypes.ItemKeyDownArrowRight,
      })
    },
    Delete() {
      dispatch({
        type: stateChangeTypes.ItemKeyDownDelete,
      })
    },
    Backspace() {
      dispatch({
        type: stateChangeTypes.ItemKeyDownBackspace,
      })
    },
  }
  const dropdownKeyDownHandlers = {
    ArrowLeft() {
      dispatch({
        type: stateChangeTypes.DropdownKeyDownArrowLeft,
      })
    },
    Backspace(event) {
      const element = event.target

      if (
        element instanceof HTMLInputElement && // if we have an input element
        (element.value !== '' || // and it's not clear of text
        element.selectionStart !== 0 || // or there is a text highlight in progress.
          element.selectionEnd !== 0)
      ) {
        return // we don't remove any items.
      }

      dispatch({
        type: stateChangeTypes.DropdownKeyDownBackspace,
      })
    },
  }

  // Event handlers.
  const itemHandleClick = index => {
    dispatch({
      type: stateChangeTypes.ItemClick,
      index,
    })
  }
  const itemHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && itemKeyDownHandlers[key]) {
      itemKeyDownHandlers[key](event)
    }
  }
  const itemHandleRemoveIconClick = index => {
    dispatch({
      type: stateChangeTypes.ItemRemoveIconClick,
      index,
    })
  }
  const dropdownHandleKeyDown = event => {
    const key = normalizeArrowKey(event)
    if (key && dropdownKeyDownHandlers[key]) {
      dropdownKeyDownHandlers[key](event)
    }
  }

  // Getter props.
  const getSelectedItemProps = ({
    refKey = 'ref',
    ref,
    onClick,
    onKeyDown,
    item,
    index,
  } = {}) => {
    const itemIndex = getItemIndex(index, item, items)
    if (itemIndex < 0) {
      throw new Error('Pass either item or item index in getItemProps!')
    }

    return {
      [refKey]: handleRefs(ref, itemNode => {
        if (itemNode) {
          itemRefs.current.push(itemNode)
        }
      }),
      tabIndex: index === activeIndex ? 0 : -1,
      onClick: callAllEventHandlers(onClick, () => {
        itemHandleClick(index)
      }),
      onKeyDown: callAllEventHandlers(onKeyDown, itemHandleKeyDown),
    }
  }
  const getDropdownProps = ({refKey = 'ref', ref, onKeyDown} = {}) => {
    return {
      [refKey]: handleRefs(ref, dropdownNode => {
        if (dropdownNode) {
          dropdownRef.current = dropdownNode
        }
      }),
      onKeyDown: callAllEventHandlers(onKeyDown, dropdownHandleKeyDown),
    }
  }
  const getItemRemoveIconProps = ({index, onClick} = {}) => {
    return {
      onClick: callAllEventHandlers(onClick, () => {
        itemHandleRemoveIconClick(index)
      }),
    }
  }

  // returns
  const addItem = item => {
    dispatch({
      type: stateChangeTypes.FunctionAddItem,
      item,
    })
  }

  return {
    getSelectedItemProps,
    getItemRemoveIconProps,
    getDropdownProps,
    addItem,
    items,
  }
}

export default useMultipleSelection
